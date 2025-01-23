import React, { useEffect, useState, useRef } from 'react';
import { IonApp, IonPage, IonModal, IonContent } from '@ionic/react';
import Header from '../components/Header';
import { getLeaderboards, joinLeaderboardByCode, getPublicLeaderboard, createLeaderboard } from '../api/leaderboardApi';
import { Leaderboard, User } from '../types';
import { useAuth } from '../context/AuthContext';
import './LeaderboardsPage.css';
import CreateLeaderboardForm from '../components/CreateLeaderboardForm';

const LeaderboardsPage: React.FC = () => {
    const { user } = useAuth();
    const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
    const [publicLeaderboard, setPublicLeaderboard] = useState<Leaderboard | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [inviteCode, setInviteCode] = useState<string>('');
    const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showShareModal, setShowShareModal] = useState<boolean>(false);
    const [selectedLeaderboard, setSelectedLeaderboard] = useState<Leaderboard | null>(null);
    const [copySuccess, setCopySuccess] = useState<string>('Copy');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const copyToClipboard = () => {
        if (textAreaRef.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess('Copy'), 2000);
        }
    };

    useEffect(() => {
        const fetchLeaderboards = async () => {
            if (user) {
                try {
                    const fetchedLeaderboards: Leaderboard[] = await getLeaderboards();
                    console.log('Fetched Leaderboards:', fetchedLeaderboards);

                    const userLeaderboards = fetchedLeaderboards.filter((leaderboard) =>
                        leaderboard.users.some((u) => u.username === user) &&
                        leaderboard.name !== 'Public Leaderboard'
                    );

                    userLeaderboards.forEach((leaderboard) => {
                        leaderboard.users.sort((a, b) => b.simplePoints - a.simplePoints);
                    });
                    setLeaderboards(userLeaderboards);

                    const fetchedPublicLeaderboard = await getPublicLeaderboard();
                    if (fetchedPublicLeaderboard) {
                        console.log('Fetched Public Leaderboard:', fetchedPublicLeaderboard);
                        fetchedPublicLeaderboard.users.sort((a: User, b: User) => b.simplePoints - a.simplePoints);
                        setPublicLeaderboard(fetchedPublicLeaderboard);
                    } else {
                        console.warn("No public leaderboard found.");
                        setPublicLeaderboard(null);
                    }

                } catch (error) {
                    console.error('Error fetching leaderboards:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLeaderboards();
    }, [user]);

    const handleJoinLeaderboard = async () => {
        if (inviteCode) {
            try {
                await joinLeaderboardByCode(inviteCode);

                const updatedLeaderboards: Leaderboard[] = await getLeaderboards();
                console.log('Updated Leaderboards after joining:', updatedLeaderboards);

                const userLeaderboards = updatedLeaderboards.filter((leaderboard) =>
                    leaderboard.users.some((u) => u.username === user) &&
                    leaderboard.name !== 'Public Leaderboard'
                );

                userLeaderboards.forEach((leaderboard) => {
                    leaderboard.users.sort((a, b) => b.simplePoints - a.simplePoints);
                });
                setLeaderboards(userLeaderboards);
                setInviteCode('');
                setShowJoinModal(false);
            } catch (error) {
                console.error('Error joining leaderboard:', error);
            }
        }
    };

    const handleCreateLeaderboard = async (name: string, owner: string, privacy: string) => {
        try {
            const newLeaderboard: Leaderboard = await createLeaderboard(name, owner, privacy);
            console.log('Leaderboard created:', newLeaderboard);
            setShowCreateModal(false);

            const updatedLeaderboards: Leaderboard[] = await getLeaderboards();

            const userLeaderboards = updatedLeaderboards.filter((leaderboard) =>
                leaderboard.users.some((u) => u.username === user) &&
                leaderboard.name !== 'Public Leaderboard'
            );

            userLeaderboards.forEach((leaderboard) => {
                leaderboard.users.sort((a, b) => b.simplePoints - a.simplePoints);
            });
            setLeaderboards(userLeaderboards);
        } catch (error) {
            console.error('Error creating leaderboard:', error);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading leaderboards...</div>;
    }

    return (
        <IonApp>
            <Header />
            <IonContent>
                <div className="leaderboards-container">
                    <h2>Your Leaderboards</h2>
                    <div className="leaderboard-list">
                        {leaderboards.map((leaderboard) => (
                            <div className="leaderboard-box" key={leaderboard.id}>
                                {leaderboard.owner.username === user && (
                                    <button
                                        className="share-button"
                                        onClick={() => {
                                            setSelectedLeaderboard(leaderboard);
                                            setShowShareModal(true);
                                        }}
                                    >
                                        <img src="https://www.svgrepo.com/show/32040/share.svg" alt="Share" />
                                    </button>
                                )}
                                <h3 className="leaderboard-title">
                                    {leaderboard.name}
                                </h3>
                                <div className="leaderboard-users">
                                    {leaderboard.users.map((user) => (
                                        <div className="leaderboard-user" key={user.id}>
                                            <span>{user.username}</span>
                                            <span>{user.simplePoints} points</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {publicLeaderboard && (
                        <div className="leaderboard-box">
                            <h3 className="leaderboard-title">Public Leaderboard</h3>
                            {publicLeaderboard.users && publicLeaderboard.users.length > 0 ? (
                                <div className="leaderboard-users">
                                    {publicLeaderboard.users.map((user: User) => (
                                        <div className="leaderboard-user" key={user.id}>
                                            <span>{user.username}</span>
                                            <span>{user.simplePoints} points</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No users found in the Public Leaderboard.</p>
                            )}
                        </div>
                    )}

                    <div className="action-buttons">
                        <button className="create-button" onClick={() => setShowCreateModal(true)}>Create Leaderboard</button>
                        <button className="join-button" onClick={() => setShowJoinModal(true)}>Join Leaderboard</button>
                    </div>

                    <IonModal isOpen={showJoinModal} onDidDismiss={() => setShowJoinModal(false)}>
                        <div className="modal-content">
                            <h3>Join a Leaderboard</h3>
                            <input
                                className="invite-code-input"
                                value={inviteCode}
                                placeholder="Enter invite code"
                                onChange={(e) => setInviteCode(e.target.value)}
                            />
                            <button className="modal-button" onClick={handleJoinLeaderboard}>Join</button>
                            <button className="modal-button cancel-button" onClick={() => setShowJoinModal(false)}>Cancel</button>
                        </div>
                    </IonModal>

                    <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
                        <div className="modal-content">
                            <h3>Create a Leaderboard</h3>
                            <CreateLeaderboardForm
                                onCreate={(name, owner, privacy) => {
                                    handleCreateLeaderboard(name, owner, privacy);
                                }}
                                onCancel={() => setShowCreateModal(false)}
                            />
                        </div>
                    </IonModal>

                    <IonModal isOpen={showShareModal} onDidDismiss={() => setShowShareModal(false)}>
                        <div className="modal-content minimalist-modal">
                            <button className="close-modal-button" onClick={() => setShowShareModal(false)}>✕</button>
                            <h3 className="modal-title">Share Leaderboard</h3>
                            {selectedLeaderboard && (
                                <>
                                    <div className="invite-code-container">
                                        <p className="invite-code-label">Invite Code:</p>
                                        <div className="invite-code-wrapper">
                                            <strong className="invite-code">{selectedLeaderboard.code}</strong>
                                            <textarea
                                                ref={textAreaRef}
                                                value={selectedLeaderboard.code}
                                                readOnly
                                                className="hidden-textarea"
                                            />
                                            <button className="copy-button" onClick={copyToClipboard}>
                                                {copySuccess}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </IonModal>
                </div>
            </IonContent>
        </IonApp>
    );
};

export default LeaderboardsPage;
