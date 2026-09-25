import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('email', data.userEmail);
                sessionStorage.setItem('name', data.userName);
                setIsLoggedIn(true);
                setUserName(data.userName);
                navigate('/app');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>
                    <p className="mt-3 text-center">
                        Don't have an account? <a href="/app/register">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
