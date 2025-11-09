import React, { useState, useRef, useLayoutEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import StatusDisplayCard from '@/Components/StatusDisplayCard';
import { Link } from '@inertiajs/react';
import { Typography, TextField, Button, CircularProgress, Box} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../../css/RegisterPage.css';

const RegisterImage = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="register-svg-image"
    >
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.438-.695Z" clipRule="evenodd" />
    </svg>
);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 17);
const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    dateOfBirth: z.string().min(1, 'Date of birth is required')
        .refine((val) => new Date(val) <= minAgeDate, 'You must be at least 17 years old'),
    city: z.string().min(2, 'City is required').max(100, 'City name is too long'),
    email: z.string().min(1, 'Email is required').z.email('Invalid email address'),
    password: z.string()
        .regex(passwordRegex, "Invalid password format"), 
    passwordConfirmation: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ['passwordConfirmation'],
});

const registerUser = async (userData) => {
    const { data } = await axios.post('/api/auth/register', userData);
    return data;
};

const PasswordHelper = ({ isDirty, error, successMessage }) => {
    if (!isDirty) {
        return null;
    }
    if (error) {
        return (
            <Box className="helper-text-container helper-text-warning">
                <WarningAmberIcon />
                <span>{error.message}</span>
            </Box>
        );
    }
    return (
        <Box className="helper-text-container helper-text-success">
            <CheckCircleIcon />
            <span>{successMessage}</span>
        </Box>
    );
};


export default function RegisterPage() {
    const [statusState, setStatusState] = useState({
        open: false,
        status: 'success',
        message: '',
        redirectLink: null,
    });

    const [formHeight, setFormHeight] = useState(null);
    const formSectionRef = useRef(null);

    useLayoutEffect(() => {
        if (formSectionRef.current && !statusState.open && !formHeight) {
            setFormHeight(formSectionRef.current.offsetHeight);
        }
    }, [statusState.open, formHeight]);

    const { 
        control, 
        handleSubmit, 
        reset, 
        setError, 
        formState: { errors, isValid: isFormValid, dirtyFields } 
    } = useForm({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '', lastName: '', dateOfBirth: '', city: '',
            email: '', password: '', passwordConfirmation: '',
        }
    });

    const mutation = useMutation({
        mutationFn: registerUser,
        
        onSuccess: (data) => {
            setStatusState({
                open: true,
                status: 'success',
                message: data.message || 'Registration successful! Please check your email to verify your account.',
                redirectLink: '/login',
            });
            reset(); 
        },
        
        onError: (error) => {
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors;
                let firstErrorMessage = 'Please fix the errors in the form.';
                if (serverErrors) {
                    Object.keys(serverErrors).forEach((key) => {
                        const fieldName = key;
                        const message = serverErrors[key][0];
                        if (fieldName in registerSchema.shape) {
                            setError(fieldName, { type: 'server', message: message });
                        }
                    });
                    const firstErrorKey = Object.keys(serverErrors)[0];
                    if (firstErrorKey) {
                        firstErrorMessage = serverErrors[firstErrorKey][0];
                    }
                }

                setStatusState({
                    open: true,
                    status: 'error',
                    message: firstErrorMessage,
                    redirectLink: null,
                });
            } else {
                setStatusState({
                    open: true,
                    status: 'error',
                    message: error.response?.data?.message || 'An unexpected error occurred.',
                    redirectLink: null,
                });
            }
        },
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const resetStatus = () => {
        setStatusState((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <div className="register-page-wrapper">
                <div className="register-content-area">
                    <div className="register-image-section">
                        <RegisterImage />
                        <Typography variant="body1" className="image-quote">
                            "Make the money. Don't let it make you." - The Players Club
                        </Typography>
                    </div>

                    <div 
                        className="register-form-section" 
                        ref={formSectionRef}
                        style={{ 
                            minHeight: formHeight ? `${formHeight}px` : 'auto',
                            transition: 'min-height 0.3s ease'
                        }}
                    >
                        {!statusState.open ? (
                            <>
                                <Typography component="h1" variant="h4" className="register-title">
                                    Create Your Account
                                </Typography>
                                <Typography variant="subtitle1" className="register-subtitle">
                                    Join us and start managing your finances today!
                                </Typography>
                                
                                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="register-form">
                                    <div className="register-field-row">
                                        <Controller
                                            name="firstName"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="First Name"
                                                    fullWidth
                                                    required
                                                    error={!!errors.firstName}
                                                    helperText={errors.firstName?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="lastName"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Last Name"
                                                    fullWidth
                                                    required
                                                    error={!!errors.lastName}
                                                    helperText={errors.lastName?.message}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="register-field-row">
                                        <Controller
                                            name="dateOfBirth"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Date of Birth"
                                                    type="date"
                                                    fullWidth
                                                    required
                                                    slotProps={{ inputLabel: { shrink: true } }}
                                                    error={!!errors.dateOfBirth}
                                                    helperText={errors.dateOfBirth?.message}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="City"
                                                    fullWidth
                                                    required
                                                    error={!!errors.city}
                                                    helperText={errors.city?.message}
                                                />
                                            )}
                                        />
                                    </div>

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
                                            <Box sx={{ width: '100%' }}>
                                                <TextField
                                                    {...field}
                                                    label="Password"
                                                    type="password"
                                                    fullWidth
                                                    required
                                                    error={!!errors.password && dirtyFields.password}
                                                />
                                                <PasswordHelper
                                                    isDirty={dirtyFields.password}
                                                    error={errors.password ? { message: "Include 8 chars, lowercase, uppercase, numbers, symbols." } : null}
                                                    successMessage="Password looks strong!"
                                                />
                                            </Box>
                                        )}
                                    />
                                    
                                    <Controller
                                        name="passwordConfirmation"
                                        control={control}
                                        render={({ field }) => (
                                            <Box sx={{ width: '100%' }}>
                                                <TextField
                                                    {...field}
                                                    label="Confirm Password"
                                                    type="password"
                                                    fullWidth
                                                    required
                                                    error={!!errors.passwordConfirmation && dirtyFields.passwordConfirmation}
                                                />
                                                <PasswordHelper
                                                    isDirty={dirtyFields.passwordConfirmation}
                                                    error={errors.passwordConfirmation}
                                                    successMessage="Passwords match!"
                                                />
                                            </Box>
                                        )}
                                    />
                                    
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        className="register-submit-btn"
                                        disabled={!isFormValid || mutation.isPending}
                                        sx={{
                                            '&.Mui-disabled': {
                                                cursor: 'not-allowed',
                                                pointerEvents: 'auto' 
                                            }
                                        }}
                                    >
                                        {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                                    </Button>

                                    <Typography variant="body2" className="register-login-link">
                                        Already have an account?{' '}
                                        <Link href="/login">
                                            Login
                                        </Link>
                                    </Typography>
                                </Box>
                            </>
                        ) : (
                            
                            <StatusDisplayCard 
                                status={statusState.status}
                                message={statusState.message}
                                redirectLink={statusState.redirectLink}
                                onReset={resetStatus}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}