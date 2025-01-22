import React from 'react';
import './MatchCard.css';
import { Match } from '../types';

interface MatchCardProps {
    match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const matchDate = new Date(match.matchDate);

    const dayShortcuts: Record<string, string> = {
        luni: 'lu.',
        marți: 'ma.',
        miercuri: 'mi.',
        joi: 'jo.',
        vineri: 'vi.',
        sâmbătă: 'sa.',
        duminică: 'du.'
    };

    const getFormattedDay = (date: Date) => {
        const dayFull = date.toLocaleDateString('ro-RO', { weekday: 'long' });
        return dayShortcuts[dayFull] || dayFull;
    };

    const formattedDate = `${getFormattedDay(matchDate)} ${matchDate.toLocaleDateString('ro-RO', { month: 'short', day: 'numeric' })}`;
    const formattedTime = matchDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const hasMatchOccurred = match.status === 'completed';

    return (
        <div className="match-card">
            <div className="team">
                <img src={match.home.logo} alt={match.home.name} className="team-logo" />
                <span className="team-name">{match.home.name}</span>
            </div>
            <div className="match-info">
                <span className="match-date">{formattedDate}</span>
                <span className="match-time">{formattedTime}</span>
                {hasMatchOccurred ? (
                    <>
                        <span className="ft">FT:</span>
                        <span className="score">{match.homeScore} - {match.awayScore}</span>
                    </>
                ) : (
                    <span className="upcoming">Meciul nu a avut loc</span>
                )}
            </div>
            <div className="team">
                <img src={match.away.logo} alt={match.away.name} className="team-logo" />
                <span className="team-name">{match.away.name}</span>
            </div>
        </div>
    );
};

export default MatchCard;