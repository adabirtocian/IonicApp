import axios from 'axios';
import { authConfig, baseUrl, getLogger, withLogs } from '../core';
import { CoffeeProps } from './CoffeeProps';

const coffeeUrl = `http://${baseUrl}/api/coffee`;

export const getCoffees: (token: string) => Promise<CoffeeProps[]> = token => {
    return withLogs(axios.get(coffeeUrl, authConfig(token)), 'getCoffees');
}

export const createCoffee: (token: string, coffee: CoffeeProps) => Promise<CoffeeProps[]> = (token, coffee) => {
    return withLogs(axios.post(coffeeUrl, coffee, authConfig(token)), 'createCoffee');
}

export const updateCoffee: (token: string, coffee: CoffeeProps) => Promise<CoffeeProps[]> = (token, coffee) => {
    return withLogs(axios.put(`${coffeeUrl}/${coffee._id}`, coffee, authConfig(token)), 'updateCoffee');
}

interface MessageData {
    type: string;
    payload: CoffeeProps;
}

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}