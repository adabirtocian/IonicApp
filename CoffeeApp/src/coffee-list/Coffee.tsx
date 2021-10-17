import { IonItem, IonLabel } from "@ionic/react";
import React from "react";
import { CoffeeProps } from "./CoffeeProps";

const Coffee: React.FC<CoffeeProps> = ({id,originName, roastedDate,  popular}) => {
    return (
    <IonItem>
      <IonLabel>{originName} -- roasted {roastedDate}</IonLabel>
    </IonItem>
    );
};

export default Coffee;
