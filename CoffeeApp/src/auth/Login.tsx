import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import {IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonLoading} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { AuthContext } from './AuthProvider';
import { getLogger } from '../core';
import {Storage} from "@capacitor/storage";

const log = getLogger('Login');

interface LoginState {
    username?: string;
    password?: string;
}

export const Login: React.FC<RouteComponentProps> = ({ history}) => {
    const { isAuthenticated, isAuthenticating, login, authenticationError } = useContext(AuthContext);
    const [state, setState] = useState<LoginState>({});
    const { username, password } = state;

    const handleLogin = () => {
        log('handleLogin');
        login?.(username, password);
    };
    log('render');

    if (isAuthenticated) {
        log(isAuthenticated);
        return <Redirect to={{ pathname: '/home' }} />
    }
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Username"
                    value={username}
                    onIonChange={e =>{
                        setState({
                            ...state,
                            username: e.detail.value || ''
                        })
                    } }/>
                <IonInput
                    placeholder="Password"
                    value={password}
                    onIonChange={e => setState({
                        ...state,
                        password: e.detail.value || ''
                    })}/>
                <IonLoading isOpen={isAuthenticating}/>
                {authenticationError && (<div>{authenticationError.message || 'Failed to authenticate'}</div>)}
                <IonButton onClick={handleLogin}>Login</IonButton>
            </IonContent>
        </IonPage>
    );
};
