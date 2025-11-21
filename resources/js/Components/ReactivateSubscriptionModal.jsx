// resources/js/Components/ReactivateSubscriptionModal.jsx
import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Button, 
    IconButton, 
    Box,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import axios from 'axios';
import { router } from '@inertiajs/react';
import '../../css/ReactivateSubscriptionModal.css';

export default function ReactivateSubscriptionModal({ open, onClose, plan, onSuccess }) {
    const [loading, setLoading] = useState(false);

    if (!plan) return null;

    const handleReactivate = async () => {
        setLoading(true);
        try {
            await axios.post(route('subscribe.reactivate', plan.id));

            if (onSuccess) {
                onSuccess(plan.name);
            }

            onClose();
            
            router.reload({ only: ['user', 'account', 'recentTransactions', 'services'] });

        } catch (err) {
            console.error("Reactivation failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            classes={{ paper: 'reactivate-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="reactivate-modal-header">
                    <IconButton onClick={onClose} className="reactivate-modal-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: -2 }}>
                    <AutorenewIcon className="reactivate-modal-icon" />

                    <Typography className="reactivate-modal-title">
                        Reactivate Subscription?
                    </Typography>

                    <Typography component="div" className="reactivate-modal-message">
                        Are you sure you want to reactivate <strong>{plan.name}</strong>?<br/>
                        Your subscription will resume immediately.
                    </Typography>

                    <div className="reactivate-modal-actions">
                        <Button 
                            className="reactivate-btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            No, Cancel
                        </Button>
                        <Button 
                            className="reactivate-btn-confirm"
                            onClick={handleReactivate}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Yes, Reactivate"}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}