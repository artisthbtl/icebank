import React from 'react';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import { router } from '@inertiajs/react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import '../../css/VerificationRequired.css';

export default function VerificationRequiredModal({ open, onClose, latestVerification }) {
    const status = latestVerification?.status;
    const isPending = status === 'pending';

    const handleGetVerified = () => {
        router.visit('/verify-id');
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="verification-modal-title"
            aria-describedby="verification-modal-description"
            classes={{ paper: 'verification-modal-paper' }} 
        >
            <DialogContent 
                sx={{ 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    textAlign: 'center' 
                }}
            >
                {isPending ? (
                    <HourglassTopIcon className="verification-modal-icon" />
                ) : (
                    <VerifiedUserIcon className="verification-modal-icon" />
                )}

                <Typography id="verification-modal-title" className="verification-modal-title">
                    {isPending ? 'Verification In Progress' : 'Identity Verification Required'}
                </Typography>

                <Typography id="verification-modal-description" className="verification-modal-subtitle">
                    {isPending 
                        ? "We are currently reviewing your verification request."
                        : "To access all features, we need to verify your identity first."
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
            </DialogContent>
        </Dialog>
    );
}