import React, { useState } from 'react';
import { usePage, Head, router } from '@inertiajs/react'; 
import Navbar from "@/Components/Navbar";
import AccountInfoCard from "@/Components/AccountInfoCard";
import FeatureButtons from "@/Components/FeatureButtons";
import RecentTransactionCard from '@/Components/RecentTransactionCard';
import AddBalanceModal from '@/Components/AddBalanceModal';
import EnterPinModal from '@/Components/EnterPinModal';
import VerificationRequiredModal from '@/Components/VerificationRequiredModal';
import { Alert, Box, Container } from '@mui/material';
import '../../css/DashboardPage.css'; 

export default function DashboardPage() {
    const { user, account, recentTransactions, latestVerification } = usePage().props;
    
    const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
    const [isEnterPinOpen, setIsEnterPinOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [pendingAmount, setPendingAmount] = useState(null);
    const isVerified = latestVerification?.status === 'approved';

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

    return (
        <>
            <Head title="Dashboard" />
            <div className="dashboard-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="dashboard-content-container">
                    
                    {!isVerified && (
                        <Alert severity="warning" className="dashboard-alert">
                            {latestVerification?.status === 'pending' 
                                ? "Your identity verification is currently under review."
                                : "Verify your ID at the Profile Page to unlock all features."
                            }
                        </Alert>
                    )}

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