import { Box, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
import '../../css/DashboardPage.css';
import IceCubeIcon from './IceCubeIcon';

export default function RecentTransactionCard({ transactions }) {
    const recentTxns = transactions?.data || []; 

    return (
        <Box className="dashboard-recent-txn-container">
            <div className="dashboard-section-header">
                <Typography variant="h6" className="dashboard-section-title">
                    Recent Transaction
                </Typography>
                <Link href="/transactions" className="view-all-link">
                    View All
                </Link>
            </div>

            <div className="dashboard-txn-list">
                {recentTxns.length > 0 ? (
                    recentTxns.slice(0, 3).map((txn) => {
                        const isExpense = txn.amount < 0;
                        const isTransferSend = txn.type === 'transfer' && isExpense;
                        const fee = 0.5;
                        
                        const rawAmount = Math.abs(Number(txn.amount));
                        const displayAmount = isTransferSend ? rawAmount - fee : rawAmount;

                        const colorClass = isExpense ? 'txn-expense' : 'txn-income';
                        const iconColor = isExpense ? '#FBBF24' : '#38BDF8';

                        return (
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

                                <div className="txn-amount-group">
                                    <div className="txn-main-amount-row">
                                        {isExpense && (
                                            <Typography className={`txn-sign ${colorClass}`}>-</Typography>
                                        )}
                                        
                                        <IceCubeIcon width={18} height={18} color={iconColor} />
                                        
                                        <Typography className={`txn-value ${colorClass}`}>
                                            {displayAmount.toLocaleString('id-ID')}
                                        </Typography>
                                    </div>

                                    {isTransferSend && (
                                        <Typography className="txn-fee-text">
                                            + {fee} Fee
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <Typography className="no-txn-message">
                        No recent transactions.
                    </Typography>
                )}
            </div>
        </Box>
    );
}