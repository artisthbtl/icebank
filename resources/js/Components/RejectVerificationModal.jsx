import React, { useState } from 'react';
import { Dialog, DialogContent, Typography, Button, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../css/VerificationModals.css';

export default function RejectVerificationModal({ isOpen, onClose, onConfirm, isLoading }) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Please provide a reason for rejection.');
            return;
        }
        onConfirm(reason);
    };

    const handleClose = () => {
        setReason('');
        setError('');
        onClose();
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={handleClose}
            classes={{ paper: 'verification-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="verification-modal-header">
                    <IconButton onClick={handleClose} className="verification-modal-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: -2 }}>
                    <ErrorOutlineIcon className="verification-modal-icon icon-reject" />

                    <Typography className="verification-modal-title">
                        Reject Verification
                    </Typography>

                    <Typography className="verification-modal-message">
                        Please specify why this verification is being rejected.
                        This message will be visible to the user.
                    </Typography>

                    <textarea
                        className="rejection-textarea"
                        rows="4"
                        placeholder="e.g., Image is blurry, ID expired..."
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            if(e.target.value) setError('');
                        }}
                        disabled={isLoading}
                    />
                    
                    {error && <Typography className="error-text">{error}</Typography>}

                    <div className="verification-modal-actions">
                        <Button 
                            className="modal-btn btn-cancel"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="modal-btn btn-confirm-reject"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Rejecting..." : "Confirm Reject"}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}