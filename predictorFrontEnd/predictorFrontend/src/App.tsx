import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Teams from './pages/Teams';
import Matches from "./pages/Matches";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { AuthProvider, useAuth } from './context/AuthContext';
import MyPredictionsPage from "./pages/MyPredictionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import StandingsPage from './pages/StandingsPage';

const PrivateRoute: React.FC<{ path: string, component: React.FC }> = ({ path, component }) => {
    const { user } = useAuth();
    return user ? (
        <Route path={path} component={component} exact />
    ) : (
        <Redirect to="/login" />
    );
};

const App: React.FC = () => (
    <IonApp>
        <AuthProvider>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Switch>
                        <Route path="/signup" component={SignupPage} exact />
                        <Route path="/login" component={LoginPage} exact />
                        <Route path="/home" component={Home} />
                        <Route path="/mypredictions" component={MyPredictionsPage} />
                        <Route path="/teams" component={Teams} />
                        <Route path="/matches" component={Matches} />
                        <Route path="/leaderboard" component={LeaderboardsPage} />
                        <Route path="/standings" component={StandingsPage} />
                        <Redirect from="/" to="/home" exact />
                    </Switch>
                </IonRouterOutlet>
            </IonReactRouter>
        </AuthProvider>
    </IonApp>
);

export default App;
