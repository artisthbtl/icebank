import React, { useState } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Container, Box, Typography, Button, Pagination, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IcemanNavbar from '@/Components/IcemanNavbar';
import ManagePlanModal from '@/Components/ManagePlanModal';
import IceCubeIcon from '@/Components/IceCubeIcon';
import '../../../css/IcemanManageServicePlansPage.css';
import '../../../css/IcemanDashboardPage.css';

export default function ManageServicePlansPage() {
    const { service, plans } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const handlePageChange = (event, value) => {
        router.get(
            route('iceman.services.show', service.id), 
            { page: value }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCreateClick = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (plan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title={`Manage ${service.name} Plans`} />
            
            <div className="dashboard-page-wrapper">
                <IcemanNavbar />

                <Container maxWidth="md" className="iceman-plans-content-container">
                    
                    <Box className="plans-header-section">
                        <Link href={route('iceman.companies.show', service.company.id)} style={{ textDecoration: 'none' }}>
                            <Button 
                                startIcon={<ArrowBackIcon />} 
                                className="back-btn"
                            >
                                Back to {service.company.name}
                            </Button>
                        </Link>

                        <div className="service-context-header">
                            <div className="header-text">
                                <Typography variant="h4" className="page-title">
                                    {service.name}
                                </Typography>
                                <Typography variant="body1" className="page-subtitle" sx={{ mt: 2 }}>
                                    {service.description}
                                </Typography>
                                <Chip 
                                    label={service.type} 
                                    size="medium" 
                                    sx={{ mt: 2, bgcolor: '#334155', color: '#94A3B8' }} 
                                />
                            </div>
                        </div>
                    </Box>

                    <Box className="plans-toolbar">
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            className="add-plan-btn"
                            onClick={handleCreateClick}
                        >
                            Add Plan
                        </Button>
                    </Box>

                    <div className="plan-list">
                        {plans.data && plans.data.length > 0 ? (
                            plans.data.map((plan) => (
                                <div key={plan.id} className="plan-item">
                                    <div className="plan-info-group">
                                        <Typography className="plan-name">
                                            {plan.name}
                                        </Typography>
                                        
                                        <div className="plan-meta-details">
                                            <Box className="meta-tag price-tag">
                                                <IceCubeIcon sx={{ width: 18, height: 18, color: '#38BDF8' }} />
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ color: '#38BDF8', fontWeight: 'bold' }}
                                                >
                                                    {plan.price}
                                                </Typography>
                                            </Box>

                                            <Box className="meta-tag duration-tag">
                                                <AccessTimeIcon fontSize="small" />
                                                <Typography variant="body2">
                                                    {plan.duration} Days
                                                </Typography>
                                            </Box>
                                        </div>
                                    </div>

                                    <div className="plan-actions-group">
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<EditIcon />}
                                            className="edit-btn"
                                            size="small"
                                            onClick={() => handleEditClick(plan)}
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No plans found.</Typography>
                                <Typography variant="body2">Create a plan to start selling subscriptions.</Typography>
                            </Box>
                        )}
                    </div>

                    {plans.last_page > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination 
                                count={plans.last_page} 
                                page={plans.current_page} 
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': { color: '#94A3B8' },
                                    '& .Mui-selected': { bgcolor: '#38BDF8 !important', color: '#0F172A' }
                                }}
                            />
                        </Box>
                    )}

                    <ManagePlanModal 
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        service={service}
                        plan={editingPlan}
                    />

                </Container>
            </div>
        </>
    );
}