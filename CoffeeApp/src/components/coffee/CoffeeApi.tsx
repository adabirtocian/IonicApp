import axios from 'axios';
import { authConfig, getLogger, withLogs } from '../../core';
import { CoffeeProps } from './CoffeeProps';

const baseUrl = 'localhost:3000';
const coffeeUrl = `http://${baseUrl}/api/coffee`;

export const getCoffees: (token: string) => Promise<CoffeeProps[]> = token => {
    return withLogs(axios.get(coffeeUrl, authConfig(token)), 'getCoffees');
}

export const getSomeCoffees: (token: string, index: number, limit: number) => Promise<CoffeeProps[]> = (token, index, limit) => {
    return withLogs(axios.get(`${coffeeUrl}/${index}/${limit}`, authConfig(token)), 'getSomeCoffees');
}

export const createCoffee: (token: string, coffee: CoffeeProps) => Promise<CoffeeProps[]> = (token, coffee) => {
    return withLogs(axios.post(coffeeUrl, coffee, authConfig(token)), 'createCoffee');
}

export const updateCoffee: (token: string, coffee: CoffeeProps) => Promise<CoffeeProps[]> = (token, coffee) => {
    return withLogs(axios.put(`${coffeeUrl}/${coffee._id}`, coffee, authConfig(token)), 'updateCoffee');
}

export const filterCoffees: (token: string, popularFilter:string | undefined) => Promise<CoffeeProps[]> = (token, popularFilter) => {
    return withLogs(axios.get(`${coffeeUrl}/${popularFilter}`, authConfig(token)), 'filterCoffees');
}
interface MessageData {
    type: string;
    payload: CoffeeProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        // log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        // log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        // log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}
