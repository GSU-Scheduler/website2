import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import './Auth.css';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(''); // Clear any previous error messages
        setShowSuccessMessage(false); // Clear success message

        const auth = getAuth();

        try {
            if (isLogin) {
                // Login logic
                await signInWithEmailAndPassword(auth, email, password);
                setShowSuccessMessage(true); // Show login success message
                navigate('/');
            } else {
                // Sign up logic
                await createUserWithEmailAndPassword(auth, email, password);
                setShowSuccessMessage(true); // Show signup success message
                navigate('/');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
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
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="auth-input"
                    required
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