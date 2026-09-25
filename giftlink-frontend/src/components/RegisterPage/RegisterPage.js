import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, name: firstName, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('email', data.email);
                sessionStorage.setItem('name', firstName);
                setIsLoggedIn(true);
                setUserName(firstName);
                navigate('/app');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Register</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group mb-3">
                            <label>First Name</label>
                            <input type="text" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Last Name</label>
                            <input type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Email</label>
                            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Password</label>
                            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                    <p className="mt-3 text-center">
                        Already have an account? <a href="/app/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
