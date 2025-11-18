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
            <Button
                component={Link}
                href="/topup"
                variant="contained"
                className="dashboard-feature-btn feature-btn-add"
                startIcon={<AddCardIcon />}
            >
                Add Balance
            </Button>

            <Button
                component={Link}
                href="/transfer"
                variant="contained"
                className="dashboard-feature-btn feature-btn-transfer"
                startIcon={<SwapHorizIcon />}
            >
                Transfer
            </Button>

            <Button
                component={Link}
                href="/subscriptions"
                variant="contained"
                className="dashboard-feature-btn feature-btn-subscribe"
                startIcon={<SubscriptionsIcon />}
            >
                Subscribe
            </Button>
        </Box>
    );
}