import React, {useCallback, useContext, useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import { getLogger } from '../core';
import { CoffeeProps } from './CoffeeProps';
import { createCoffee, getCoffees, updateCoffee, newWebSocket } from './CoffeeApi';
import {AuthContext} from "../auth";

const log = getLogger('CoffeeProvider');

type SaveCoffeeFn = (coffee: CoffeeProps) => Promise<any>;

export interface CoffeesState {
    coffees?: CoffeeProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveCoffee?: SaveCoffeeFn,
}

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: CoffeesState = {
    fetching: false,
    saving: false,
}

const FETCH_COFFEES_STARTED = 'FETCH_COFFEES_STARTED';
const FETCH_COFFEES_SUCCEEDED = 'FETCH_COFFEES_SUCCEEDED';
const FETCH_COFFEES_FAILED = 'FETCH_COFFEES_FAILED';
const SAVE_COFFEE_STARTED = 'SAVE_COFFEE_STARTED';
const SAVE_COFFEE_SUCCEEDED = 'SAVE_COFFEE_SUCCEEDED';
const SAVE_COFFEE_FAILED = 'SAVE_COFFEE_FAILED';

const reducer: (state: CoffeesState, action: ActionProps) => CoffeesState =
    (state, {type, payload}) => {
        switch (type) {
            case FETCH_COFFEES_STARTED:
                return {...state, fetching: true, fetchingError:null};
            case FETCH_COFFEES_SUCCEEDED:
                return {...state, coffees: payload.coffees, fetching: false};
            case FETCH_COFFEES_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            case SAVE_COFFEE_STARTED:
                return {...state, savingError: null, saving:true};
            case SAVE_COFFEE_SUCCEEDED:
                const coffees = [...(state.coffees || [])];
                const coffee = payload.coffee;
                const index = coffees.findIndex(c => c._id === coffee.id);
                if(index === -1) {
                    coffees.splice(0, 0, coffee);
                } else {
                    coffees[index] = coffee;
                }

                return {...state, coffees, saving: false};
            case SAVE_COFFEE_FAILED:
                return {...state, savingError: payload.error, saving:false};
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
    const { coffees, fetching, fetchingError, saving, savingError} = state;
    useEffect(getCoffeesEffect, [token]);
    useEffect(wsEffect, [token]);
    const saveCoffee = useCallback<SaveCoffeeFn>(saveCoffeeCallback, [token]);
    const value = {coffees, fetching, fetchingError, saving, savingError, saveCoffee };
    log('returns');
    return (
        <CoffeeContext.Provider value={value}>
            {children}
        </CoffeeContext.Provider>
    );

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
                const coffees =await getCoffees(token);
                log('fetchCoffees succeeded');
                if(!canceled) {
                    dispatch({type: FETCH_COFFEES_SUCCEEDED, payload: { coffees } });
                }
            } catch(error: any) {
                log('fetchCoffees failed');
                dispatch({ type: FETCH_COFFEES_FAILED, payload: {error} });
            }
        }
    }

    async function saveCoffeeCallback(coffee: CoffeeProps) {
        try {
            log('saveCoffee started');
            dispatch({type: SAVE_COFFEE_STARTED});
            const savedCoffee = await (coffee._id !== undefined ? updateCoffee(token, coffee) : createCoffee(token, coffee));
            log('saveCoffee succeeded');
            dispatch({type: SAVE_COFFEE_SUCCEEDED, payload: {coffee: savedCoffee}});

        } catch(error) {
            log('saveCoffee failed');
            dispatch({type: SAVE_COFFEE_FAILED, payload: { error }});
        }
    }

    function wsEffect() {
        let canceled = false;
        log('wsEffect - connecting');
        let closeWebSocket: () => void;
        if (token?.trim()) {
            closeWebSocket = newWebSocket(token, message => {
                if (canceled) {
                    return;
                }
                const { type, payload: coffee } = message;
                log(`ws message, item ${type}`);
                if (type === 'created' || type === 'updated') {
                    dispatch({ type: SAVE_COFFEE_SUCCEEDED, payload: { coffee } });
                }
            });
        }
        return () => {
            log('wsEffect - disconnecting');
            canceled = true;
            closeWebSocket?.();
        }
    }
};

