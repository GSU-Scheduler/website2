import React, { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import './Auth.css';
import { db } from '../config/firebase';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
            // Login logic
            try {
                const userDoc = await getDoc(doc(db, 'users', username));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    if (userData?.password === password) {
                        setShowSuccessMessage(true);
                    } else {
                        setError('Invalid username or password');
                    }
                } else {
                    setError('User not found');
                }
            } catch (err) {
                setError('Error during login');
            }
        } else {
            // Signup logic
            try {
                const userDoc = await getDoc(doc(db, 'users', username));
                if (userDoc.exists()) {
                    setError('Username already taken');
                } else {
                    await setDoc(doc(db, 'users', username), { username, email, password });
                    setShowSuccessMessage(true);
                }
            } catch (err) {
                setError('Error during signup');
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-toggle">
                <button onClick={() => setIsLogin(true)} className={isLogin ? 'active' : ''}>Login</button>
                <button onClick={() => setIsLogin(false)} className={!isLogin ? 'active' : ''}>Sign Up</button>
            </div>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleAuth} className="auth-form">
                {!isLogin && (
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="auth-input"
                    />
                )}
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="auth-input"
                    required={!isLogin}
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="auth-input"
                    required
                />
                <button type="submit" className="auth-button">{isLogin ? 'Login' : 'Sign Up'}</button>
            </form>
            {showSuccessMessage && <p className="success-message">{isLogin ? 'Login successful' : 'Signup successful'}</p>}
        </div>
    );
};

export default Auth;