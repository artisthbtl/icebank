import React, { useState } from 'react';
import { usePage, Head, router } from '@inertiajs/react'; 
import Navbar from "@/Components/Navbar";
import AccountInfoCard from "@/Components/AccountInfoCard";
import FeatureButtons from "@/Components/FeatureButtons";
import RecentTransactionCard from '@/Components/RecentTransactionCard';
import LatestVerificationCard from '@/Components/LatestVerificationCard';
import AddBalanceModal from '@/Components/AddBalanceModal';
import EnterPinModal from '@/Components/EnterPinModal';
import VerificationRequiredModal from '@/Components/VerificationRequiredModal';
import { Alert, Box, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import InfoIcon from '@mui/icons-material/Info';
import '../../css/DashboardPage.css'; 

export default function DashboardPage() {
    const { user, account, recentTransactions, latestVerification } = usePage().props;
    
    const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
    const [isEnterPinOpen, setIsEnterPinOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [pendingAmount, setPendingAmount] = useState(null);
    
    const isVerified = latestVerification?.status === 'approved';
    const status = latestVerification?.status;

    const showApprovedAlert = () => {
        if (status !== 'approved') return false;
        if (!latestVerification.updatedAt) return false;

        const approvedDate = new Date(latestVerification.updatedAt);
        const now = new Date();
        const diffTime = Math.abs(now - approvedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        return diffDays <= 3;
    };

    const handleAddBalanceSuccess = (amount) => {
        setPendingAmount(amount);
        setIsAddBalanceOpen(false);
        setTimeout(() => setIsEnterPinOpen(true), 150);
    };

    const handleRestrictedFeature = (url) => {
        if (isVerified) {
            router.visit(url);
        } else {
            setIsVerificationModalOpen(true);
        }
    };

    const renderVerificationAlert = () => {
        if (status === 'approved' && showApprovedAlert()) {
            return (
                <Alert 
                    icon={<CheckCircleIcon fontSize="inherit" />} 
                    severity="info"
                    sx={{ 
                        backgroundColor: 'rgba(56, 189, 248, 0.15) !important',
                        color: '#38BDF8 !important', // Icebank Blue
                        border: '1px solid rgba(56, 189, 248, 0.3) !important',
                        borderRadius: '8px !important',
                        mb: 2
                    }}
                >
                    Identity verification approved! You now have full access to all features.
                </Alert>
            );
        }

        if (status === 'rejected') {
            return (
                <Alert 
                    icon={<ErrorIcon fontSize="inherit" />} 
                    severity="error"
                    sx={{ 
                        backgroundColor: 'rgba(239, 68, 68, 0.15) !important',
                        color: '#F87171 !important',
                        border: '1px solid rgba(239, 68, 68, 0.3) !important',
                        borderRadius: '8px !important',
                        mb: 2
                    }}
                >
                    Your identity verification was rejected. Please check the reason below.
                </Alert>
            );
        }

        if (status === 'pending') {
            return (
                <Alert 
                    icon={<HourglassEmptyIcon fontSize="inherit" />} 
                    severity="warning" 
                    className="dashboard-alert"
                    sx={{ mb: 2 }}
                >
                    Your identity verification is currently under review.
                </Alert>
            );
        }

        if (!status) {
            return (
                <Alert 
                    icon={<InfoIcon fontSize="inherit" />} 
                    severity="warning" 
                    className="dashboard-alert"
                    sx={{ mb: 2 }}
                >
                    Verify your identity at the Profile Page to unlock all features.
                </Alert>
            );
        }

        return null;
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="dashboard-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="dashboard-content-container">
                    
                    {/* Alerts Section */}
                    {renderVerificationAlert()}

                    <Box sx={{ my: 4 }}>
                        <AccountInfoCard user={user} account={account} />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <FeatureButtons 
                            onAddBalance={() => setIsAddBalanceOpen(true)} 
                            onRestrictedFeature={handleRestrictedFeature}
                        />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <RecentTransactionCard transactions={recentTransactions} />
                    </Box>

                    {latestVerification && status !== 'approved' && (
                        <Box sx={{ my: 4 }}>
                            <LatestVerificationCard verification={latestVerification} />
                        </Box>
                    )}

                </Container>

                <AddBalanceModal 
                    open={isAddBalanceOpen} 
                    onClose={() => setIsAddBalanceOpen(false)}
                    onSuccess={handleAddBalanceSuccess}
                />

                <EnterPinModal 
                    open={isEnterPinOpen}
                    onClose={() => setIsEnterPinOpen(false)}
                    amount={pendingAmount}
                />

                <VerificationRequiredModal 
                    open={isVerificationModalOpen}
                    onClose={() => setIsVerificationModalOpen(false)}
                    latestVerification={latestVerification}
                />
            </div>
        </>
    );
}