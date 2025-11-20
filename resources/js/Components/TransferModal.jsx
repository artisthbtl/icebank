import React, { useState, useEffect } from 'react';
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
import IceCubeIcon from '@/Components/IceCubeIcon';
import axios from 'axios';
import '../../css/TransferModal.css'; 

// Changed props: onSuccess is now onContinue
export default function TransferModal({ open, onClose, onContinue }) {
    const [amount, setAmount] = useState('');
    const [receiverAccount, setReceiverAccount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setAmount('');
            setReceiverAccount('');
            setError('');
            setLoading(false);
        }
    }, [open]);

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Hit the new validation endpoint
            const response = await axios.post(route('transfer.validate'), { 
                amount: parseFloat(amount),
                receiverAccountNumber: receiverAccount
            });
            
            // Pass the data (receiver info, fees) to the parent to open the next modal
            onContinue(response.data); 
            
        } catch (err) {
            if (err.response) {
                const serverMessage = err.response.data.error || err.response.data.message;
                if (err.response.data.errors) {
                    const firstError = Object.values(err.response.data.errors)[0][0];
                    setError(firstError);
                } else {
                    setError(serverMessage || 'An unexpected error occurred.');
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
            onClose={onClose} 
            classes={{ paper: 'transfer-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="transfer-header">
                    <Typography variant="h5" className="transfer-title">
                        Transfer Ices
                    </Typography>
                    <IconButton onClick={onClose} className="transfer-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Typography variant="body1" className="transfer-subtitle">
                    Enter the amount and receiver's account number.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    
                    <div className="transfer-input-container">
                        <div className="input-icon-wrapper">
                            <IceCubeIcon width={32} height={32} />
                        </div>
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            className="transfer-textfield"
                            required
                        />
                    </div>

                    <div className="transfer-input-container">
                        <TextField
                            label="Receiver Account Number"
                            value={receiverAccount}
                            onChange={(e) => setReceiverAccount(e.target.value)}
                            placeholder="e.g. 1234567890"
                            className="transfer-textfield"
                            fullWidth
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!amount || !receiverAccount || loading}
                        className="transfer-continue-btn"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
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