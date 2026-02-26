import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Notice how we don't need to manually pass the token here!
                // The Axios interceptor handles it.
                const response = await api.get('profile/');
                setUserData(response.data);
            } catch (err) {
                console.error('Error fetching profile', err);
                setError('Failed to load profile. Please log in again.');
                // If the token is invalid or expired, clear it and kick them out
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

    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
    if (!userData) return <p style={{ textAlign: 'center' }}>Loading profile...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Welcome, {userData.username}!</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>User ID:</strong> {userData.id}</p>
            <button
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
