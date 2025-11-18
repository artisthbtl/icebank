import { Box, Typography } from '@mui/material';
import '../../css/DashboardPage.css';
import IceCubeIcon from './IceCubeIcon';

export default function RecentTransactionCard({ transactions }) {
    const recentTxns = transactions?.data || []; 

    return (
        <Box className="dashboard-recent-txn-container">
            <Typography variant="h6" className="dashboard-section-title">
                Recent Transaction
            </Typography>

            <div className="dashboard-txn-list">
                {recentTxns.length > 0 ? (
                    recentTxns.slice(0, 3).map((txn) => (
                        <div key={txn.id} className="dashboard-txn-item">
                            <div className="txn-details">
                                <Typography className="txn-title">
                                    {txn.description} 
                                </Typography>
                                <Typography className="txn-date">
                                    {new Date(txn.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </Typography>
                            </div>

                            <div className="txn-amount">
                                <IceCubeIcon />
                                <Typography 
                                    className={`txn-value ${txn.amount < 0 ? 'txn-expense' : 'txn-income'}`}
                                >
                                    {Number(txn.amount).toLocaleString('id-ID')}
                                </Typography>
                            </div>
                        </div>
                    ))
                ) : (
                    <Typography className="no-txn-message">
                        No recent transactions.
                    </Typography>
                )}
            </div>
        </Box>
    );
}