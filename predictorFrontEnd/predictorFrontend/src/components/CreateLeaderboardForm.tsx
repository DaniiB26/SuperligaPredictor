import React, { useState } from 'react';
import './CreateLeaderboardForm.css';
import { useAuth } from '../context/AuthContext';
import { createLeaderboard } from '../api/leaderboardApi';

interface CreateLeaderboardFormProps {
    onCreate: (name: string, owner: string, privacy: string) => void;
    onCancel: () => void;
}

const CreateLeaderboardForm: React.FC<CreateLeaderboardFormProps> = ({ onCreate, onCancel }) => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [error, setError] = useState<string | null>(null);

    const handleCreate = () => {
        if (!name.trim()) {
            setError('Leaderboard name is required.');
            return;
        }
        if (!user) {
            setError('You must be logged in to create a leaderboard.');
            return;
        }

        onCreate(name, user, privacy);
    };

    return (
        <div className="create-leaderboard-form">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leaderboard Name"
                className="leaderboard-name-input"
            />
            <div className="privacy-options">
                <label>
                    <input
                        type="radio"
                        value="public"
                        checked={privacy === 'public'}
                        onChange={() => setPrivacy('public')}
                    />
                    Public
                </label>
                <label>
                    <input
                        type="radio"
                        value="private"
                        checked={privacy === 'private'}
                        onChange={() => setPrivacy('private')}
                    />
                    Private
                </label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="form-buttons">
                <button className="create-button" onClick={handleCreate}>Create</button>
                <button className="cancel-button" onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default CreateLeaderboardForm;