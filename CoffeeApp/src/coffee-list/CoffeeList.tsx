import React from "react";
import { IonContent, IonHeader, IonList, IonLoading, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon} from '@ionic/react';
import Coffee from "./Coffee";
import { useCoffees } from "./useCoffeeTypes";
import { getLogger } from '../core';
import { add } from 'ionicons/icons';

const log = getLogger('CoffeeList');

const CoffeeList: React.FC = () => {
    const {coffees, fetching, fetchingError, addCoffee } = useCoffees();
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
                {coffees && (
                    <IonList>
                        {coffees.map( ({id, originName, roastedDate, popular}) => <Coffee key={id} id={id} originName={originName} roastedDate={roastedDate} popular={popular} /> )}
                    </IonList>    
                )}

                {fetchingError && (
                    <div>{fetchingError.message || 'Failed to fetch coffees'}</div>
                )}

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={addCoffee}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default CoffeeList;
