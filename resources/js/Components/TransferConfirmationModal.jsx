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
import { useSnackbar } from '@/Contexts/SnackbarContext';
import axios from 'axios';
import { router } from '@inertiajs/react';
import '../../css/TransferConfirmationModal.css'; 

export default function TransferConfirmationModal({ open, onClose, data, onSuccess }) {
    const { showSnackbar } = useSnackbar();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!data) return null;

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
            await axios.post(route('transfer'), { 
                amount: data.amount,
                receiverAccountNumber: data.account_number,
                pin: pin
            });
            
            setPin('');
            onSuccess();
            onClose(); 
            
            showSnackbar(`Successfully transferred ${data.amount} Ice to ${data.receiver_name}`);
            
            router.reload({ only: ['user', 'account', 'recentTransactions'] });

        } catch (err) {
             if (err.response) {
                const serverMessage = err.response.data.error || err.response.data.message;
                if (err.response.data.errors?.pin) {
                    setError(err.response.data.errors.pin[0]);
                } else {
                    setError(serverMessage || 'Transaction failed.');
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
            classes={{ paper: 'transfer-conf-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="transfer-conf-header">
                    <Typography variant="h5" className="transfer-conf-title">
                        Confirm Transfer
                    </Typography>
                    <IconButton onClick={handleClose} className="transfer-conf-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Typography variant="body1" className="transfer-conf-subtitle">
                    Please review the details below before confirming.
                </Typography>

                <Box className="transfer-details-box">
                    <div className="detail-row">
                        <Typography className="detail-label">Receiver</Typography>
                        <Typography className="detail-value highlight">{data.receiver_name}</Typography>
                    </div>
                    <div className="detail-row">
                        <Typography className="detail-label">Account</Typography>
                        <Typography className="detail-value">{data.account_number}</Typography>
                    </div>
                    
                    <Divider sx={{ borderColor: '#334155', my: 2 }} />
                    
                    <div className="detail-row">
                        <Typography className="detail-label">Amount</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IceCubeIcon width={20} height={20} color="#E2E8F0" />
                            <Typography className="detail-value">{data.amount}</Typography>
                        </Box>
                    </div>

                    <div className="detail-row">
                        <Typography className="detail-label">Transaction Fee</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IceCubeIcon width={20} height={20} color="#FBBF24" />
                            <Typography className="detail-value text-yellow">{data.fee}</Typography>
                        </Box>
                    </div>

                    <Divider sx={{ borderColor: '#334155', my: 2 }} />
                    
                    <div className="detail-row total-row">
                        <Typography className="detail-label total">Total Deduction</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IceCubeIcon width={20} height={20} color="#38BDF8" />
                            <Typography className="detail-value total">{data.total}</Typography>
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Transfer'}
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