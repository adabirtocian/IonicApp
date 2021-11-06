import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../../core';
import { CoffeeProps } from './CoffeeProps';
import {createCoffee, getCoffees, updateCoffee, newWebSocket, getSomeCoffees, filterCoffees} from './CoffeeApi';
import {AuthContext} from "../../auth";


const log = getLogger('CoffeeProvider');
type SaveCoffeeFn = (coffee: CoffeeProps) => Promise<any>;

export interface CoffeesState {
    coffees?: CoffeeProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveCoffee?: SaveCoffeeFn,
    index?: number,
    count?: number,
    disableInfiniteScroll?: boolean,
    fetchMore?: Function,
    originNameSearch?: string,
    setOriginNameSearch?: Function,
    popularFilter?: string,
    setPopularFilter?: Function,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: CoffeesState = {
    fetching: false,
    saving: false,
    index: 0,
    count: 11,
}

const FETCH_COFFEES_STARTED = 'FETCH_COFFEES_STARTED';
const FETCH_COFFEES_SUCCEEDED = 'FETCH_COFFEES_SUCCEEDED';
const FETCH_COFFEES_FAILED = 'FETCH_COFFEES_FAILED';
const SAVE_COFFEE_STARTED = 'SAVE_COFFEE_STARTED';
const SAVE_COFFEE_SUCCEEDED = 'SAVE_COFFEE_SUCCEEDED';
const SAVE_COFFEE_FAILED = 'SAVE_COFFEE_FAILED';
const FETCH_NEXT = 'FETCH_NEXT';
const SET_INFINITE_SCROLL = "SET_INFINITE_SCROLL";
const SET_NAME_SEARCH = 'SET_NAME_SEARCH';
const SET_POPULAR_FILTER = 'SET_POPULAR_FILTER';
const FILTER_COFFEES_STARTED = 'FILTER_COFFEES_STARTED';
const FILTER_COFFEES_SUCCEEDED = 'FILTER_COFFEES_SUCCEEDED';
const FILTER_COFFEES_FAILED = 'FILTER_COFFEES_FAILED';

const reducer: (state: CoffeesState, action: ActionProps) => CoffeesState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_COFFEES_STARTED:
                return {...state, fetching: true, fetchingError:null};
            case FETCH_COFFEES_SUCCEEDED:
                if(payload.pagination) {
                    return {...state, coffees: state.coffees ? [...state.coffees, ...payload.coffees]: payload.coffees, fetching: false};
                }
                return {...state, coffees: payload.coffees, fetching: false};
            case FETCH_COFFEES_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            case SAVE_COFFEE_STARTED:
                return {...state, savingError: null, saving:true};
            case SAVE_COFFEE_SUCCEEDED:
                const coffees = [...(state.coffees || [])];
                const coffee = payload.coffee;
                const index = coffees.findIndex(c => c._id === coffee._id);
                if(index === -1) {
                    coffees.splice(0, 0, coffee);
                } else {
                    coffees[index] = coffee;
                }
                return {...state, coffees, saving: false};
            case SAVE_COFFEE_FAILED:
                return {...state, savingError: payload.error, saving:false};
            case FETCH_NEXT:
                log(state.index);
                return {...state, index: state.index !== undefined && state.count !== undefined ? state.index+ state.count : undefined};
            case SET_INFINITE_SCROLL:
                return {...state, disableInfiniteScroll: payload.disable};
            case SET_NAME_SEARCH:
                return {...state, originNameSearch: payload.originName}
            case SET_POPULAR_FILTER:
                return {...state, coffees: [], index:0, popularFilter: payload.popular}
            case FILTER_COFFEES_STARTED:
                return {...state, fetching: true, fetchingError:null};
            case FILTER_COFFEES_SUCCEEDED:
                return {...state, coffees: payload.coffees, fetching: false};
            case FILTER_COFFEES_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            default:
                return state;
        }
    };

export const CoffeeContext = React.createContext<CoffeesState>(initialState);

