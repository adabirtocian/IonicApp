import React, {useContext} from "react";
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
    IonButton, IonSearchbar, IonSelect, IonSelectOption
} from '@ionic/react';
import Coffee from "./Coffee";
import {getLogger} from '../../core';
import {add} from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import { Link } from "react-router-dom";

const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({history }) => {
    const { coffees, fetching, fetchingError, fetchMore, disableInfiniteScroll, originNameSearch,
        setOriginNameSearch, popularFilter, setPopularFilter} = useContext(CoffeeContext);
    log('render');

    async function searchNext($event: CustomEvent<void>) {
        log("fetch more");
        fetchMore && fetchMore();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <Link to='/home'>
                    <IonButton>Go back</IonButton>
                </Link>
                <IonSearchbar value={originNameSearch} debounce={1000}
                              onIonChange={(e) => setOriginNameSearch && setOriginNameSearch(e.detail.value!)}/>

                <IonSelect value={popularFilter} placeholder="Select if popular or not"
                    onIonChange={(e) => setPopularFilter && setPopularFilter(e.detail.value) }>
                    <IonSelectOption key="popular" value="popular"> Popular </IonSelectOption>
                    <IonSelectOption key="unpopular" value="unpopular"> Not popular </IonSelectOption>
                </IonSelect>
                <IonLoading isOpen={fetching} message="Fetching coffees"/>
                {coffees &&
                    coffees
                        .filter(originNameSearch && originNameSearch !== ""
                            ? (coffee) => coffee.originName.indexOf(originNameSearch) >= 0
                            : (coffee) => coffee)
                        .map(
                            ({_id,
                                 originName,
                                 roastedDate,
                                 popular}
                            ) => {
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
