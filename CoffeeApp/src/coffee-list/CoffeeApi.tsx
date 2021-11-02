import axios from 'axios';
import { getLogger } from '../core';
import { CoffeeProps } from './CoffeeProps';

const log = getLogger('CoffeeApi');

const baseUrl = 'http://localhost:3000';
const coffeeUrl = `${baseUrl}/coffee`;

interface ResponseProps<T> {
    data: T;
}
function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type' : 'application/json'
    }
};

export const getCoffees: () => Promise<CoffeeProps[]> = () => {
    return withLogs(axios.get(coffeeUrl, config), 'getCoffees');
}

export const createCoffee: (coffee: CoffeeProps) => Promise<CoffeeProps[]> = coffee => {
    return withLogs(axios.post(coffeeUrl, coffee, config), 'createCoffee');
}

export const updateCoffee: (coffee: CoffeeProps) => Promise<CoffeeProps[]> = coffee => {
    return withLogs(axios.put(`${coffeeUrl}/${coffee.id}`, coffee, config), 'updateCoffee');
}
