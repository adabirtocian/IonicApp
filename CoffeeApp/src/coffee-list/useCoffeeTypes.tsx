import { State } from 'ionicons/dist/types/stencil-public-runtime';
import { useEffect, useReducer, useState } from 'react';
import { getLogger } from '../core';
import { CoffeeProps } from './CoffeeProps';
import { getCoffees } from './coffeeTypeApi';

const log = getLogger('useCoffees');

export interface CoffeesState {
    coffees?: CoffeeProps[],
    fetching: boolean,
    fetchingError?: Error,
};

export interface CoffeesProps extends CoffeesState {
    addCoffee: () => void,
};

interface ActionProps {
    type: string,
    payload?: any,
};

const initialState: CoffeesState = {
    coffees: undefined,
    fetching: false,
    fetchingError: undefined,
};
  
const FETCH_COFFEES_STARTED = 'FETCH_COFFEES_STARTED';
const FETCH_COFFEES_SUCCEEDED = 'FETCH_COFFEES_SUCCEEDED';
const FETCH_COFFEES_FAILED = 'FETCH_COFFEES_FAILED';

const reducer: (state: CoffeesState, action: ActionProps) => CoffeesState = 
    (state, {type, payload}) => {
        switch(type) {
            case FETCH_COFFEES_STARTED:
                return {...state, fetching:true};
            case FETCH_COFFEES_SUCCEEDED:
                return {...state, coffees: payload.coffees, fetching: false};
            case FETCH_COFFEES_FAILED:
                return {...state, fetchingError: payload.error, fetching: false};
            default:
                return state;
        }

    };

export const useCoffees: () => CoffeesProps = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { coffees, fetching, fetchingError } = state;
    const addCoffee = () => {
        log('addCoffee - TODO');
    };
    useEffect(getCoffeesEfect, []);
    log('returns');
    return {
        coffees,
        fetching,
        fetchingError,
        addCoffee,
    };

    function getCoffeesEfect() {
        let canceled = false;
        fetchCoffees();
        return () => {
            canceled = true;
        }

        async function fetchCoffees() {
            try{
                log('fetchingCoffees started');
                dispatch({type: FETCH_COFFEES_STARTED});
                const coffees =await getCoffees();
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
};