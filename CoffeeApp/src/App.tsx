import React from "react";
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {CoffeeProvider} from "./coffee-list/CoffeeProvider";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';

import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';

import '@ionic/react/css/display.css';
/* Theme variables */
import './theme/variables.css';
import CoffeeList from "./coffee-list/CoffeeList";
import CoffeeEdit from "./coffee-list/CoffeeEdit";

const App: React.FC = () => (
    <IonApp>
        <CoffeeProvider>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route path="/coffees" component={CoffeeList} exact={true}/>
                    <Route path="/coffee" component={CoffeeEdit} exact={true}/>
                    <Route path="/coffee/:id" component={CoffeeEdit} exact={true}/>
                    <Route exact path="/" render={ () => <Redirect to="/coffees"/> } />
                </IonRouterOutlet>
            </IonReactRouter>
        </CoffeeProvider>
    </IonApp>
);

export default App;
