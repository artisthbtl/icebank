import React, { useState, useRef, useLayoutEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import StatusDisplayCard from '@/Components/StatusDisplayCard';
import OtpForm from '@/Components/OtpForm';
import { Link } from '@inertiajs/react';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import '../../css/LoginPage.css';

const LoginImage = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="login-svg-image"
    >
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.438-.695Z" clipRule="evenodd" />
    </svg>
);

const loginSchema = z.object({
    email: z.email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(1, 'Password is required'),
});

const loginUser = async (userData) => {
    const { data } = await axios.post('/api/auth/login', userData);
    return data;
};


export default function LoginPage() {
    const [currentView, setCurrentView] = useState('login'); // 'login', 'otp', or 'error'
    const [loginUserId, setLoginUserId] = useState(null);
    const [criticalError, setCriticalError] = useState(null);


    const [formHeight, setFormHeight] = useState(null);
    const formSectionRef = useRef(null);

    useLayoutEffect(() => {
        if (formSectionRef.current && currentView === 'login' && !formHeight) {
            setFormHeight(formSectionRef.current.offsetHeight);
        }
    }, [currentView, formHeight]);

    const { 
        control, 
        handleSubmit, 
        reset, 
        setError, 
        formState: { errors, isValid: isFormValid } 
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '', 
            password: '',
        }
    });

    const mutation = useMutation({
        mutationFn: loginUser,
        
        onSuccess: (data) => {
            setLoginUserId(data.userId);
            setCurrentView('otp');
            reset();
        },
        
        onError: (error) => {
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 422) {
                    setError('root.serverError', {
                        type: '401',
                        message: "Invalid Credentials"
                    });
                    return;
                }

                setCriticalError(error.response.data.message || 'An unexpected error occurred.');
                setCurrentView('error');
            } else {
                // Handle network errors
                setCriticalError('A network error occurred. Please try again.');
                setCurrentView('error');
            }
        },
    });

    const onSubmit = (data) => {
        setError('root.serverError', null); 
        mutation.mutate(data);
    };

    const resetToLogin = () => {
        setCurrentView('login');
        setCriticalError(null);
    };

    return (
        <>
            <div className="login-page-wrapper">
                <div className="login-content-area">
                    <div className="login-image-section">
                        <LoginImage />
                        <Typography variant="body1" className="image-quote">
                            "An investment in knowledge pays the best interest." - Benjamin Franklin
                        </Typography>
                    </div>
                    
                    <div 
                        className="login-form-section" 
                        ref={formSectionRef}
                        style={{ 
                            minHeight: formHeight ? `${formHeight}px` : 'auto',
                            transition: 'min-height 0.3s ease'
                        }}
                    >
                        {currentView === 'login' && (
                            <>
                                <Typography component="h1" variant="h4" className="login-title">
                                    Welcome Back!
                                </Typography>
                                <Typography variant="subtitle1" className="login-subtitle">
                                    Sign in to access your account.
                                </Typography>
                                
                                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Email Address"
                                                type="email"
                                                fullWidth
                                                required
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                            />
                                        )}
                                    />
                                    
                                    <Controller
                                        name="password"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Password"
                                                type="password"
                                                fullWidth
                                                required
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                            />
                                        )}
                                    />

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        className="login-submit-btn"
                                        disabled={!isFormValid || mutation.isPending}
                                        sx={{
                                            '&.Mui-disabled': {
                                                cursor: 'not-allowed',
                                                pointerEvents: 'auto' 
                                            }
                                        }}
                                    >
                                        {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                                    </Button>

                                    {errors.root?.serverError && (
                                        <Typography 
                                            role="alert" 
                                            sx={{ 
                                                color: '#FBBF24',
                                                fontSize: '0.9rem', 
                                                textAlign: 'center',
                                                marginTop: '2px',
                                            }}
                                        >
                                            {errors.root.serverError.message}
                                        </Typography>
                                    )}

                                    <Typography variant="body2" className="login-register-link">
                                        Don't have an account?{' '}
                                        <Link href="/register">
                                            Register
                                        </Link>
                                    </Typography>
                                </Box>
                            </>
                        )}

                        {currentView === 'otp' && (
                            <OtpForm userId={loginUserId} />
                        )}

                        {currentView === 'error' && (
                            <StatusDisplayCard 
                                status="error"
                                message={criticalError}
                                redirectLink={null}
                                onReset={resetToLogin}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}