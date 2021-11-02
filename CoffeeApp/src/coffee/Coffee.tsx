import { IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { CoffeeProps } from "./CoffeeProps";

interface CoffeePropsExt extends  CoffeeProps {
    onEdit: (_id?: number) => void;
}

const Coffee: React.FC<CoffeePropsExt> = ({_id, originName, roastedDate,  popular, onEdit}) => {
    return (
    <IonItem onClick={() => onEdit(_id)}>
      <IonLabel>{_id} -- {originName} -- roasted  {roastedDate} -- {popular? "popular" : "not popular"} </IonLabel>
    </IonItem>
    );
};

export default Coffee;
