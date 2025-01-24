import React, { useState } from 'react';
import { IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Signup.css';
import { signup } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { login } = useAuth();

    const handleSignup = async () => {
        if (!username || !email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await signup(username, email, password);
            // //console.log("Signup successful!", { username, email, password });

            if (response.token) {
                login(username, response.token);
                setMessage('Signup successful! Redirecting...');
                setTimeout(() => {
                    history.push('/home');
                }, 1500);
            } else {
                setMessage('Signup failed! Please try again.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Signup failed!');
        } finally {
            setLoading(false);
        }
    };

    const navigateToLogin = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        history.push('/login');
    };

    return (
        <IonPage>
            <div className="signup-container">
                <IonCard className="signup-card">
                    <img src="/Logo.png" alt="Superliga Predictor" className="signup-logo" />
                    <IonCardContent>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="signup-input"
                            />
                        </div>
                        <button className="signup-button" onClick={handleSignup} disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </button>
                        {message && (
                            <IonText color={message.includes('successful') ? 'success' : 'danger'}>
                                <p>{message}</p>
                            </IonText>
                        )}
                        <p className="login-link">
                            Already have an account?{' '}
                            <a href="login" onClick={navigateToLogin}>Log in here</a>
                        </p>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonPage>
    );
};

export default Signup;
