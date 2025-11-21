import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Button, 
    IconButton, 
    Box,
    TextField,
    CircularProgress,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import '../../css/DeleteUserModal.css';

export default function DeleteUserModal({ isOpen, onClose }) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        if (loading) return;
        setPassword('');
        setError('');
        setShowPassword(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!password) {
            setError('Please enter your password to confirm.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.delete(route('profile.destroy'), {
                data: { password: password }
            });

            window.location.href = '/login';

        } catch (err) {
            setLoading(false);
            if (err.response) {
                const serverMsg = err.response.data.message || err.response.data.error;
                
                if (err.response.data.errors?.password) {
                    setError(err.response.data.errors.password[0]);
                } else {
                    setError(serverMsg || 'Failed to delete account.');
                }
            } else {
                setError('A network error occurred. Please try again.');
            }
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={handleClose}
            classes={{ paper: 'delete-modal-paper' }}
        >
            <DialogContent sx={{ p: 4 }}>
                <div className="delete-modal-header">
                    <IconButton onClick={handleClose} className="delete-modal-close-btn" disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </div>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mt: -2 }}>
                    <WarningAmberIcon className="delete-modal-icon" />

                    <Typography className="delete-modal-title">
                        Delete Account?
                    </Typography>

                    <Typography component="div" className="delete-modal-message">
                        This action cannot be undone. All your data and transaction history will be permanently removed.
                    </Typography>

                    <Box className="delete-modal-input-section">
                        <Typography className="delete-modal-label">
                            Enter your password to confirm
                        </Typography>
                        <TextField
                            fullWidth
                            className="delete-password-field"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            error={!!error}
                            helperText={error}
                            placeholder="Current Password"
                            disabled={loading}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#94A3B8' }}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Box>

                    <div className="delete-modal-actions">
                        <Button 
                            className="delete-btn-cancel"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="delete-btn-confirm"
                            onClick={handleSubmit}
                            disabled={loading || !password}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Delete Account"}
                        </Button>
                    </div>
                </Box>
            </DialogContent>
        </Dialog>
    );
}