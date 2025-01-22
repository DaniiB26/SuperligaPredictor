import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const TeamItem = ({ team }) => {
    const history = useHistory();

    return (
        <IonItem button onClick={() => history.push(`/teams/${team.name}`)}>
            <IonLabel>{team.name}</IonLabel>
        </IonItem>
    );
};

export default TeamItem;
