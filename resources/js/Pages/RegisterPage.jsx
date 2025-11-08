import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import StatusModal from '@/Components/StatusModal';
import {
    Typography,
    TextField,
    Button,
    CircularProgress,
    Box
} from '@mui/material';

import '../../css/RegisterPage.css';

const RegisterImage = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-24 h-24 text-blue-500"
        style={{ width: '100%', height: 'auto', maxWidth: '300px', color: '#1976d2' }} // Direct style or add class
    >
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.438-.695Z" clipRule="evenodd" />
    </svg>
);


const registerUser = async (userData) => {
    const { data } = await axios.post('/api/auth/register', userData);
    return data;
};

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        city: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    });

    const [modalState, setModalState] = useState({
        open: false,
        status: 'success',
        message: '',
        redirectLink: null,
    });

    const [validationErrors, setValidationErrors] = useState({});

    const mutation = useMutation({
        mutationFn: registerUser,
        
        onSuccess: (data) => {
            setValidationErrors({});
            setModalState({
                open: true,
                status: 'success',
                message: data.message || 'Registration successful! Please check your email to verify your account.',
                redirectLink: '/login',
            });
            setFormData({
                firstName: '', lastName: '', dateOfBirth: '', city: '',
                email: '', password: '', passwordConfirmation: '',
            });
        },
        
        onError: (error) => {
            if (error.response && error.response.status === 422) {
                const errors = error.response.data.errors;
                setValidationErrors(errors);

                let firstErrorMessage = 'Please fix the errors in the form.';
                if (errors) {
                    const firstErrorKey = Object.keys(errors)[0];
                    if (firstErrorKey && errors[firstErrorKey].length > 0) {
                        firstErrorMessage = errors[firstErrorKey][0];
                    }
                }

                setModalState({
                    open: true,
                    status: 'error',
                    message: firstErrorMessage,
                    redirectLink: null,
                });
            } else {
                setModalState({
                    open: true,
                    status: 'error',
                    message: error.response?.data?.message || 'An unexpected error occurred.',
                    redirectLink: null,
                });
            }
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationErrors({});
        mutation.mutate(formData);
    };

    const closeModal = () => {
        setModalState((prev) => ({ ...prev, open: false }));
    };

    const getError = (field) => {
        return validationErrors[field] ? validationErrors[field][0] : null;
    };

    return (
        <>
            <div className="register-page-wrapper">
                <div className="register-content-area">
                    <div className="register-image-section">
                        <RegisterImage />
                    </div>

                    <div className="register-form-section">
                        <Typography component="h1" variant="h4" className="register-title">
                            Create Your Account
                        </Typography>
                        <Typography variant="subtitle1" className="register-subtitle">
                            Join us and start managing your finances today!
                        </Typography>
                        
                        <Box component="form" onSubmit={handleSubmit} noValidate className="register-form">
                            <div className="register-field-row">
                                <TextField
                                    name="firstName"
                                    label="First Name"
                                    fullWidth
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={!!getError('firstName')}
                                    helperText={getError('firstName')}
                                />
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    fullWidth
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={!!getError('lastName')}
                                    helperText={getError('lastName')}
                                />
                            </div>

                            <div className="register-field-row">
                                <TextField
                                    name="dateOfBirth"
                                    label="Date of Birth"
                                    type="date"
                                    fullWidth
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    error={!!getError('dateOfBirth')}
                                    helperText={getError('dateOfBirth')}
                                />
                                <TextField
                                    name="city"
                                    label="City"
                                    fullWidth
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    error={!!getError('city')}
                                    helperText={getError('city')}
                                />
                            </div>

                            <TextField
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                required
                                value={formData.email}
                                onChange={handleChange}
                                error={!!getError('email')}
                                helperText={getError('email')}
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                fullWidth
                                required
                                value={formData.password}
                                onChange={handleChange}
                                error={!!getError('password')}
                                helperText={getError('password') || "Min 8 chars, mixed case, numbers, symbols."}
                            />
                            <TextField
                                name="passwordConfirmation"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                required
                                value={formData.passwordConfirmation}
                                onChange={handleChange}
                                error={!!getError('passwordConfirmation')}
                                helperText={getError('passwordConfirmation')} // Added helperText for confirmation password
                            />
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="register-submit-btn"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                            </Button>
                        </Box>
                    </div>
                </div>
            </div>

            <StatusModal
                open={modalState.open}
                onClose={closeModal}
                status={modalState.status}
                message={modalState.message}
                redirectLink={modalState.redirectLink}
            />
        </>
    );
}