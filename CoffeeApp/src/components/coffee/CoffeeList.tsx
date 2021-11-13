import React, {useContext} from "react";
import {RouteComponentProps} from 'react-router';
import {useAppState} from "../useAppState";
import {useNetwork} from "../useNetwork";
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
    IonButton, IonSearchbar, IonSelect, IonSelectOption, IonToolbar, IonTitle, IonButtons, IonHeader
} from '@ionic/react';
import Coffee from "./Coffee";
import {getLogger} from '../../core';
import {add} from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import {AuthContext} from "../../auth";

const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({history }) => {
    const { coffees, fetching, fetchingError, fetchMore, disableInfiniteScroll, originNameSearch,
        setOriginNameSearch, popularFilter, setPopularFilter} = useContext(CoffeeContext);
    const { logout } = useContext(AuthContext);
    const { appState } = useAppState();
    const { networkStatus } = useNetwork();
    log('render');

    async function searchNext($event: CustomEvent<void>) {
        log("fetch more");
        fetchMore && fetchMore();
        ($event.target as HTMLIonInfiniteScrollElement).complete();
    }
    const handleLogout = () => {
        log('logout');
        logout?.();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome !</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                    </IonButtons>
                    <div>App state: {appState.isActive ? "active" : "not active"}</div>
                    <div>Network status: { networkStatus.connected ?  "online" : "offline"}</div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
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
