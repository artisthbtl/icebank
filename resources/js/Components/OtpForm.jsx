import React from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const otpSchema = z.object({
    otp: z.string().min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits'),
});

const verifyOtp = async (otpData) => {
    const { data } = await axios.post('/auth/verify-otp', otpData);
    return data;
};

export default function OtpForm({ userId }) {

    const { 
        control, 
        handleSubmit, 
        setError,
        formState: { errors, isValid: isFormValid } 
    } = useForm({
        resolver: zodResolver(otpSchema),
        mode: 'onChange',
        defaultValues: {
            otp: '',
        }
    });

    const mutation = useMutation({
        mutationFn: verifyOtp,
        
        onSuccess: (data) => {
            window.location.href = '/dashboard'; 
        },
        
        onError: (error) => {
            let message = 'An unknown error occurred.';
            if (error.response) {
                if (error.response.status === 401) {
                    message = error.response.data.error || 'Invalid or expired OTP.';
                } else if (error.response.status === 422) {
                    message = 'Validation failed. Please try again.';
                } else {
                    message = error.response.data.message || 'An unexpected error occurred.';
                }
            }
            setError('root.serverError', { type: 'manual', message: message });
        },
    });

    const onSubmit = (data) => {
        setError('root.serverError', { type: 'manual', message: undefined });
        mutation.mutate({ otp: data.otp, userId: userId });
    };

    return (
        <>
            <Typography component="h1" variant="h4" className="login-title">
                Check Your Email
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
                We sent a 6-digit code to your email.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="login-form">
                <Controller
                    name="otp"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="6-Digit Code"
                            type="text"
                            fullWidth
                            required
                            error={!!errors.otp}
                            helperText={errors.otp?.message}
                            
                            sx={{
                                '& .MuiInputBase-input': { 
                                    textAlign: 'center', 
                                    fontSize: '1.25rem',
                                    letterSpacing: '0.5rem'
                                }
                            }}
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
                    {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
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
                
            </Box>
        </>
    );
}