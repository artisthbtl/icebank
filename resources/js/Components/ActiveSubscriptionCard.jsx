import React, { useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import '../../css/DashboardPage.css';
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

    const currentSubs = subs.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    if (subs.length === 0) return null;

    return (
        <Box className="dashboard-recent-txn-container" sx={{ mb: 4 }}>
            <div className="dashboard-section-header">
                <Typography variant="h6" className="dashboard-section-title">
                    Active Subscriptions
                </Typography>
                
                <div style={{ display: 'flex', gap: '8px', userSelect: 'none' }}>
                    <span 
                        className="view-all-link" 
                        onClick={handlePrev}
                        style={{ 
                            cursor: page === 0 ? 'default' : 'pointer',
                            opacity: page === 0 ? 0.3 : 1,
                            fontSize: '1.2rem'
                        }}
                    >
                        &lt;
                    </span>
                    <span style={{ color: '#334155', fontSize: '1.2rem' }}>/</span>
                    <span 
                        className="view-all-link" 
                        onClick={handleNext}
                        style={{ 
                            cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                            opacity: page >= totalPages - 1 ? 0.3 : 1,
                            fontSize: '1.2rem'
                        }}
                    >
                        &gt;
                    </span>
                </div>
            </div>

            <div className="dashboard-txn-list">
                {currentSubs.map((sub) => (
                    <div key={sub.id} className="dashboard-txn-item">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Avatar 
                                src={sub.plan?.service?.company?.logo_path} 
                                alt={sub.plan?.service?.company?.name}
                                sx={{ width: 40, height: 40, bgcolor: '#334155', fontSize: '1rem' }}
                            >
                                {sub.plan?.service?.company?.name?.charAt(0)}
                            </Avatar>
                            
                            <div className="txn-details">
                                <Typography className="txn-title">
                                    {sub.plan?.service?.name}
                                </Typography>
                                <Typography className="txn-date">
                                    {sub.plan?.service?.company?.name} • {sub.plan?.name}
                                </Typography>
                            </div>
                        </div>

                        <div className="txn-amount-group">
                            <div className="txn-main-amount-row">
                                <IceCubeIcon width={16} height={16} color="#38BDF8" />
                                <Typography className="txn-value txn-income" sx={{ fontSize: '1rem !important' }}>
                                    {Number(sub.plan?.price).toLocaleString('id-ID')}
                                </Typography>
                            </div>
                            <Typography className="txn-fee-text">
                                Renew: {new Date(sub.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </Typography>
                        </div>
                    </div>
                ))}
            </div>
        </Box>
    );
}