import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Button, 
    Box, 
    IconButton,
    CircularProgress,
    TextField,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IceCubeIcon from '@/Components/IceCubeIcon';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useSnackbar } from '../Contexts/SnackbarContext';
import '../../css/SubscribeModal.css'; 

export default function SubscribeModal({ open, onClose, plan, onSuccess }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    if (!plan) return null;

    const handleClose = () => {
        setPin('');
        setError('');
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(route('subscribe.store', plan.id), { 
                pin: pin
            });
            
            showSnackbar(`Successfully subscribed to ${plan.name}!`);

            setPin('');
            
            if (onSuccess) {
                onSuccess(plan.name);
            }
            
            onClose(); 
            
            router.reload({ 
                only: ['user', 'account', 'recentTransactions', 'services'] 
            });

        } catch (err) {
             if (err.response) {
                const serverMessage = err.response.data.error || err.response.data.message;
                if (err.response.data.errors?.pin) {
                    setError(err.response.data.errors.pin[0]);
                } else {
                    setError(serverMessage || 'Subscription failed.');
                }
            } else {
                setError('A network error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            classes={{ paper: 'subscribe-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="subscribe-modal-header">
                    <Typography variant="h5" className="subscribe-modal-title">
                        Confirm Subscription
                    </Typography>
                    <IconButton onClick={handleClose} className="subscribe-modal-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Typography variant="body1" className="subscribe-modal-subtitle">
                    You are subscribing to <strong>{plan.service?.name} - {plan.name}</strong>.
                </Typography>

                <Box className="subscribe-details-box">
                    <div className="detail-row">
                        <Typography className="detail-label">Plan Duration</Typography>
                        <Typography className="detail-value highlight">{plan.duration} Days</Typography>
                    </div>
                    
                    <Divider sx={{ borderColor: '#334155', my: 2 }} />
                    
                    <div className="detail-row total-row">
                        <Typography className="detail-label total">Total Price</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IceCubeIcon width={20} height={20} color="#38BDF8" />
                            <Typography className="detail-value total">{plan.price}</Typography>
                        </Box>
                    </div>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Typography className="enter-pin-label">Enter your PIN to confirm</Typography>
                    <TextField
                        value={pin}
                        onChange={(e) => {
                            if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                                setPin(e.target.value);
                            }
                        }}
                        type="password"
                        placeholder="••••••"
                        fullWidth
                        autoFocus
                        className="conf-pin-field"
                        slotProps={{ 
                            inputMode: 'numeric', 
                            maxLength: 6, 
                            autoComplete: "off"
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={pin.length !== 6 || loading}
                        className="conf-submit-btn"
                        endIcon={!loading && <ArrowForwardIcon />}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
                    </Button>

                    {error && (
                        <Typography role="alert" 
                            sx={{ 
                                color: '#FBBF24',
                                fontSize: '0.9rem', 
                                textAlign: 'center',
                                marginTop: '12px',
                                fontWeight: 500
                            }}
                        >
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}