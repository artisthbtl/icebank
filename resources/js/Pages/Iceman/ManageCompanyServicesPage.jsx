import { useState} from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Container, Box, Typography, Button, Pagination, Avatar, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LayersIcon from '@mui/icons-material/Layers';
import IcemanNavbar from '@/Components/IcemanNavbar';
import ManageServiceModal from '@/Components/ManageServiceModal';
import '../../../css/IcemanManageCompanyServicesPage.css';
import '../../../css/IcemanDashboardPage.css';

export default function ManageCompanyServicesPage() {
    const { company, services } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const handlePageChange = (event, value) => {
        router.get(
            route('iceman.companies.show', company.id), 
            { page: value }, 
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleCreateClick = () => {
        setEditingService(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (service) => {
        setEditingService(service);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title={`Manage ${company.name} Services`} />
            
            <div className="dashboard-page-wrapper">
                <IcemanNavbar />

                <Container maxWidth="md" className="iceman-services-content-container">
                    
                    <Box className="services-header-section">
                        <Link href={route('iceman.companies.index')} style={{ textDecoration: 'none' }}>
                            <Button 
                                startIcon={<ArrowBackIcon />} 
                                className="back-btn"
                            >
                                Back to Companies
                            </Button>
                        </Link>

                        <div className="company-context-header">
                            <Avatar 
                                src={company.logo_url} 
                                className="header-company-logo"
                                variant="rounded"
                            >
                                {company.name.charAt(0).toUpperCase()}
                            </Avatar>
                            
                            <div className="header-text">
                                <Typography variant="h4" className="page-title">
                                    {company.name}
                                </Typography>
                                <Typography variant="body1" className="page-subtitle">
                                    Managing Services
                                </Typography>
                            </div>
                        </div>
                    </Box>

                    <Box className="services-toolbar">
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            className="add-service-btn"
                            onClick={handleCreateClick}
                        >
                            Add Service
                        </Button>
                    </Box>

                    <div className="service-list">
                        {services.data && services.data.length > 0 ? (
                            services.data.map((service) => (
                                <div key={service.id} className="service-item">
                                    <div className="service-info-group">
                                        <div className="service-meta-row">
                                            <Typography className="service-name">
                                                {service.name}
                                            </Typography>
                                            <span className="service-type-badge">
                                                {service.type}
                                            </span>
                                        </div>
                                        
                                        <Typography className="service-desc">
                                            {service.description || 'No description provided.'}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: '#94A3B8' }}>
                                            <LayersIcon sx={{ fontSize: 16 }} />
                                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                                {service.plans_count} Plans
                                            </Typography>
                                        </Box>
                                    </div>

                                    <div className="service-actions-group">
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<EditIcon />}
                                            className="edit-btn"
                                            size="small"
                                            onClick={() => handleEditClick(service)}
                                        >
                                            Edit
                                        </Button>
                                        
                                        <Link href={route('iceman.services.show', service.id)} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                endIcon={<ArrowForwardIcon />}
                                                className="manage-plans-btn"
                                                size="small"
                                            >
                                                Manage Plans
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No services found.</Typography>
                                <Typography variant="body2">Add a service to start selling plans.</Typography>
                            </Box>
                        )}
                    </div>

                    {services.last_page > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination 
                                count={services.last_page} 
                                page={services.current_page} 
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': { color: '#94A3B8' },
                                    '& .Mui-selected': { bgcolor: '#38BDF8 !important', color: '#0F172A' }
                                }}
                            />
                        </Box>
                    )}

                    <ManageServiceModal 
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        company={company}
                        service={editingService}
                    />

                </Container>
            </div>
        </>
    );
}