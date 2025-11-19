import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import StatusDisplayCard from '@/Components/StatusDisplayCard';
import { router, Head } from '@inertiajs/react';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Navbar from '@/Components/Navbar';
import '../../css/CreatePinPage.css';

const resetSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
});

const resetPasswordApi = async (data) => {
    const response = await axios.post(route('auth.reset-password'), data);
    return response.data;
};

export default function ResetPasswordPage({ token, email }) {
    const [statusState, setStatusState] = useState({
        open: false,
        status: 'error',
        message: '',
    });

    const { control, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(resetSchema),
        mode: 'onChange',
        defaultValues: {
            password: '',
            passwordConfirmation: '',
        }
    });

    const mutation = useMutation({
        mutationFn: resetPasswordApi,
        onSuccess: () => {
            setStatusState({
                open: true,
                status: 'success',
                message: 'Password reset successful! You can now login.',
            });
        },
        onError: (error) => {
            setStatusState({
                open: true,
                status: 'error',
                message: error.response?.data?.message || 'Failed to reset password.',
            });
        },
    });

    const onSubmit = (data) => {
        mutation.mutate({
            token: token,
            email: email,
            password: data.password,
            password_confirmation: data.passwordConfirmation,
        });
    };

    return (
        <>
            <Head title="Reset Password" />
            <Navbar />
            <div className="pin-page-wrapper">
                <div className="pin-content-area">
                    {!statusState.open ? (
                        <>
                            <Typography component="h1" variant="h4" className="pin-title">
                                Reset Password
                            </Typography>
                            <Typography variant="subtitle1" className="pin-subtitle">
                                Enter your new password below.
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit(onSubmit)} className="pin-form">
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="New Password"
                                            type="password"
                                            fullWidth
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            sx={{
                                                '& .MuiInputBase-input': { color: '#E2E8F0' },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#38BDF8' },
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="passwordConfirmation"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Confirm Password"
                                            type="password"
                                            fullWidth
                                            error={!!errors.passwordConfirmation}
                                            helperText={errors.passwordConfirmation?.message}
                                            sx={{
                                                '& .MuiInputBase-input': { color: '#E2E8F0' },
                                                '& .MuiInputLabel-root': { color: '#94A3B8' },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: '#334155' },
                                                    '&:hover fieldset': { borderColor: '#38BDF8' },
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className="pin-submit-btn"
                                    disabled={!isValid || mutation.isPending}
                                >
                                    {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <StatusDisplayCard
                            status={statusState.status}
                            message={statusState.message}
                            redirectLink={statusState.status === 'success' ? route('login') : null}
                            onReset={() => setStatusState({ ...statusState, open: false })}
                            btnText={statusState.status === 'success' ? "Go to Login" : "Try Again"}
                        />
                    )}
                </div>
            </div>
        </>
    );
}