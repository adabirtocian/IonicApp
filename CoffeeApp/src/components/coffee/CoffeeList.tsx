import React, {useContext, useState} from "react";
import {RouteComponentProps} from 'react-router';
import {
    IonContent,
    IonLoading,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButton
} from '@ionic/react';
import Coffee from "./Coffee";
import {getLogger} from '../../core';
import {add} from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import { Link } from "react-router-dom";
import {CoffeeProps} from "./CoffeeProps";

const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({history, location, match}) => {
    const { coffees, fetching, fetchingError, fetchMore, disableInfiniteScroll} = useContext(CoffeeContext);
    log('render');

    async function searchNext($event: CustomEvent<void>) {
        log("fetch more");
        fetchMore && fetchMore();

        log(disableInfiniteScroll);
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <Link to='/home'>
                    <IonButton>Go back</IonButton>
                </Link>
                <IonLoading isOpen={fetching} message="Fetching coffees"/>
                {coffees && coffees.map(({_id, originName, roastedDate, popular}) => {
                    return <IonCard key={`${_id}`}>
                        <Coffee key={_id} _id={_id} originName={originName} roastedDate={roastedDate} popular={popular}
                                onEdit={_id => {
                                    history.push(`/coffee/${_id}`)
                                }}/>
                    </IonCard>
                })}
                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch coffees'}</div>
                )}
                <IonInfiniteScroll threshold="30px" disabled={disableInfiniteScroll}
                                   onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent
                        loadingText="Loading more coffees...">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() =>
                    {
                        log("add");
                        history.push('/coffee');
                    }}>
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default CoffeeList;
