import React from 'react';
import { Link } from '@inertiajs/react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function StatusDisplayCard({ status, message, redirectLink, onReset }) {
    const isSuccess = status === 'success';

    return (
        <Box className="status-card-container">
            <Box>
                {isSuccess ? (
                    <CheckCircleIcon className="status-card-icon success" />
                ) : (
                    <ErrorIcon className="status-card-icon error" />
                )}
            </Box>

            <Typography variant="h5" component="h2" sx={{ mt: 2, fontWeight: 'bold' }}>
                {isSuccess ? 'Success!' : 'An Error Occurred'}
            </Typography>
            
            <Typography className="status-card-message" sx={{ mt: 1, mb: 3 }}>
                {message}
            </Typography>

            {isSuccess && redirectLink && (
                <Button
                    component={Link}
                    href={redirectLink}
                    variant="contained"
                    className="status-card-button"
                >
                    Proceed to Login
                </Button>
            )}

            {!isSuccess && onReset && (
                <Button
                    onClick={onReset}
                    variant="outlined"
                    className="status-card-button-try-again"
                >
                    Try Again
                </Button>
            )}
        </Box>
    );
}