interface CoffeeProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const CoffeeProvider: React.FC<CoffeeProviderProps> = ({children}) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { coffees, fetching, fetchingError, saving, savingError, index, count, disableInfiniteScroll,
        originNameSearch, popularFilter} = state;
    useEffect(getCoffeesEffect, [token, index, count]);
    useEffect(filterCoffeesEffect, [token, popularFilter]);
    useEffect(wsEffect, [token]);
    const saveCoffee = useCallback<SaveCoffeeFn>(saveCoffeeCallback, [token]);
    const value = {coffees, fetching, fetchingError, saving, savingError, saveCoffee, fetchMore, disableInfiniteScroll,
        originNameSearch, setOriginNameSearch, popularFilter, setPopularFilter};

    return (
        <CoffeeContext.Provider value={value}>
            {children}
        </CoffeeContext.Provider>
    );

    function fetchMore() {
        dispatch({type: FETCH_NEXT});
    }

    function setOriginNameSearch(originName: string) {
        dispatch({type: SET_NAME_SEARCH, payload: {originName}});
    }

    function setPopularFilter(popular: string) {
        console.log(popular);
        dispatch({type: SET_POPULAR_FILTER, payload: {popular}});
    }

    function getCoffeesEffect() {
        let canceled = false;
        fetchCoffees();
        return () => {
            canceled = true;
        }

        async function fetchCoffees() {
            if(!token?.trim())
            {
                return;
            }
            try{
                log('fetchingCoffees started');
                dispatch({type: FETCH_COFFEES_STARTED});
                let coffees;
                log(index, count);
                if(index !== undefined && count !== undefined) {
                    coffees = await getSomeCoffees(token, index, count);
                    log('fetchSomeCoffees succeeded');
                    if(!canceled) {
                        dispatch({type: FETCH_COFFEES_SUCCEEDED, payload: { coffees, pagination: true } });
                        if (coffees.length < count) {
                            dispatch({type: SET_INFINITE_SCROLL, payload: {disable: true}});
                        }
                    }
                }
                else {
                    coffees = await getCoffees(token);
                    log('fetchCoffees succeeded');
                    if(!canceled) {
                        dispatch({type: FETCH_COFFEES_SUCCEEDED, payload: {coffees}});
                    }
                }
            } catch(error: any) {
                log('fetchCoffees failed');
                dispatch({ type: FETCH_COFFEES_FAILED, payload: {error} });
            }
        }
    }
    function filterCoffeesEffect() {
        let canceled = false;
        getFilteredCoffees();
        return () => {
            canceled = true;
        }

        async function getFilteredCoffees() {
            if(!token?.trim())
            {
                return;
            }
            try{
                log('filterCoffees started');
                dispatch({type: FILTER_COFFEES_STARTED});
                const coffees = await filterCoffees(token, popularFilter);
                log('filterCoffees succeeded');
                if(!canceled) {
                    dispatch({type: FILTER_COFFEES_SUCCEEDED, payload: {coffees}});
                }
            } catch(error: any) {
                log('filterCoffees failed');
                dispatch({ type: FILTER_COFFEES_FAILED, payload: {error} });
            }
        }
    }

    async function saveCoffeeCallback(coffee: CoffeeProps) {
        try {
            log('saveCoffee started');
            dispatch({type: SAVE_COFFEE_STARTED});
            const savedCoffee = await (coffee._id ? updateCoffee(token, coffee) : createCoffee(token, coffee));
            log('saveCoffee succeeded');
            dispatch({type: SAVE_COFFEE_SUCCEEDED, payload: {coffee: savedCoffee}});

        } catch(error) {
            log('saveCoffee failed');
            dispatch({type: SAVE_COFFEE_FAILED, payload: { error }});
        }
    }

    function wsEffect() {
        let canceled = false;
        // log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: coffee } = message;
                // log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_COFFEE_SUCCEEDED, payload: { coffee } });
                }
            });
        }
        return () => {
            // log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};

