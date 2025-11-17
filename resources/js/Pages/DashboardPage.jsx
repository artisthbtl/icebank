import { usePage, Head } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import AccountInfoCard from "@/Components/AccountInfoCard";
import FeatureButtons from "@/Components/FeatureButtons";
import RecentTransactionCard from '@/Components/RecentTransactionCard';
import { Alert, Box, Container } from '@mui/material';
import '../../css/DashboardPage.css'; 

export default function DashboardPage() {
    const { auth, account, recentTransactions } = usePage().props;
    const user = auth.user;

    const isVerified = account?.is_verified === 'yes';

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