import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLoading} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import {Storage} from "@capacitor/storage";

const log = getLogger('Logout');

export const Logout: React.FC<RouteComponentProps> = ({ history}) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);

    log('render');
    (async () => {
        const res = await Storage.get({ key: 'userToken' });
        if (res.value) {
            console.log('User found', JSON.parse(res.value));
        } else {
            console.log('User not found');
        }
    })();

    async function handleLogout() {
        await Storage.clear();
    }
    return (
        <IonButton onClick={handleLogout}>Logout</IonButton>
    );
};
