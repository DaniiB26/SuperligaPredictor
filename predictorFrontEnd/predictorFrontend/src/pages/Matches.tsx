import React from 'react';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonApp} from '@ionic/react';
import MatchList from '../components/MatchList';
import Header from "../components/Header";

const Matches = () => {
    return (
        <IonApp>
            <Header/>
            <IonContent>
                <MatchList />
            </IonContent>
        </IonApp>
    );
};

export default Matches;
