import React from "react";
import { IonItem, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Team } from "../types";

interface TeamItemProps {
  team: Team;
}

const TeamItem: React.FC<TeamItemProps> = ({ team }) => {
  const history = useHistory();

  return (
    <IonItem button onClick={() => history.push(`/teams/${team.id}`)}>
      <IonLabel>
        <img src={team.logo} alt={`${team.name} logo`} style={{ marginRight: "8px", width: "24px", height: "24px" }} />
        {team.name}
      </IonLabel>
    </IonItem>
  );
};

export default TeamItem;
