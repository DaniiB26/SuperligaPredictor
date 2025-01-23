import React from "react";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect, Switch } from "react-router-dom";

import Home from "./pages/Home";
import Teams from "./pages/Teams";
import Matches from "./pages/Matches";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import StandingsPage from "./pages/StandingsPage";

import { AuthProvider, useAuth } from "./context/AuthContext";

type PrivateRouteProps = {
  path: string;
  component: React.ComponentType<any>;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ path, component: Component }) => {
    const { user, isLoading } = useAuth();
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return user ? (
      <Route path={path} render={(props) => <Component {...props} />} exact />
    ) : (
      <Redirect to="/login" />
    );
  };
  

const App: React.FC = () => {
  return (
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <IonRouterOutlet>
            <Switch>
              {/* Public Routes */}
              <Route path="/signup" component={SignupPage} exact />
              <Route path="/login" component={LoginPage} exact />
              <Route path="/home" component={Home} exact />

              {/* Private Routes */}
              <PrivateRoute path="/mypredictions" component={MyPredictionsPage} />
              <PrivateRoute path="/teams" component={Teams} />
              <PrivateRoute path="/matches" component={Matches} />
              <PrivateRoute path="/leaderboard" component={LeaderboardsPage} />
              <PrivateRoute path="/standings" component={StandingsPage} />

              {/* Redirect root path to home */}
              <Redirect from="/" to="/home" exact />
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
