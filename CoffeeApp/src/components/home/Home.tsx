import React from "react";
import {useAppState} from "../useAppState";
import {useNetwork} from "../useNetwork";
import {RouteComponentProps} from "react-router";
import {Link, Redirect, Route} from 'react-router-dom';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonTabs,
    IonRouterOutlet,
    IonIcon,
    IonTabBar, IonTabButton, IonLabel, IonButton
} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {CoffeeList} from "../coffee";
import {triangle} from "ionicons/icons";
import {CoffeeProvider} from "../coffee/CoffeeProvider";
import {AuthProvider, Login, PrivateRoute} from "../../auth";
import CoffeeEdit from "../coffee/CoffeeEdit";

const Home: React.FC<RouteComponentProps> = ({ history })  => {
    const { appState } = useAppState();
    const { networkStatus } = useNetwork();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome !</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div>App state: {appState.isActive ? "active" : "not active"}</div>
                <div>Network status: { networkStatus.connected ?  "online" : "offline"}</div>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <CoffeeProvider>
                                <PrivateRoute path="/coffees" component={CoffeeList} exact={true} />
                                <PrivateRoute path="/coffee" component={CoffeeEdit} exact={true}/>
                                <PrivateRoute path="/coffee/:id" component={CoffeeEdit} exact={true}/>
                            </CoffeeProvider>
                            <Route exact path="/" render={() => <Redirect to="/coffees"/>} />
                        </IonRouterOutlet>
                        <IonTabBar slot="bottom">
                            <IonTabButton tab="coffees" href="/coffees">
                                <IonIcon icon={triangle} />
                                <IonLabel>Coffee list</IonLabel>
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </IonReactRouter>
            </IonContent>
        </IonPage>
    );
};

export default Home;
