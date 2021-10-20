import React, { useContext, useEffect, useState } from 'react';
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime,
    IonHeader,
    IonInput,
    IonLoading,
    IonPage,
    IonTitle, IonToggle,
    IonToolbar
} from '@ionic/react';
import { getLogger } from '../core';
import {CoffeeContext} from "./CoffeeProvider";
import { RouteComponentProps} from "react-router";
import {CoffeeProps} from "./CoffeeProps";

const log = getLogger('CoffeeEdit');

interface CoffeeEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const CoffeeEdit: React.FC<CoffeeEditProps> = ({history, match}) => {
    const { coffees, saving, savingError, saveCoffee } = useContext(CoffeeContext);
    const [originName, setOriginName] = useState('');
    const [roastedDate, setRoastedDate] = useState('');
    const [popular, setPopular] = useState(false);
    const [coffee, setCoffee] = useState<CoffeeProps>();

    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id;
        const coffee = coffees?.find(c => c.id?.toString() === routeId);
        setCoffee(coffee);
        console.log("edit coffee");
        console.log(coffee);

        if(coffee) {
            setOriginName(coffee.originName);
            setPopular(coffee.popular);
            setRoastedDate(coffee.roastedDate.toString());
        }
    }, [match.params.id, coffees]);

    const handleSave = () => {
        console.log(coffee);
        const editedCoffee = coffee ? {...coffee, originName} : { originName: originName, roastedDate: new Date(roastedDate), popular:popular };
        saveCoffee && saveCoffee(editedCoffee).then(() => history.goBack());
    };
    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleSave}>
                            Save
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput value={originName} placeholder="originName" onIonChange={e => setOriginName(e.detail.value || '')} />
                <IonDatetime value={roastedDate} placeholder="roastedDate" displayFormat="MM DD YY" onIonChange={e => setRoastedDate(e.detail.value || '')} />
                <IonToggle checked={popular} onIonChange={e => setPopular(e.detail.checked)} />
                <IonLoading isOpen={saving} />
                {savingError && (
                    <div>{savingError.message || 'Failed to save coffee'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default CoffeeEdit;
