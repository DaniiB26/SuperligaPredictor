import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";

const Routes: React.FC = () => {
    return (
        <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" component={Home} exact />
            <Route path="/mypredictions" component={MyPredictionsPage} exact />
            <Route path="/teams" component={Teams} exact />
            <Route path="/matches" component={Matches} exact />
            <Route path="/leaderboard" component={LeaderboardsPage} exact />
            <Redirect from="/" to="/home" exact />
        </>
    );
};

export default Routes;
