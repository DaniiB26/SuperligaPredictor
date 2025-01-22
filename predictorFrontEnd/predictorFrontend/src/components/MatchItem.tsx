import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { Match } from '../types';

interface MatchItemProps {
    match: Match;
    onClick: () => void;
}

const MatchItem: React.FC<MatchItemProps> = ({ match, onClick }) => {
    const matchDate = new Date(match.matchDate);
    const formattedDate = matchDate.toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' });
    const formattedTime = matchDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const hasMatchOccurred = match.status === 'completed';

    return (
        <IonItem button onClick={onClick}>
            <IonLabel>
                <h2>{match.home.name} vs {match.away.name}</h2>
                <p>{hasMatchOccurred ? `${match.homeScore} - ${match.awayScore}` : `Meciul nu a avut loc`}</p>
                <p>{formattedDate} - {formattedTime}</p>
            </IonLabel>
        </IonItem>
    );
};

export default MatchItem;