import React, { useState, useEffect } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonThumbnail,
} from "@ionic/react";
import axiosInstance from "../api/axiosConfig";
import { Team } from "../types";
import "./TeamList.css";

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get<Team[]>("/teams");
        setTeams(response.data);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return <div>Loading teams...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <IonGrid>
      <IonRow>
        {teams.map((team) => (
          <IonCol
            className="team-container"
            size="3"
            sizeSm="3"
            sizeMd="3"
            sizeLg="2"
            key={team.id}
          >
            <IonThumbnail>
              <IonImg src={team.logo} alt={`${team.name} logo`} />
            </IonThumbnail>
            <IonLabel>
              <h3>{team.name}</h3>
            </IonLabel>
          </IonCol>
        ))}
      </IonRow>
    </IonGrid>
  );
};

export default TeamList;
