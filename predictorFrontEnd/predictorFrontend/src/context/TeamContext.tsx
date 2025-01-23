import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getTeams } from "../api/teamApi";
import { Team } from "../types";

interface TeamContextType {
  teams: Team[];
}

export const TeamContext = createContext<TeamContextType>({
  teams: [],
});

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider: React.FC<TeamProviderProps> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  return (
    <TeamContext.Provider value={{ teams }}>
      {children}
    </TeamContext.Provider>
  );
};
