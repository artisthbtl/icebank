import React, { useState } from 'react';
import { usePage, Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import AccountInfoCard from "@/Components/AccountInfoCard";
import FeatureButtons from "@/Components/FeatureButtons";
import RecentTransactionCard from '@/Components/RecentTransactionCard';
import AddBalanceModal from '@/Components/AddBalanceModal';
import EnterPinModal from '@/Components/EnterPinModal'; // Import the new modal
import { Alert, Box, Container } from '@mui/material';
import '../../css/DashboardPage.css'; 

export default function DashboardPage() {
    const { user, account, recentTransactions } = usePage().props;
    
    const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
    const [isEnterPinOpen, setIsEnterPinOpen] = useState(false);
    const [pendingAmount, setPendingAmount] = useState(null);

    const isVerified = account?.isVerified === 'yes';

    // Called when user clicks "Continue" on AddBalanceModal
    const handleAddBalanceSuccess = (amount) => {
        setPendingAmount(amount);
        setIsAddBalanceOpen(false); // Close first modal
        setTimeout(() => setIsEnterPinOpen(true), 150); // Open second modal smoothly
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="dashboard-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="dashboard-content-container">
                    
                    {!isVerified && (
                        <Alert severity="warning" className="dashboard-alert">
                            Verify your ID at Profile Settings to unlock all features.
                        </Alert>
                    )}

                    <Box sx={{ my: 4 }}>
                        <AccountInfoCard user={user} account={account} />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <FeatureButtons onAddBalance={() => setIsAddBalanceOpen(true)} />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <RecentTransactionCard transactions={recentTransactions} />
                    </Box>

                </Container>

                {/* Step 1: Add Amount */}
                <AddBalanceModal 
                    open={isAddBalanceOpen} 
                    onClose={() => setIsAddBalanceOpen(false)}
                    onSuccess={handleAddBalanceSuccess}
                />

                {/* Step 2: Enter PIN */}
                <EnterPinModal 
                    open={isEnterPinOpen}
                    onClose={() => setIsEnterPinOpen(false)}
                    amount={pendingAmount}
                />
            </div>
        </>
    );
}