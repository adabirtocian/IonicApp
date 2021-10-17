import React from "react";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import CoffeeItem from "./CoffeeType";


const CoffeeList: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Coffee App</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <CoffeeItem id={1} originName={"Brazilia"} roastedDate={new Date(2021, 11, 10)} popular={true}/>
            </IonContent>
        </IonPage>
    );
};

export default CoffeeList;
