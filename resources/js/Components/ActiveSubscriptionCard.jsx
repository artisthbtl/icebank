import React, { useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import '../../css/ActiveSubscriptionCard.css';
import IceCubeIcon from './IceCubeIcon';

export default function ActiveSubscriptionCard({ subscriptions }) {
    const subs = subscriptions?.data || [];
    const [page, setPage] = useState(0);
    const itemsPerPage = 2;
    const totalPages = Math.ceil(subs.length / itemsPerPage);

    const handlePrev = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages - 1) setPage(page + 1);
    };

    const handleCancelClick = (subId, planName) => {
        alert(`Open ConfirmCancellationModal for: ${planName} (ID: ${subId})`);
    };

    if (subs.length === 0) return null;

    const currentSubs = subs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    return (
        <Box className="active-sub-card-container">
            <div className="active-sub-header">
                <Typography variant="h6" className="active-sub-title">
                    Active Subscriptions
                </Typography>
                
                <div className="active-sub-nav">
                    <span 
                        className="active-sub-nav-btn" 
                        onClick={handlePrev}
                        style={{ opacity: page === 0 ? 0.3 : 1, cursor: page === 0 ? 'default' : 'pointer' }}
                    >
                        &lt;
                    </span>
                    <span className="active-sub-nav-separator">/</span>
                    <span 
                        className="active-sub-nav-btn" 
                        onClick={handleNext}
                        style={{ opacity: page >= totalPages - 1 ? 0.3 : 1, cursor: page >= totalPages - 1 ? 'default' : 'pointer' }}
                    >
                        &gt;
                    </span>
                </div>
            </div>

            <div className="active-sub-list">
                {currentSubs.map((sub) => (
                    <div key={sub.id} className="active-sub-item">
                        <div className="active-sub-left-group">
                            <Avatar 
                                variant="rounded"
                                src={sub.plan?.service?.company?.logo_path} 
                                alt={sub.plan?.service?.company?.name}
                                sx={{ 
                                    width: 40, 
                                    height: 40, 
                                    bgcolor: '#334155',
                                    borderRadius: '8px'
                                }}
                            >
                                {sub.plan?.service?.company?.name?.charAt(0)}
                            </Avatar>
                            
                            <div className="active-sub-details">
                                <Typography className="active-sub-service-name">
                                    {sub.plan?.service?.name}
                                </Typography>
                                <Typography className="active-sub-plan-name">
                                    {sub.plan?.service?.company?.name} • {sub.plan?.name}
                                </Typography>
                            </div>
                        </div>

                        <div className="active-sub-right-group">
                            <div className="active-sub-price-row">
                                <IceCubeIcon width={16} height={16} color="#38BDF8" />
                                <Typography className="active-sub-price">
                                    {Number(sub.plan?.price).toLocaleString('id-ID')}
                                </Typography>
                            </div>
                            
                            <Typography className="active-sub-renew-date">
                                Renew: {sub.endDate ? new Date(sub.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'N/A'}
                            </Typography>

                            <button 
                                className="active-sub-cancel-btn"
                                onClick={() => handleCancelClick(sub.id, sub.plan?.service?.name)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
}