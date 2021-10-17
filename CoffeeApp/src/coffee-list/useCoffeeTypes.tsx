import { useEffect, useState } from 'react';
import { getLogger } from '../core';
import { CoffeeProps } from './CoffeeProps';
import { getCoffees } from './coffeeTypeApi';

const log = getLogger('useItems');

export interface CoffeesState {
    coffees?: CoffeeProps[],
    fetching: boolean,
    fetchingError?: Error,
};

export interface CoffeesProps extends CoffeesState {
    addCoffee: () => void,
};

export const useCoffees: () => CoffeesProps = () => {
    const [state, setState] = useState<CoffeesState>({
        coffees: undefined,
        fetching: false,
        fetchingError: undefined,
    });

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
                setState({...state, fetching: true});
                const coffees =await getCoffees();
                log('fetchCoffees succeeded');
                if(!canceled) {
                    setState({...state, coffees, fetching: false});
                }
            } catch(error: any) {
                log('fetchCoffees failed');
                if(!canceled) {
                    setState({...state, fetchingError:error, fetching: false});
                }
            }

        }
    }

};