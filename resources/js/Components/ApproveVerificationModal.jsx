import React from 'react';
import { Dialog, DialogContent, Typography, Button, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import '../../css/VerificationModals.css';

export default function ApproveVerificationModal({ isOpen, onClose, onConfirm, isLoading }) {
    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            classes={{ paper: 'verification-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="verification-modal-header">
                    <IconButton onClick={onClose} className="verification-modal-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: -2 }}>
                    <CheckCircleOutlineIcon className="verification-modal-icon icon-approve" />

                    <Typography className="verification-modal-title">
                        Approve Verification?
                    </Typography>

                    <Typography className="verification-modal-message">
                        This will mark the user's account as <strong>Verified</strong>.
                        <br />Are you sure the documents are valid?
                    </Typography>

                    <div className="verification-modal-actions">
                        <Button 
                            className="modal-btn btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="modal-btn btn-confirm-approve"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Approving..." : "Yes, Approve"}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}