import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonApp } from '@ionic/react';
import TeamList from '../components/TeamList';

const Teams = () => {
    return (
        <IonApp>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Teams</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <TeamList />
            </IonContent>
        </IonApp>
    );
};

export default Teams;
