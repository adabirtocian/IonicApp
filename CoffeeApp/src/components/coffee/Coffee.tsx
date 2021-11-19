import {IonButton, IonItem, IonLabel} from "@ionic/react";
import React, {useState} from "react";
import { CoffeeProps } from "./CoffeeProps";
import {MyMap} from "../map/MyMap";

interface CoffeePropsExt extends  CoffeeProps {
    onEdit: (_id?: number) => void;
}

const Coffee: React.FC<CoffeePropsExt> = ({_id, originName, roastedDate,  popular,lat, lng, onEdit}) => {
    const [mapOpen, setMapOpen] = useState(false);
    return (
    <>
        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{originName} -- roasted  {roastedDate} -- {popular? "popular" : "not popular"} </IonLabel>
            <IonButton onClick={(e) =>
            {
                e.stopPropagation();
                setMapOpen(!mapOpen)
            }
            }>
                {mapOpen ? "Close" : "Show map"}
            </IonButton>
        </IonItem>
        {
            mapOpen && (
                <IonItem>
                    <IonLabel>
                        <MyMap lat={lat} lng={lng}/>
                    </IonLabel>
                </IonItem>
            )
        }
    </>
    );
};

export default Coffee;
