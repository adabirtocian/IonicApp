import React, {useContext, useState} from "react";
import {Redirect, Route} from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import {
    IonContent, IonHeader, IonList, IonLoading, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonButton,
    IonButtons, IonInfiniteScroll, IonInfiniteScrollContent, IonCard } from '@ionic/react';
import Coffee from "./Coffee";
import { getLogger } from '../core';
import { add } from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import { useAppState } from './useAppState';
import { useNetwork } from './useNetwork';


const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({ history }) => {
    const { appState } = useAppState();
    const { networkStatus } = useNetwork();
    const {coffees, fetching, fetchingError} = useContext(CoffeeContext);

    // const handleLogout = () => {
    //     (async () => {
    //         // Clear storage () => Promise<void>
    //         await Storage.clear();
    //         const res = await Storage.get({ key: 'userToken' });
    //         if (res.value) {
    //             log('User found', JSON.parse(res.value));
    //         } else {
    //             log('User not found');
    //         }
    //         return (history.goBack());
    //
    //     })();
    // }
    // async function fetchData() {
    //     const url: string = 'http://localhost:3000/api/coffee';
    //     const res: Response = await fetch(url, {method: 'GET'});
    //     res
    //         .json()
    //         .then(async (res) => {
    //             if (res && res.message && res.message.length > 0) {
    //                 // setItems([...coffees, ...res.message]);
    //                 setDisableInfiniteScroll(res.message.length < 3);
    //             } else {
    //                 setDisableInfiniteScroll(true);
    //             }
    //         })
    //         .catch(err => console.error(err));
    // }

    // async function searchNext($event: CustomEvent<void>) {
    //     await fetchData();
    //     await ($event.target as HTMLIonInfiniteScrollElement).complete();
    // }

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
                {coffees && coffees.map(({_id, originName, roastedDate, popular}) => {
                    return <IonCard key={`${_id}`}>
                                <Coffee key={_id} _id={_id} originName={originName} roastedDate={roastedDate} popular={popular}
                                        onEdit={_id => { history.push(`/coffee/${_id}`)}} />
                          </IonCard>
                })}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch coffees'}</div>
                )}
                {/*<IonInfiniteScroll threshold="400px" disabled={disableInfiniteScroll}*/}
                {/*                   onIonInfinite={(e: CustomEvent<void>) => console.log(e)}>*/}
                {/*    <IonInfiniteScrollContent loadingText="Loading more coffees..."/>*/}
                {/*</IonInfiniteScroll>*/}
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
