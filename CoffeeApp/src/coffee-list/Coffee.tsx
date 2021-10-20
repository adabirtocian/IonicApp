import { IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { CoffeeProps } from "./CoffeeProps";

interface CoffeePropsExt extends  CoffeeProps {
    onEdit: (id?: number) => void;
}

const Coffee: React.FC<CoffeePropsExt> = ({id,originName, roastedDate,  popular, onEdit}) => {
    return (
    <IonItem onClick={() => onEdit(id)}>
      <IonLabel>{id} -- {originName} -- roasted {roastedDate}</IonLabel>
    </IonItem>
    );
};

export default Coffee;
