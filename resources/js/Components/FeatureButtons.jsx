import React from 'react';
import { Box, Button } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import '../../css/DashboardPage.css';

export default function FeatureButtons({ onAddBalance, onRestrictedFeature }) {
    return (
        <Box className="dashboard-features-container">
            <Button
                onClick={onAddBalance} 
                variant="contained"
                className="dashboard-feature-btn feature-btn-add"
                startIcon={<AddCardIcon />}
            >
                Add Balance
            </Button>

            <Button
                onClick={() => onRestrictedFeature('/transfer')}
                variant="contained"
                className="dashboard-feature-btn feature-btn-transfer"
                startIcon={<SwapHorizIcon />}
            >
                Transfer
            </Button>

            <Button
                onClick={() => onRestrictedFeature('/subscriptions')}
                variant="contained"
                className="dashboard-feature-btn feature-btn-subscribe"
                startIcon={<SubscriptionsIcon />}
            >
                Subscribe
            </Button>
        </Box>
    );
}