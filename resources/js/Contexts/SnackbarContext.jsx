import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showSnackbar = (msg) => {
        setMessage(msg);
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Slide}
            >
                <Alert
                    onClose={handleClose}
                    icon={<CheckCircleOutlineIcon sx={{ color: '#38BDF8' }} />}
                    sx={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        color: '#38BDF8',
                        border: '1px solid #38BDF8',
                        '& .MuiAlert-icon': {
                            color: '#38BDF8',
                        },
                        '& .MuiIconButton-root': {
                            color: '#38BDF8',
                        }
                    }}
                >
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};