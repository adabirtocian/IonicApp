import axios from 'axios';
import { getLogger } from '../core';
import { CoffeeProps } from './CoffeeProps';

const log = getLogger('itemApi');

const baseUrl = 'http://localhost:3000';

export const getCoffees: () => Promise<CoffeeProps[]> | any = () => {
    log('getCoffees - started');
    return axios
        .get(`${baseUrl}/coffee`)
        .then(res => {
            log('getCoffees - succeeded');
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log('getCoffees - failed');
            return Promise.reject(err);
        });
}