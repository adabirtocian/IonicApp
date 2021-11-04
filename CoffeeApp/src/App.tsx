import React from "react";
import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {CoffeeProvider} from "./components/coffee/CoffeeProvider";
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
import CoffeeList from "./components/coffee/CoffeeList";
import CoffeeEdit from "./components/coffee/CoffeeEdit";
import {AuthProvider, Login, PrivateRoute} from "./auth";
import Home from "./components/home/Home";

const App: React.FC = () => (
    <IonApp>
        <IonReactRouter>
            <IonRouterOutlet>
                <AuthProvider>
                    <Route path="/login" component={Login} exact={true}/>
                    <CoffeeProvider>
                        <PrivateRoute component={Home} path="/home" exact={true} />
                        <PrivateRoute component={CoffeeList} path="/coffees" exact={true}/>
                        <PrivateRoute component={CoffeeEdit} path="/coffee" exact={true}/>
                        <PrivateRoute component={CoffeeEdit} path="/coffee/:id" exact={true}/>
                    </CoffeeProvider>
                    <Route exact path="/" render={() => <Redirect to="/home"/>} />
                </AuthProvider>
            </IonRouterOutlet>
        </IonReactRouter>
    </IonApp>
);

export default App;
