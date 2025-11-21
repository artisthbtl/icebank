import React from 'react';
import { Box, Button } from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import '../../css/FeatureButtons.css'; // Importing the new dedicated CSS

export default function FeatureButtons({ onAddBalance, onRestrictedFeature }) {
    return (
        <Box className="feature-btns-container">
            <Button
                onClick={onAddBalance} 
                variant="contained"
                className="feature-btn feature-btn-add"
                startIcon={<AddCardIcon />}
            >
                <span className="feature-btn-text">
                    Add Balance
                </span>
            </Button>

            <Button
                onClick={() => onRestrictedFeature('/transfer')}
                variant="contained"
                className="feature-btn feature-btn-transfer"
                startIcon={<SwapHorizIcon />}
            >
                <span className="feature-btn-text">
                    Transfer
                </span>
            </Button>

            <Button
                onClick={() => onRestrictedFeature('/subscriptions')}
                variant="contained"
                className="feature-btn feature-btn-subscribe"
                startIcon={<SubscriptionsIcon />}
            >
                <span className="feature-btn-text">
                    Subscribe
                </span>
            </Button>
        </Box>
    );
}