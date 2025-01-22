import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';

export const useTeams = () => {
    return useContext(TeamContext);
};
