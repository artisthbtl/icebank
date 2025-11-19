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
import '../../css/AddBalance.css'; 

export default function AddBalanceModal({ open, onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fastTopUpOptions = [5, 10, 20, 50, 100, 200];

    useEffect(() => {
        if (open) {
            setAmount('');
            setError('');
            setLoading(false);
        }
    }, [open]);

    const handleClose = () => {
        onClose();
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError('');
        }
    };

    const handleFastTopUp = (value) => {
        setAmount(value.toString());
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(route('account.validate-amount'), { 
                amount: parseFloat(amount) 
            });
            
            onSuccess(amount);
            onClose(); 
        } catch (err) {
            if (err.response) {
                const serverMessage = err.response.data.error || err.response.data.message;
                
                if (err.response.data.errors?.amount) {
                    setError(err.response.data.errors.amount[0]);
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
            onClose={handleClose} 
            classes={{ paper: 'add-balance-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="add-balance-header">
                    <Typography variant="h5" className="add-balance-title">
                        Add Balance
                    </Typography>
                    <IconButton onClick={handleClose} className="add-balance-close-btn">
                        <CloseIcon />
                    </IconButton>
                </div>

                <Typography variant="body1" className="add-balance-subtitle">
                    Enter the amount of Ice you want to add.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    
                    <div className="amount-input-container">
                        <div className="input-icon-wrapper">
                            <IceCubeIcon width={32} height={32} />
                        </div>
                        <TextField
                            label="Amount"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0.00"
                            className="amount-textfield"
                        />
                    </div>

                    <Typography variant="subtitle2" className="fast-topup-label">
                        Fast Top Up
                    </Typography>

                    <div className="fast-topup-grid">
                        {fastTopUpOptions.map((option) => {
                            const isSelected = amount === option.toString();
                            return (
                                <Button
                                    key={option}
                                    variant={isSelected ? "contained" : "outlined"}
                                    onClick={() => handleFastTopUp(option)}
                                    className={`topup-btn ${isSelected ? 'selected' : 'unselected'}`}
                                >
                                    <IceCubeIcon width={20} height={20} />
                                    {option}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={!amount || parseFloat(amount) <= 0 || loading}
                        className="continue-btn"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
                    </Button>

                    {error && (
                        <Typography 
                            role="alert" 
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