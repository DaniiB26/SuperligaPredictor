import { IonApp, IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import MyPredictions from "../components/MyPredictions";
import React from "react";

const MyPredictionsPage: React.FC = () => {
    return (
        <IonApp>
            <Header />
            <IonContent>
                <MyPredictions />
            </IonContent>
        </IonApp>
    );
};

export default MyPredictionsPage;
