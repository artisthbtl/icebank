import React, { useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import '../../css/DashboardPage.css'; 

export default function AccountInfoCard({ user, account }) {
    const [showBalance, setShowBalance] = useState(false);

    // Fallback data in case props aren't fully loaded yet
    const firstName = user?.first_name || 'User';
    const lastName = user?.last_name || '';
    // Ensure balance is a number before calling toLocaleString
    const balance = Number(account?.balance || 0);
    const formattedBalance = balance.toLocaleString('id-ID', { minimumFractionDigits: 0 });

    return (
        <Box className="dashboard-account-card">
            <div className="dashboard-account-avatar-section">
                 {/* Use user's initials if no photo is available */}
                <Avatar 
                    className="dashboard-account-avatar"
                    src={user?.profile_photo_path ? `/storage/${user.profile_photo_path}` : null}
                    alt={`${firstName} ${lastName}`}
                    sx={{ width: 100, height: 100, bgcolor: 'var(--base-200)' }} // Temporary inline style for size
                >
                    {firstName[0]}{lastName[0]}
                </Avatar>
            </div>

            <div className="dashboard-account-details">
                <Typography variant="h5" className="dashboard-account-name">
                    {firstName} {lastName}
                </Typography>
                
                <div className="dashboard-balance-wrapper">
                    <Typography variant="body1" className="dashboard-balance-label">
                        Balance:
                    </Typography>
                    
                    <Typography variant="h4" className="dashboard-balance-amount">
                        Rp. {showBalance ? formattedBalance : '*****'}
                    </Typography>

                    <IconButton 
                        onClick={() => setShowBalance(!showBalance)} 
                        className="dashboard-balance-toggle"
                        aria-label="toggle balance visibility"
                    >
                        {showBalance ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                </div>
            </div>
        </Box>
    );
}