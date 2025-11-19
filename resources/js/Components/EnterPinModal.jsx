import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    IconButton,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { router } from '@inertiajs/react';
import '../../css/EnterPin.css'; 

export default function EnterPinModal({ open, onClose, amount }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setPin('');
        setError('');
        onClose();
    };

    const handlePinChange = (e) => {
        const value = e.target.value;
        if (value === '' || (/^\d+$/.test(value) && value.length <= 6)) {
            setPin(value);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(route('account.add-balance'), { 
                amount: parseFloat(amount),
                pin: pin
            });
            
            setPin('');
            onClose(); 
            
            router.reload({ only: ['user', 'account', 'recentTransactions'] });
            
        } catch (err) {
            if (err.response) {
                const serverMessage = err.response.data.error || err.response.data.message;
                
                if (err.response.data.errors?.pin) {
                    setError(err.response.data.errors.pin[0]);
                } else {
                    setError(serverMessage || 'Invalid PIN or transaction failed.');
                }
            } else {
                setError('A network error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
            classes={{ paper: 'enter-pin-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="enter-pin-header">
                    <Typography variant="h5" className="enter-pin-title">
                        Enter PIN
                    </Typography>
                    <IconButton onClick={handleClose} className="enter-pin-close-btn"> {/* Use handleClose here */}
                        <CloseIcon />
                    </IconButton>
                </div>

                <Typography variant="body1" className="enter-pin-subtitle">
                    Please enter your 6-digit PIN to confirm adding <span className="confirm-amount-text">{amount} Ices</span> to your account.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    
                    <div className="pin-input-container">
                        <TextField
                            value={pin}
                            onChange={handlePinChange}
                            type="password"
                            placeholder="••••••"
                            fullWidth
                            autoFocus
                            slotProps={{ 
                                inputMode: 'numeric', 
                                maxLength: 6,
                                autoComplete: "off"
                            }}
                            className="pin-textfield"
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={pin.length !== 6 || loading}
                        className="pin-submit-btn"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Transaction'}
                    </Button>

                    {error && (
                        <Typography 
                            role="alert" 
                            sx={{ 
                                color: '#FBBF24',
                                fontSize: '0.9rem', 
                                textAlign: 'center',
                                marginTop: '16px',
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