// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import RegisterForm from '../components/forms/RegisterForm';
import { useMessage } from '../context/MessageContext'; // Import useMessage

function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showMessage } = useMessage(); // Get showMessage function

    const handleRegister = async (formData) => {
        setLoading(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            const response = await api.post('/register', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showMessage(response.data.message || 'Registration successful! Please log in.', 'success');
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed.';
            showMessage(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <RegisterForm onSubmit={handleRegister} loading={loading} />
    );
}

export default Register;