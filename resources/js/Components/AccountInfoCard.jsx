import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy } from '@mui/icons-material';
import '../../css/DashboardPage.css';
import IceCubeIcon from './IceCubeIcon';

export default function AccountInfoCard({ user, account }) {
    const [showBalance, setShowBalance] = useState(true);
    const [copyFeedback, setCopyFeedback] = useState(false);
    
    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    const handleCopyAccountNumber = () => {
        if (account?.accountNumber) {
            navigator.clipboard.writeText(account.accountNumber);
            setCopyFeedback(true);
        }
    };

    const handleCloseFeedback = () => {
        setCopyFeedback(false);
    };

    return (
        <Box className="dashboard-account-card">
            <Box className="dashboard-account-avatar-section">
                <Avatar 
                    className="dashboard-account-avatar"
                    sx={{ width: 64, height: 64, bgcolor: '#38BDF8' }}
                    src={user?.profilePhotoPath}
                    alt={user?.firstName}
                />
            </Box>

            <Box className="dashboard-account-details">
                <Typography
                    className="dashboard-account-name"
                >
                    {user?.firstName} {user?.lastName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography className="dashboard-account-number" sx={{ mb: 0 }}>
                        Account: {account?.accountNumber}
                    </Typography>
                    
                    <IconButton 
                        onClick={handleCopyAccountNumber} 
                        size="small"
                        className="dashboard-balance-toggle"
                        sx={{ padding: '4px' }}
                    >
                        <ContentCopy className="dashboard-balance-icon" sx={{ fontSize: '1.2rem' }} />
                    </IconButton>
                </Box>

                <Box className="dashboard-balance-wrapper">
                    <Typography
                        className="dashboard-balance-amount"
                    >
                        Balance:
                    </Typography>
                    
                    <Typography
                        className="dashboard-balance-value" 
                    >
                        <IceCubeIcon /> 
                        {showBalance ? (
                            <>
                                {`${Number(account?.balance || 0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </>
                        ) : '•••••'}
                    </Typography>

                    <IconButton 
                        onClick={toggleBalance} 
                        className="dashboard-balance-toggle"
                    >
                        {showBalance ? 
                            <Visibility className="dashboard-balance-icon" /> : 
                            <VisibilityOff className="dashboard-balance-icon" />
                        }
                    </IconButton>
                </Box>
            </Box>

            <Snackbar
                open={copyFeedback}
                autoHideDuration={2000}
                onClose={handleCloseFeedback}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseFeedback} 
                    severity="success" 
                    className="dashboard-snackbar-alert"
                    sx={{ width: '100%' }}
                >
                    Account number copied!
                </Alert>
            </Snackbar>
        </Box>
    );
}