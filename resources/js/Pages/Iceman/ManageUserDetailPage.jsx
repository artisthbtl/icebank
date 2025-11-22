import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Container, Box, Typography, Button, Grid, Chip, Avatar, Pagination } from '@mui/material';
import IcemanNavbar from '@/Components/IcemanNavbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import IceCubeIcon from '@/Components/IceCubeIcon';
import '../../../css/IcemanUserDetailPage.css';

export default function ManageUserDetailPage({ user, latestVerification, activeSubscriptions, transactions }) {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString('id-ID');
    };

    const handlePageChange = (event, value) => {
        router.visit(transactions.links[value]?.url || window.location.href, {
            only: ['transactions'],
            preserveScroll: true,
        });
    };

    const getVerificationImageUrl = (type) => {
        if (!latestVerification) return null;
        return route('iceman.verification.file', { 
            verification: latestVerification.id, 
            type: type 
        });
    };

    return (
        <>
            <Head title={`Manage ${user.first_name}`} />
            
            <div className="iceman-user-detail-wrapper">
                <IcemanNavbar />

                <Container maxWidth="lg" className="iceman-user-detail-container">
                    
                    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Link href={route('iceman.users')} className="back-link">
                            <ArrowBackIcon sx={{ color: '#94A3B8' }} />
                        </Link>
                        <div>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#E2E8F0' }}>
                                {user.first_name} {user.last_name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                                User ID: #{user.id}
                            </Typography>
                        </div>
                    </Box>

                    {latestVerification && latestVerification.status === 'pending' && (
                        <Box className="detail-card verification-alert-card">
                            <div className="card-header-row">
                                <Typography variant="h6" sx={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    ⚠️ Verification Request Pending
                                </Typography>
                                <div className="verification-actions">
                                    <Button 
                                        className="btn-reject" 
                                        size="large" 
                                        sx={{ mr: 1 }}
                                    >
                                        Reject
                                    </Button>
                                    <Button 
                                        className="btn-approve" 
                                        size="large" 
                                    >
                                        Approve
                                    </Button>
                                </div>
                            </div>
                            
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                <Grid size={6} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#94A3B8', mb: 1 }}>KTP / ID Card</Typography>
                                    <div className="verification-image-container">
                                        <img 
                                            src={latestVerification.ktp_path ? getVerificationImageUrl('ktp') : '/images/placeholder-id.png'} 
                                            alt="KTP" 
                                            className="verification-img"
                                        />
                                    </div>
                                </Grid>
                                <Grid size={6} md={6}>
                                    <Typography variant="subtitle2" sx={{ color: '#94A3B8', mb: 1 }}>Selfie</Typography>
                                    <div className="verification-image-container">
                                        <img 
                                            src={latestVerification.selfie_path ? getVerificationImageUrl('selfie') : '/images/placeholder-selfie.png'} 
                                            alt="Selfie" 
                                            className="verification-img"
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid size={6} md={6}>
                            <Box className="detail-card h-full">
                                <Typography variant="h6" className="card-title">User Information</Typography>
                                <div className="info-table">
                                    <div className="info-row">
                                        <span className="label">Full Name</span>
                                        <span className="value">{user.first_name} {user.last_name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Email</span>
                                        <span className="value">{user.email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Date of Birth</span>
                                        <span className="value">{user.date_of_birth ? formatDate(user.date_of_birth) : '-'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">City</span>
                                        <span className="value">{user.city || '-'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Member Since</span>
                                        <span className="value">{formatDate(user.created_at)}</span>
                                    </div>
                                </div>
                            </Box>
                        </Grid>

                        <Grid size={6} md={6}>
                            <Box className="detail-card h-full">
                                <Typography variant="h6" className="card-title">Account Details</Typography>
                                <div className="info-table">
                                    <div className="info-row">
                                        <span className="label">Account Number</span>
                                        <span className="value mono">{user.account?.account_number || 'N/A'}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Current Balance</span>
                                        <span className="value highlight">
                                            <IceCubeIcon width={16} height={16} color="#38BDF8" />
                                            {formatCurrency(user.account?.balance || 0)}
                                        </span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">ID Verification</span>
                                        <span className="value">
                                            {latestVerification?.status === 'approved' ? (
                                                <Chip icon={<VerifiedIcon />} label="Verified" color="success" size="small" variant="outlined" />
                                            ) : latestVerification?.status === 'rejected' ? (
                                                <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" variant="outlined" />
                                            ) : (
                                                <Chip label="Unverified" color="default" size="small" variant="outlined" sx={{ color: '#94A3B8', borderColor: '#475569' }} />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box className="detail-card" sx={{ mb: 3 }}>
                        <Typography variant="h6" className="card-title">Active Subscriptions</Typography>
                        {activeSubscriptions.length > 0 ? (
                            <div className="simple-list">
                                {activeSubscriptions.map(sub => (
                                    <div key={sub.id} className="simple-list-item">
                                        <div className="sub-info">
                                            <Avatar 
                                                src={sub.plan?.service?.company?.logo_path ? `/storage/${sub.plan.service.company.logo_path}` : undefined}
                                                sx={{ width: 32, height: 32, bgcolor: '#334155' }}
                                            >
                                                {sub.plan?.service?.name?.charAt(0)}
                                            </Avatar>
                                            <div>
                                                <div className="sub-name">{sub.plan?.service?.name} - {sub.plan?.name}</div>
                                                <div className="sub-meta">Renews on {formatDate(sub.ends_at)}</div>
                                            </div>
                                        </div>
                                        <div className="sub-price">
                                            <IceCubeIcon width={14} height={14} color="#38BDF8" />
                                            {formatCurrency(sub.plan?.price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Typography className="empty-text">No active subscriptions.</Typography>
                        )}
                    </Box>

                    <Box className="detail-card">
                        <Typography variant="h6" className="card-title">Transaction History</Typography>
                        {transactions.data.length > 0 ? (
                            <>
                                <div className="simple-table-container">
                                    <table className="simple-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Description</th>
                                                <th>Type</th>
                                                <th style={{ textAlign: 'right' }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.data.map(txn => {
                                                const isExpense = txn.amount < 0;
                                                return (
                                                    <tr key={txn.id}>
                                                        <td className="text-muted">{formatDate(txn.created_at)}</td>
                                                        <td>{txn.description}</td>
                                                        <td>
                                                            <span className="type-badge">{txn.type}</span>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }} className={isExpense ? 'text-expense' : 'text-income'}>
                                                            {isExpense ? '-' : '+'} {formatCurrency(Math.abs(txn.amount))}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Pagination 
                                        count={transactions.last_page} 
                                        page={transactions.current_page} 
                                        onChange={handlePageChange}
                                        color="primary"
                                        shape="rounded"
                                        sx={{ 
                                            '& .MuiPaginationItem-root': { color: '#94A3B8', borderColor: '#334155' },
                                            '& .Mui-selected': { backgroundColor: '#38BDF8 !important', color: '#0F172A' }
                                        }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <Typography className="empty-text">No transactions found.</Typography>
                        )}
                    </Box>

                </Container>
            </div>
        </>
    );
}