import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";

const AppRoutes: React.FC = () => {
    return (
        <Switch>
            <Route path="/login" component={LoginPage} exact />
            <Route path="/signup" component={SignupPage} exact />
            <Route path="/home" component={Home} exact />
            <Route path="/mypredictions" component={MyPredictionsPage} exact />
            <Route path="/teams" component={Teams} exact />
            <Route path="/matches" component={Matches} exact />
            <Route path="/leaderboard" component={LeaderboardsPage} exact />
            <Redirect from="/" to="/home" exact />
        </Switch>
    );
};

export default AppRoutes;
