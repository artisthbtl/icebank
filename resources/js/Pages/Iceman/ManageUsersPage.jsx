import React from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import { Container, Box, Typography, Button, Avatar, Chip, Pagination } from '@mui/material';
import IcemanNavbar from '@/Components/IcemanNavbar';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../../../css/IcemanManageUsersPage.css';

export default function ManageUsersPage() {
    const { users } = usePage().props;

    const handlePageChange = (event, value) => {
        router.get(window.location.pathname, { page: value }, { preserveState: true });
    };

    return (
        <>
            <Head title="Manage Users" />
            
            <div className="iceman-users-page-wrapper">
                <IcemanNavbar />

                <Container maxWidth="md" className="iceman-users-content-container">
                    <Box className="iceman-users-header-section">
                        <Typography variant="h4" className="page-title">
                            Manage Users
                        </Typography>
                        <Typography variant="body1" className="page-subtitle">
                            View and manage registered users and their verification status.
                        </Typography>
                    </Box>

                    <Box className="user-list-container">
                        {users.data && users.data.length > 0 ? (
                            <div className="user-list">
                                {users.data.map((user) => {
                                    const isPending = user.latest_verification_status === 'pending';
                                    
                                    return (
                                        <div key={user.id} className={`user-item ${isPending ? 'user-item-pending' : ''}`}>
                                            <div className="user-info-group">
                                                <Avatar 
                                                    src={user.profile_photo_path ? `/storage/${user.profile_photo_path}` : undefined} 
                                                    className="user-avatar"
                                                >
                                                    {user.first_name?.charAt(0)}
                                                </Avatar>
                                                
                                                <div className="user-details">
                                                    <Typography className="user-name">
                                                        {user.first_name} {user.last_name}
                                                    </Typography>
                                                    <Typography className="user-email">
                                                        {user.email}
                                                    </Typography>
                                                </div>
                                            </div>

                                            <div className="user-actions-group">
                                                {isPending && (
                                                    <Chip 
                                                        icon={<WarningAmberIcon sx={{ fontSize: '1rem !important' }} />}
                                                        label="Verification Required" 
                                                        className="status-chip-pending"
                                                        size="small"
                                                    />
                                                )}
                                                
                                                <Link href={route('iceman.users.show', user.id)} style={{ textDecoration: 'none' }}>
                                                    <Button 
                                                        variant="outlined" 
                                                        endIcon={<ArrowForwardIcon />}
                                                        className="manage-btn"
                                                    >
                                                        Manage
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No users found.</Typography>
                            </Box>
                        )}

                        {users.last_page > 1 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                <Pagination 
                                    count={users.last_page} 
                                    page={users.current_page} 
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        )}
                    </Box>
                </Container>
            </div>
        </>
    );
}