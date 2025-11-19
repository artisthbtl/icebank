import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { router } from '@inertiajs/react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import '../../css/VerificationRequired.css';

export default function VerificationRequiredModal({ open, onClose, latestVerification }) {
    const status = latestVerification?.data?.status;
    const isPending = status === 'pending';

    const handleGetVerified = () => {
        router.visit('/verify-id');
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="verification-modal-title"
            aria-describedby="verification-modal-description"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)', // Adds that nice blur effect
            }}
        >
            <Box className="verification-modal-paper">
                {isPending ? (
                    <HourglassTopIcon className="verification-modal-icon" sx={{ color: '#FBBF24 !important' }} />
                ) : (
                    <VerifiedUserIcon className="verification-modal-icon" />
                )}

                <Typography id="verification-modal-title" className="verification-modal-title">
                    {isPending ? 'Verification In Progress' : 'Identity Verification Required'}
                </Typography>

                <Typography id="verification-modal-description" className="verification-modal-subtitle">
                    {isPending 
                        ? "We are currently reviewing your verification request. You will be notified once the process is complete."
                        : "To access features like Transfers and Subscriptions, we need to verify your identity first."
                    }
                </Typography>

                {isPending ? (
                    <Button 
                        onClick={onClose}
                        className="verification-modal-btn"
                    >
                        Close
                    </Button>
                ) : (
                    <Button 
                        onClick={handleGetVerified}
                        className="verification-modal-btn"
                    >
                        Get Verified
                    </Button>
                )}
                
                {!isPending && (
                    <Button 
                        onClick={onClose}
                        className="verification-modal-btn-secondary"
                    >
                        Maybe Later
                    </Button>
                )}
            </Box>
        </Modal>
    );
}