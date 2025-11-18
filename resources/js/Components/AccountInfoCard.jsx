import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../../css/DashboardPage.css';
import IceCubeIcon from './IceCubeIcon';

export default function AccountInfoCard({ user, account }) {
    const [showBalance, setShowBalance] = React.useState(true);
    
    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    const getInitials = (user) => {
        if (user?.first_name) {
            return user.first_name.substring(0, 1).toUpperCase();
        }
        return user?.email ? user.email.substring(0, 2).toUpperCase() : '...';
    };

    return (
        <Box className="dashboard-account-card">
            <Box className="dashboard-account-avatar-section">
                <Avatar 
                    className="dashboard-account-avatar"
                    sx={{ width: 64, height: 64, bgcolor: '#38BDF8' }}
                >
                    {getInitials(user)}
                </Avatar>
            </Box>

            <Box className="dashboard-account-details">
                <Typography
                    className="dashboard-account-name"
                >
                    {user?.first_name} {user?.last_name}
                </Typography>
                
                <Typography className="dashboard-account-number">
                    Account: {account?.account_number}
                </Typography>

                <Box className="dashboard-balance-wrapper">
                    <Typography
                        className="dashboard-balance-amount"
                    >
                        Balance:
                    </Typography>
                    
                    <Typography
                        className="dashboard-balance-amount dashboard-balance-value" 
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
        </Box>
    );
}