import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../components/Auth.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('profile/');
                setUserData(response.data);
            } catch (err) {
                console.error('Error fetching profile', err);
                setError('Failed to load profile. Please log in again.');
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
                navigate('/login');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    if (error) return <div className="auth-loading"><div className="auth-error">{error}</div></div>;
    if (!userData) return <div className="auth-loading">Loading profile...</div>;

    // Get initials for the avatar
    const initials = userData.username ? userData.username.charAt(0) : '?';

    return (
        <div className="auth-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>
                    <h2>{userData.username}</h2>
                    <p className="profile-subtitle">Your personal account</p>
                </div>

                <div className="profile-body">
                    <div className="profile-info">
                        <div className="profile-info-row">
                            <div className="profile-info-icon">👤</div>
                            <div className="profile-info-content">
                                <span className="profile-info-label">Username</span>
                                <span className="profile-info-value">{userData.username}</span>
                            </div>
                        </div>
                        <div className="profile-info-row">
                            <div className="profile-info-icon">✉️</div>
                            <div className="profile-info-content">
                                <span className="profile-info-label">Email</span>
                                <span className="profile-info-value">{userData.email}</span>
                            </div>
                        </div>
                        <div className="profile-info-row">
                            <div className="profile-info-icon">🔑</div>
                            <div className="profile-info-content">
                                <span className="profile-info-label">User ID</span>
                                <span className="profile-info-value">{userData.id}</span>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="auth-btn auth-btn-danger">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
