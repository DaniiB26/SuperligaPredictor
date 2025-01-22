import React from 'react';
import Header from "../components/Header";
import './Home.css';
import { IonApp, IonContent } from "@ionic/react";

const Home: React.FC = () => {
    return (
        <IonApp>
            <Header />
            <IonContent className="home-page">
                <div className="home-content">
                    <div className="button-container">
                        <button className="home-button" onClick={() => window.location.href = '/matches'}>
                            <span>Results</span>
                        </button>
                        <button className="home-button" onClick={() => window.location.href = '/mypredictions'}>
                            <span>My Predictions</span>
                        </button>
                        <button className="home-button" onClick={() => window.location.href = '/standings'}>
                            <span>League Standings</span>
                        </button>
                        {/* <button className="home-button" onClick={() => window.location.href = '/teams'}>
                            <span>Teams</span>
                        </button> */}
                        <button className="home-button" onClick={() => window.location.href = '/leaderboard'}>
                            <span>Prediction Leaderboard</span>
                        </button>
                    </div>
                    <div className="spacer"></div>
                </div>
            </IonContent>
        </IonApp>
    );
};

export default Home;
