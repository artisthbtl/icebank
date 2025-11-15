import React from 'react';
import { usePage, Head } from '@inertiajs/react';
import Navbar from '@/Components/Dashboard/Navbar';
import AccountInfoCard from '@/Components/Dashboard/AccountInfoCard';
import FeatureButtons from '@/Components/Dashboard/FeatureButtons';
import RecentTransactionCard from '@/Components/Dashboard/RecentTransactionCard';
import { Alert, Box, Container } from '@mui/material';
import '../../css/DashboardPage.css'; 

export default function DashboardPage() {
    const { auth, account, recentTransactions } = usePage().props;
    const user = auth.user;

    const isVerified = account?.is_verified === 'yes'; // Assuming 'yes'/'no' string from your DB

    return (
        <>
            <Head title="Dashboard" />
            <div className="dashboard-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="dashboard-content-container">
                    
                    {/* Verification Alert (from your design) */}
                    {!isVerified && (
                        <Alert severity="warning" className="dashboard-alert">
                            Verify your ID at Profile Settings to unlock all features.
                        </Alert>
                    )}

                    <Box sx={{ my: 4 }}>
                        <AccountInfoCard user={user} account={account} />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <FeatureButtons />
                    </Box>

                    <Box sx={{ my: 4 }}>
                        <RecentTransactionCard transactions={recentTransactions} />
                    </Box>

                </Container>
            </div>
        </>
    );
}