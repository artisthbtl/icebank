import React, { useState, useRef, useLayoutEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import StatusDisplayCard from '@/Components/StatusDisplayCard';
import { router } from '@inertiajs/react';
import { Typography, TextField, Button, CircularProgress, Box } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import '../../css/CreatePinPage.css';

const pinSchema = z.object({
    pin: z.string()
        .min(6, 'PIN must be 6 digits')
        .max(6, 'PIN must be 6 digits')
        .regex(/^\d+$/, 'PIN must only contain numbers'),
    pinConfirmation: z.string().min(6, 'Please confirm your PIN'),
}).refine((data) => data.pin === data.pinConfirmation, {
    message: "PINs do not match",
    path: ['pinConfirmation'],
});

const storePin = async (pinData) => {
    const { data } = await axios.post('/api/v1/users/store-pin', pinData);
    return data;
};

export default function CreatePinPage() {
    const [statusState, setStatusState] = useState({
        open: false,
        status: 'error',
        message: '',
    });

    const [formHeight, setFormHeight] = useState(null);
    const formContainerRef = useRef(null);

    useLayoutEffect(() => {
        if (formContainerRef.current && !statusState.open && !formHeight) {
            setFormHeight(formContainerRef.current.offsetHeight);
        }
    }, [statusState.open, formHeight]);

    const { 
        control, 
        handleSubmit, 
        setError,
        formState: { errors, isValid: isFormValid } 
    } = useForm({
        resolver: zodResolver(pinSchema),
        mode: 'onChange',
        defaultValues: {
            pin: '',
            pinConfirmation: '',
        }
    });

    const mutation = useMutation({
        mutationFn: storePin,
        
        onSuccess: () => {
            router.visit('/dashboard');
        },
        
        onError: (error) => {
            if (error.response) {
                if (error.response.status === 422 && error.response.data.errors) {
                    const serverErrors = error.response.data.errors;
                    Object.keys(serverErrors).forEach((key) => {
                        if (key in pinSchema.shape) {
                            setError(key, { type: 'server', message: serverErrors[key][0] });
                        }
                    });
                    return;
                }
                setStatusState({
                    open: true,
                    status: 'error',
                    message: error.response.data.message || 'An unexpected error occurred.',
                });
            } else {
                setStatusState({
                    open: true,
                    status: 'error',
                    message: 'A network error occurred. Please try again.',
                });
            }
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const resetStatus = () => {
        setStatusState({ open: false, status: 'error', message: '' });
    };

    return (
        <>
            <div className="pin-page-wrapper">
                <div 
                    className="pin-content-area"
                    ref={formContainerRef}
                    style={{ 
                        minHeight: formHeight ? `${formHeight}px` : 'auto',
                        transition: 'min-height 0.3s ease'
                    }}
                >
                    {!statusState.open ? (
                        <>
                            <Typography component="h1" variant="h4" className="pin-title">
                                Create Security PIN
                            </Typography>
                            <Typography variant="subtitle1" className="pin-subtitle">
                                This 6-digit PIN will be used to authorize transactions.
                            </Typography>
                            
                            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="pin-form">
                                <Controller
                                    name="pin"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="6-Digit PIN"
                                            type="password"
                                            fullWidth
                                            required
                                            error={!!errors.pin}
                                            helperText={errors.pin?.message}
                                            sx={{
                                                '&.MuiInputBase-input': { 
                                                    inputMode: 'numeric',
                                                    maxLength: 6
                                                }
                                            }}
                                        />
                                    )}
                                />

                                <Controller
                                    name="pinConfirmation"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Confirm 6-Digit PIN"
                                            type="password"
                                            fullWidth
                                            required
                                            error={!!errors.pinConfirmation}
                                            helperText={errors.pinConfirmation?.message}
                                            sx={{
                                                '&.MuiInputBase-input': { 
                                                    inputMode: 'numeric',
                                                    maxLength: 6
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
                                    disabled={!isFormValid || mutation.isPending}
                                    sx={{
                                        '&.Mui-disabled': {
                                            cursor: 'not-allowed',
                                            pointerEvents: 'auto' 
                                        }
                                    }}
                                >
                                    {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save and Continue'}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <StatusDisplayCard 
                            status={statusState.status}
                            message={statusState.message}
                            redirectLink={null}
                            onReset={resetStatus}
                        />
                    )}
                </div>
            </div>
        </>
    );
}