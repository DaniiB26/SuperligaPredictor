import React, { createContext, useState, useEffect } from 'react';
import { getTeams } from '../api/teamApi.tsx';

export const TeamContext = createContext({ teams: [] });

export const TeamProvider = ({ children }) => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const data = await getTeams();
            setTeams(data);
        };
        fetchTeams();
    }, []);

    return (
        <TeamContext.Provider value={{ teams }}>
            {children}
        </TeamContext.Provider>
    );
};
