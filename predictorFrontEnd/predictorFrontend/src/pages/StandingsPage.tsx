import React, { useEffect, useState } from 'react';
import { IonApp, IonContent } from '@ionic/react';
import { getRealStandings, getPredictionStandings } from '../api/standingsApi';
import { useAuth } from '../context/AuthContext';
import './StandingsPage.css';
import { TeamStanding } from '../types';
import Header from '../components/Header';

const StandingsPage: React.FC = () => {
    const { user } = useAuth();
    const [realStandings, setRealStandings] = useState<TeamStanding[]>([]);
    const [predictionStandings, setPredictionStandings] = useState<TeamStanding[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStandings = async () => {
            if (!user) {
                console.warn("User is null. Cannot fetch prediction standings.");
                setPredictionStandings([]);
                setLoading(false);
                return;
            }

            try {
                const [realData, predictionData] = await Promise.all([
                    getRealStandings(),
                    getPredictionStandings(user)
                ]);
                setRealStandings(realData);
                setPredictionStandings(predictionData);
            } catch (error) {
                console.error('Error fetching standings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [user]);



    if (loading) {
        return <div className="loading-container">Loading standings...</div>;
    }

    return (
        <IonApp>
            <IonContent>
                <Header />
                <div className="standings-container">
                    <div className="standings-section">
                        <h3>Real Match Standings</h3>
                        <table className="standings-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Team</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {realStandings.map((team, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{team.name}</td>
                                        <td>{team.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="standings-section">
                        <h3>Prediction Standings</h3>
                        <table className="standings-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Team</th>
                                    <th>Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictionStandings.map((team, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{team.name}</td>
                                        <td>{team.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </IonContent>
        </IonApp>
    );
};

export default StandingsPage;
