import React, { useState, useEffect } from 'react';
import { Match } from '../types';
import { savePrediction } from '../api/predictionApi';
import { useAuth } from '../context/AuthContext';
import './PredictionCard.css';

interface PredictionCardProps {
    match: Match;
    userPrediction?: {
        predictedHomeScore: number;
        predictedAwayScore: number;
        points: number;
    };
}

const PredictionCard: React.FC<PredictionCardProps> = ({ match, userPrediction }) => {
    const { user } = useAuth();
    const [homePrediction, setHomePrediction] = useState<number | ''>(userPrediction ? userPrediction.predictedHomeScore : '');
    const [awayPrediction, setAwayPrediction] = useState<number | ''>(userPrediction ? userPrediction.predictedAwayScore : '');
    const [message, setMessage] = useState<string>('');
    const matchDate = new Date(match.matchDate);
    const hasMatchStarted = matchDate < new Date();
    const hasMatchOccurred = match.status === 'completed';

    useEffect(() => {
        if (userPrediction) {
            setHomePrediction(userPrediction.predictedHomeScore);
            setAwayPrediction(userPrediction.predictedAwayScore);
        }
    }, [userPrediction]);

    const handleSavePrediction = async () => {
        if (!user) {
            setMessage('User not logged in');
            return;
        }

        if (homePrediction === '' || awayPrediction === '') {
            setMessage('Please enter a prediction for both teams.');
            return;
        }

        try {
            await savePrediction(match.id, user, Number(homePrediction), Number(awayPrediction));
            setMessage('Prediction saved successfully!');
        } catch (error) {
            setMessage('Failed to save prediction.');
            console.error('Error saving prediction:', error);
        }
    };

    return (
        <div className="prediction-card">
            {userPrediction && (
                <div className="points-earned">
                    +{userPrediction.points} pts
                </div>
            )}

            <div className="team">
                <img src={match.home.logo} alt={match.home.name} className="team-logo" />
                <span className="team-name">{match.home.name}</span>
            </div>

            <div className="match-info">
                {hasMatchOccurred ? (
                    <>
                        {userPrediction && (
                            <div className="user-prediction">
                                <span className="score-box">{userPrediction.predictedHomeScore}</span>
                                <span className="score-box">{userPrediction.predictedAwayScore}</span>
                            </div>
                        )}

                        <div className="result">
                            <span className="ft">FT:</span> {match.homeScore} - {match.awayScore}
                        </div>
                    </>
                ) : hasMatchStarted ? (
                    <div className="match-status">Match has started, no predictions allowed.</div>
                ) : (
                    <div className="prediction-form">
                        <div className="prediction-inputs">
                            <input
                                type="number"
                                value={homePrediction}
                                onChange={(e) => setHomePrediction(Number(e.target.value))}
                                className="large-input"
                            />
                            <span className="spacer"></span>
                            <input
                                type="number"
                                value={awayPrediction}
                                onChange={(e) => setAwayPrediction(Number(e.target.value))}
                                className="large-input"
                            />
                        </div>
                        <button onClick={handleSavePrediction}>Save Prediction</button>
                        {message && <div className="message">{message}</div>}
                    </div>
                )}
            </div>

            <div className="team">
                <img src={match.away.logo} alt={match.away.name} className="team-logo" />
                <span className="team-name">{match.away.name}</span>
            </div>
        </div>
    );
};

export default PredictionCard;