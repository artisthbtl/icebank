import React from 'react';
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Button, 
    IconButton, 
    Box 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import '../../css/ConfirmCancellationModal.css';

export default function ConfirmCancellationModal({ isOpen, onClose, onConfirm, planName, isLoading }) {
    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose}
            classes={{ paper: 'cancel-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="cancel-modal-header">
                    <IconButton onClick={onClose} className="cancel-modal-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: -2 }}>
                    <WarningAmberIcon className="cancel-modal-icon" />

                    <Typography className="cancel-modal-title">
                        Cancel Subscription?
                    </Typography>

                    <Typography component="div" className="cancel-modal-message">
                        Are you sure you want to cancel <strong>{planName}</strong>?<br/>
                        You will retain access until the billing period ends.
                    </Typography>

                    <div className="cancel-modal-actions">
                        <Button 
                            className="cancel-btn-keep"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            No, Keep It
                        </Button>
                        <Button 
                            className="cancel-btn-destructive"
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? "Cancelling..." : "Yes, Cancel"}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}