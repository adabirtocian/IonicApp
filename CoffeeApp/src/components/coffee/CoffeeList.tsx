import React, {useContext} from "react";
import {RouteComponentProps} from 'react-router';
import {
    IonContent,
    IonLoading,
    IonPage,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard, IonRouterOutlet, IonButton
} from '@ionic/react';
import Coffee from "./Coffee";
import {getLogger} from '../../core';
import {add} from 'ionicons/icons';
import {CoffeeContext} from "./CoffeeProvider";
import {IonReactRouter} from "@ionic/react-router";
import {AuthProvider, PrivateRoute} from "../../auth";
import { Link } from "react-router-dom";

const log = getLogger('CoffeeList');

const CoffeeList: React.FC<RouteComponentProps> = ({history, location, match}) => {
    const {coffees, fetching, fetchingError} = useContext(CoffeeContext);
    log('render');

    return (
        <IonPage>
            <IonContent>
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
