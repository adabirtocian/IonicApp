import React, {useContext, useEffect, useState} from 'react';
import {
    IonButton,
    IonContent,
    IonDatetime,
    IonInput,
    IonLoading,
    IonPage,
    IonToggle,
    IonLabel,
    IonItemDivider, IonToolbar, IonTitle, IonButtons, IonHeader, IonImg, IonFabButton, IonFab, IonIcon
} from '@ionic/react';
import {getLogger} from '../../core';
import {CoffeeContext} from "./CoffeeProvider";
import {RouteComponentProps} from "react-router";
import {CoffeeProps} from "./CoffeeProps";
import {Link} from "react-router-dom";
import {AuthContext} from "../auth";
import {camera} from 'ionicons/icons';
import {usePhotoGallery} from "../camera/usePhotoGallery";
import {MyMap} from "../map/MyMap";

const log = getLogger('CoffeeEdit');

interface CoffeeEditProps extends RouteComponentProps<{
    id?: string;
}> {
}

const CoffeeEdit: React.FC<CoffeeEditProps> = ({history, match}) => {
    const {coffees, saving, savingError, saveCoffee} = useContext(CoffeeContext);
    const [originName, setOriginName] = useState('');
    const [roastedDate, setRoastedDate] = useState('');
    const [popular, setPopular] = useState(false);
    const [coffee, setCoffee] = useState<CoffeeProps>();
    const [photo, setPhoto] = useState('');
    const [lat, setLat] = React.useState(46.7524289);
    const [lng, setLng] = React.useState(23.5872008);
    const [openMap, setOpenMap] = React.useState(false);
    const {takePhoto} = usePhotoGallery();

    const {logout} = useContext(AuthContext);

    useEffect(() => {
        const routeId = match.params.id;
        const coffee = coffees?.find(c => c._id === routeId);
        setCoffee(coffee);

        if (coffee) {
            setOriginName(coffee.originName);
            setPopular(coffee.popular);
            setRoastedDate(coffee.roastedDate.toString());
            setPhoto(coffee.photo);

            if(coffee.lng && coffee.lat) {
                setLat(coffee.lat);
                setLng(coffee.lng);
            }
        }
    }, [match.params.id, coffees]);

    const handleSave = () => {
        const editedCoffee = coffee ? {...coffee, originName, roastedDate: new Date(roastedDate), popular, photo, lat, lng}
            : {originName: originName, roastedDate: new Date(roastedDate), popular: popular, photo: photo, lat: lat, lng: lng};
        saveCoffee && saveCoffee(editedCoffee);
    };
    const handleLogout = () => {
        log('logout');
        logout?.();
    }

    log('render');

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome !</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleLogout}>Logout</IonButton>
                        <Link to='/coffees'>
                            <IonButton onClick={handleSave}>Save</IonButton>
                        </Link>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLabel>Coffee name:</IonLabel>
                <IonInput value={originName} placeholder="originName"
                          onIonChange={e => setOriginName(e.detail.value || '')}/>
                <IonLabel>Roasted date:</IonLabel>
                <IonDatetime value={roastedDate} placeholder="roastedDate" displayFormat="MM DD YY"
                             onIonChange={e => setRoastedDate(e.detail.value || '')}/>
                <IonLabel>Popularity:</IonLabel>
                <IonItemDivider>
                    <IonLabel>Popular coffee </IonLabel>
                    <IonToggle checked={popular} onIonChange={e => setPopular(e.detail.checked)}/>
                </IonItemDivider>
                {photo && <IonImg src={photo}/>}
                <IonButton onClick={() => setOpenMap(!openMap)}>Toggle Map</IonButton>
                {openMap &&
                <MyMap
                    lat={lat}
                    lng={lng}
                    onMapClick={(e: any) => {

                        setLat(e.latLng.lat());
                        setLng(e.latLng.lng());
                    }}
                />}
                <IonFab vertical="bottom" horizontal="center" slot="fixed">
                    <IonFabButton onClick={async () => {
                        try {
                            const image = await takePhoto();
                            setPhoto(image);
                        } catch(e)
                        {
                            console.log("Camera closed");
                        }

                    }}>
                        <IonIcon icon={camera}/>
                    </IonFabButton>
                </IonFab>
                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || 'Failed to save coffee'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default CoffeeEdit;
