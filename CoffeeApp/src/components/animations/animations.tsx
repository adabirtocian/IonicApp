import {createAnimation} from "@ionic/react";

function cardAnimation() {
    const card = document.querySelectorAll('.coffee-card');
    console.log(card);
    if(card) {
        const animation = createAnimation()
            .addElement(card)
            .duration(1000)
            .direction('alternate')
            .iterations(Infinity)
            .fromTo('transform', 'scale(1,1)', 'scale(0.75, 0.75)');
        animation.play();
    }
}

export default cardAnimation;
