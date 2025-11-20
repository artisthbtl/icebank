import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Container, Box, Typography, Button } from '@mui/material';
import Navbar from "@/Components/Navbar";
import IceCubeIcon from '@/Components/IceCubeIcon';
import '../../css/TransactionPage.css';

export default function TransactionPage() {
    const { transactions } = usePage().props;
    const [allTransactions, setAllTransactions] = useState(transactions.data);

    useEffect(() => {
        if (transactions.meta.current_page === 1) {
            setAllTransactions(transactions.data);
        } else {
            setAllTransactions(prev => {
                const newIds = new Set(transactions.data.map(t => t.id));
                const existing = prev.filter(t => !newIds.has(t.id));
                return [...existing, ...transactions.data];
            });
        }
    }, [transactions]);

    const handleLoadMore = () => {
        if (transactions.links.next) {
            router.visit(transactions.links.next, {
                preserveState: true,
                preserveScroll: true,
                only: ['transactions']
            });
        }
    };

    return (
        <>
            <Head title="Transaction History" />
            <div className="transaction-page-wrapper">
                <Navbar />
                <Container maxWidth="md" className="transaction-content-container">
                    
                    <Box className="transaction-header-section">
                        <Typography variant="h4" className="page-title">
                            Transaction History
                        </Typography>
                        <Typography variant="body1" className="page-subtitle">
                            View all your incomes and expenses.
                        </Typography>
                    </Box>

                    <Box className="transaction-list-container">
                        {allTransactions.length > 0 ? (
                            <div className="transaction-list">
                                {allTransactions.map((txn) => {
                                    const isExpense = txn.amount < 0;
                                    const isTransferSend = txn.type === 'transfer' && isExpense;
                                    const fee = 0.5;
                                    
                                    const rawAmount = Math.abs(Number(txn.amount));
                                    const displayAmount = isTransferSend ? rawAmount - fee : rawAmount;

                                    const colorClass = isExpense ? 'txn-expense' : 'txn-income';
                                    const iconColor = isExpense ? '#FBBF24' : '#38BDF8';

                                    return (
                                        <div key={txn.id} className="transaction-item">
                                            <div className="txn-details">
                                                <Typography className="txn-title">
                                                    {txn.description}
                                                </Typography>
                                                <Typography className="txn-date">
                                                    {new Date(txn.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
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
                                })}
                            </div>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No transactions found.</Typography>
                            </Box>
                        )}
                    </Box>

                    {transactions.links.next && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Button 
                                onClick={handleLoadMore} 
                                variant="outlined" 
                                className="load-more-btn"
                            >
                                Load More
                            </Button>
                        </Box>
                    )}

                </Container>
            </div>
        </>
    );
}