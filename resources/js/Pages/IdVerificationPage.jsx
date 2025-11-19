import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { router } from '@inertiajs/react';
import IdVerificationStatus from '@/Components/IdVerificationStatus';
import { Typography, Button, CircularProgress, Box, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../css/IdVerificationPage.css';

const MAX_FILE_SIZE = 2000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const verificationSchema = z.object({
    ktpImage: z.any()
        .refine((files) => files?.[0], "KTP image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png formats are supported."
        ),
    selfieImage: z.any()
        .refine((files) => files?.[0], "Selfie image is required.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 2MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .jpeg, and .png formats are supported."
        ),
});

const uploadVerification = async (formData) => {
    const { data } = await axios.post('/users/verifications', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};

const FileUploadField = ({ field, label, error, helperText, control }) => {
    const fileName = field.value?.[0]?.name || 'No file selected';
    const isError = !!error;

    return (
        <Box className="file-input-wrapper">
            <Controller
                name={field.name}
                control={control}
                render={({ field: controlledField }) => (
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<InsertPhotoIcon />}
                        className="file-upload-btn"
                        sx={{ borderColor: isError ? '#f44336 !important' : undefined }}
                    >
                        {label}
                        <input
                            type="file"
                            hidden
                            accept={ACCEPTED_IMAGE_TYPES.join(',')}
                            onChange={(e) => {
                                controlledField.onChange(e.target.files);
                                controlledField.onBlur();
                            }}
                            onBlur={controlledField.onBlur}
                        />
                    </Button>
                )}
            />
            <Typography 
                variant="caption" 
                className="file-name-text"
                sx={{ 
                    color: isError ? '#f44336 !important' : undefined,
                    fontWeight: isError ? 'bold' : 'normal'
                }}
            >
                {isError ? `* ${helperText}` : `Selected: ${fileName}`}
            </Typography>
        </Box>
    );
};

export default function IdVerificationPage() {
    const [statusState, setStatusState] = useState({
        open: false,
        status: 'error',
        message: '',
    });
    const [globalError, setGlobalError] = useState(null);

    const { control, handleSubmit, setError: setFormError, formState: { errors, isValid: isFormValid } } = useForm({
        resolver: zodResolver(verificationSchema),
        mode: 'onChange',
        defaultValues: {
            ktpImage: null,
            selfieImage: null,
        }
    });

    const mutation = useMutation({
        mutationFn: uploadVerification,

        onSuccess: () => {
            setStatusState({
                open: true,
                status: 'success',
                message: 'Verification request submitted successfully.',
            });
            setTimeout(() => {
                router.visit('/dashboard');
            }, 3000);
        },

        onError: (error) => {
            if (error.response) {
                const data = error.response.data;

                if (error.response.status === 422 && data.errors) {
                    Object.keys(data.errors).forEach((key) => {
                        setFormError(key, { type: 'server', message: data.errors[key][0] });
                    });
                    setGlobalError("Please correct the form errors above.");
                    return;
                } else if (data.message || data.error) {
                    setGlobalError(data.message || data.error || 'An unexpected error occurred.');
                    return;
                }
            }
            setGlobalError('A network error occurred or the server is unavailable.');
        },
    });

    const onSubmit = (data) => {
        setGlobalError(null);

        const formData = new FormData();
        formData.append('ktpImage', data.ktpImage[0]);
        formData.append('selfieImage', data.selfieImage[0]);

        mutation.mutate(formData);
    };

    const resetStatus = () => {
        setStatusState({ open: false, status: 'error', message: '' });
    };

    return (
        <div className="verification-page-wrapper">
            <div className="verification-content-area">
                {!statusState.open ? (
                    <>
                        <Typography component="h1" variant="h4" className="verification-title">
                            Verify Your Identity
                        </Typography>
                        <Typography variant="subtitle1" className="verification-subtitle">
                            Please upload your KTP and a selfie holding your KTP.
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate className="verification-form">
                            <Grid>
                                <Grid item xs={12} sm={6} sx={{ height: { sm: '100%' } }}>
                                    <Controller
                                        name="ktpImage"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadField
                                                field={field}
                                                label="Upload KTP"
                                                error={errors.ktpImage}
                                                helperText={errors.ktpImage?.message}
                                                control={control}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} sx={{ height: { sm: '100%' } }}>
                                    <Controller
                                        name="selfieImage"
                                        control={control}
                                        render={({ field }) => (
                                            <FileUploadField
                                                field={field}
                                                label="Upload Selfie (Holding KTP)"
                                                error={errors.selfieImage}
                                                helperText={errors.selfieImage?.message}
                                                control={control}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {globalError && (
                                <Box className="server-error-text" display="flex" alignItems="center" justifyContent="center">
                                    <ErrorOutlineIcon sx={{ fontSize: 18, mr: 1 }} />
                                    {globalError}
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="verification-submit-btn"
                                disabled={!isFormValid || mutation.isPending}
                            >
                                {mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                            </Button>
                        </Box>
                    </>
                ) : (
                    <IdVerificationStatus 
                        status={statusState.status}
                        message={statusState.message}
                        redirectLink="/dashboard"
                        onReset={resetStatus}
                    />
                )}
            </div>
        </div>
    );
}