import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonCard, IonCardContent, IonText } from '@ionic/react';
import './Login.css';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { login: authLogin } = useAuth();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await login(username, password);

            if (response.token) {
                authLogin(username, response.token);
                setMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    history.push('/home');
                }, 1500);
            }
        } catch (error) {
            setMessage('Login failed! Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const navigateToSignup = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        history.push('/signup');
    };

    return (
        <IonPage>
            <div className="login-container">
                <IonCard className="login-card">
                    <img src="/Logo.png" alt="Superliga Predictor" className="login-logo" />
                    <IonCardContent>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-input"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input"
                            />
                        </div>
                        <button className="login-button" onClick={handleLogin} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        {message && (
                            <IonText color={message.includes('successful') ? 'success' : 'danger'}>
                                <p>{message}</p>
                            </IonText>
                        )}
                        <p className="signup-link">
                            Don't have an account?{' '}
                            <a href="signup" onClick={navigateToSignup}>Sign up here</a>
                        </p>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonPage>
    );
};

export default Login;