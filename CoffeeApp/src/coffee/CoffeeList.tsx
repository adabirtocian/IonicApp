import React, {useContext} from "react";
import { RouteComponentProps } from 'react-router';
import { IonContent, IonHeader, IonList, IonLoading, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon} from '@ionic/react';
import Coffee from "./Coffee";
import { getLogger } from '../core';
import { add } from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';
import { useBackgroundTask } from './useBackgroundTask';

const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({ history }) => {
    const { appState } = useAppState();
    const { networkStatus } = useNetwork();
    useBackgroundTask(() => new Promise(resolve => {
        console.log('My Background Task');
        resolve();
    }));
    const {coffees, fetching, fetchingError} = useContext(CoffeeContext);
    log('render');
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Coffee App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message="Fetching coffees"/>
                <div>App state: {appState.isActive ? "active" : "not active"}</div>
                <div>Network status: { networkStatus.connected ?  "online" : "offline"}</div>
                {coffees && (
                    <IonList>
                        {coffees.map( ({_id, originName, roastedDate, popular}) =>
                            <Coffee key={_id} _id={_id} originName={originName} roastedDate={roastedDate} popular={popular}
                                    onEdit={
                                        _id => {
                                            console.log(_id);
                                            history.push(`/coffee/${_id}`)
                                        }
                                    } /> )}
                    </IonList>    
                )}

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch coffees'}</div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push('/coffee')}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default CoffeeList;
