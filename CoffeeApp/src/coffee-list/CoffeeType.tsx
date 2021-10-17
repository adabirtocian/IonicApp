import { IonItem, IonLabel } from "@ionic/react";
import React from "react";

interface CoffeeProps {
    id: number;
    originName: string;
    roastedDate: Date;
    popular: boolean;
}

const CoffeeItem: React.FC<CoffeeProps> = ({id,originName, roastedDate,  popular}) => {
    return (
    <IonItem>
      <IonLabel>{originName} -- roasted {roastedDate}</IonLabel>
    </IonItem>
    );
};

export default CoffeeItem;
