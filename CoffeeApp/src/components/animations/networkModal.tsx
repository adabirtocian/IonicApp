import React, {useState} from "react";
import {createAnimation, IonModal, IonButton} from "@ionic/react";
import {useNetwork} from "../useNetwork";

export const NetworkModal: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const { networkStatus } = useNetwork();

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector('ion-backdrop')!)
            .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector('.modal-wrapper')!)
            .keyframes([
                { offset: 0, opacity: '0', transform: 'scale(0)' },
                { offset: 1, opacity: '0.99', transform: 'scale(1)' }
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing('ease-out')
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    }

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction('reverse');
    }

    return (
        <>
            <IonModal isOpen={showModal} enterAnimation={enterAnimation} leaveAnimation={leaveAnimation}>
                <div>Network status: { networkStatus.connected ?  "online" : "offline"}</div>
                <div>Connection: { networkStatus.connectionType }</div>
                <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
            </IonModal>
            <IonButton onClick={() => setShowModal(true)}>Network</IonButton>
        </>
    )

}
