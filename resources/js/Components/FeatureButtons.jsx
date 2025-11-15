import React from 'react';
import { Box, Button } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import { Link } from '@inertiajs/react';
import '../../css/DashboardPage.css';

export default function FeatureButtons() {
    return (
        <Box className="dashboard-features-container">
            {/* Add Balance Button (Green in design) */}
            <Button
                component={Link}
                href="/topup" // Placeholder route
                variant="contained"
                className="dashboard-feature-btn feature-btn-add"
                startIcon={<AddCardIcon />}
            >
                Add Balance
            </Button>

            {/* Transfer Button (Blue in design) */}
            <Button
                component={Link}
                href="/transfer" // Placeholder route
                variant="contained"
                className="dashboard-feature-btn feature-btn-transfer"
                startIcon={<SwapHorizIcon />}
            >
                Transfer
            </Button>

            {/* Subscribe Button (Light Blue in design) */}
            <Button
                component={Link}
                href="/subscriptions" // Placeholder route
                variant="contained"
                className="dashboard-feature-btn feature-btn-subscribe"
                startIcon={<SubscriptionsIcon />}
            >
                Subscribe
            </Button>
        </Box>
    );
}