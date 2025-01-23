import React from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

interface TeamParams {
    name: string;
}

const TeamDetails: React.FC = () => {
    const { name } = useParams<TeamParams>();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{name}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <p>Details for team: {name}</p>
            </IonContent>
        </IonPage>
    );
};

export default TeamDetails;
