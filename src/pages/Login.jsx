// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoginForm from '../components/forms/LoginForm';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext'; // Import useMessage

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showMessage } = useMessage(); // Get showMessage function

    const handleLogin = async (formData) => {
        setLoading(true);

        try {
            const response = await api.post('/login', formData);
            const { access_token, user } = response.data;

            login(user, access_token);
            showMessage(response.data.message || 'Login successful!', 'success'); // Show success message
            navigate('/posts');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
            showMessage(errorMessage, 'error'); // Show error message
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginForm onSubmit={handleLogin} loading={loading} />
    );
}

export default Login;