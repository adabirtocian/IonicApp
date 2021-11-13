import { SetStateAction, useEffect, useState} from 'react';
import {Network} from "@capacitor/network";

const initialState = {
    connected: false,
    connectionType: 'unknown',
}

export const useNetwork = () => {
    const [networkStatus, setNetworkStatus] = useState(initialState)
    useEffect(() => {
        const handler = Network.addListener('networkStatusChange', handleNetworkStatusChange);
        Network.getStatus().then(handleNetworkStatusChange);
        let canceled = false;
        return () => {
            canceled = true;
            handler.remove();
        }

        function handleNetworkStatusChange(status: SetStateAction<{ connected: boolean; connectionType: string; }>) {
            if (!canceled) {
                setNetworkStatus(status);
            }
        }
    }, [])
    return { networkStatus };
};
