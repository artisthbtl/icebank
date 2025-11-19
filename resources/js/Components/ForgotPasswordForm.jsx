import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import StatusDisplayCard from '@/Components/StatusDisplayCard';
import '../../css/LoginPage.css';

const forgotPasswordSchema = z.object({
    email: z.email('Invalid email address').min(1, 'Email is required'),
});

const sendResetLink = async (formData) => {
    const { data } = await axios.post(route('auth.forgot-password'), formData);
    return data;
};

export default function ForgotPasswordForm({ onCancel }) {
    const [statusState, setStatusState] = useState({
        show: false,
        status: 'success',
        message: '',
    });

    const { 
        control, 
        handleSubmit, 
        setError,
        formState: { errors, isValid } 
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: 'onChange',
        defaultValues: { email: '' }
    });

    const mutation = useMutation({
        mutationFn: sendResetLink,
        onSuccess: (data) => {
            setStatusState({
                show: true,
                status: 'success',
                message: data.message || 'We have emailed your password reset link!',
            });
        },
        onError: (error) => {
            if (error.response?.status === 422) {
                setError('email', { 
                    type: 'server', 
                    message: error.response.data.message || 'We could not find a user with that email.' 
                });
            } else {
                setStatusState({
                    show: true,
                    status: 'error',
                    message: error.response?.data?.message || 'An unexpected error occurred.',
                });
            }
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    if (statusState.show) {
        return (
            <StatusDisplayCard 
                status={statusState.status}
                message={statusState.message}
                redirectLink={null}
                onReset={statusState.status === 'success' ? onCancel : () => setStatusState({ show: false })}
                btnText={statusState.status === 'success' ? "Back to Login" : "Try Again"}
            />
        );
    }

    return (
        <>
            <Typography component="h1" variant="h4" className="login-title">
                Forgot Password?
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
                Enter your email to receive a reset link.
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

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="login-submit-btn"
                    disabled={!isValid || mutation.isPending}
                    sx={{ textTransform: 'none' }}
                >
                    {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Link'}
                </Button>

                <Button
                    fullWidth
                    onClick={onCancel}
                    sx={{ 
                        mt: 1, 
                        color: '#94A3B8', 
                        textTransform: 'none',
                        '&:hover': { color: '#E2E8F0', backgroundColor: 'transparent' }
                    }}
                >
                    Back to Login
                </Button>
            </Box>
        </>
    );
}