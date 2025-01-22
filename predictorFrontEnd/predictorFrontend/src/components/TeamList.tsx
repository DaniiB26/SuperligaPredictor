import React, { useState, useEffect } from 'react';
import { IonGrid, IonRow, IonCol, IonImg, IonLabel, IonThumbnail } from '@ionic/react';
import axios from '../api/axiosConfig';
import './TeamList.css';

interface Team {
    id: string;
    name: string;
    logo: string;
}

const TeamList: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get('/teams');
                console.log('Teams:', response.data);
                setTeams(response.data);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    return (
        <IonGrid>
            <IonRow>
                {teams.map((team) => (
                    <IonCol
                        className="team-container"
                        size="3"
                        sizeSm="3"
                        sizeMd="3"
                        sizeLg="2"
                        key={team.id}
                    >
                        <IonImg src={team.logo} alt={`${team.name} logo`} />

                        <IonLabel>
                            <h3>{team.name}</h3>
                        </IonLabel>
                    </IonCol>
                ))}
            </IonRow>
        </IonGrid>
    );
};

export default TeamList;
