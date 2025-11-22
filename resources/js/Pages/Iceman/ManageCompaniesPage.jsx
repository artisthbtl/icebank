import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { Container, Box, Typography, Button, TextField, Pagination, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { debounce } from 'lodash';

import IcemanNavbar from '@/Components/IcemanNavbar';
import ManageCompanyModal from '@/Components/ManageCompanyModal';
import '../../../css/IcemanManageCompaniesPage.css';
import '../../../css/IcemanDashboardPage.css';

export default function ManageCompaniesPage() {
    const { companies, filters } = usePage().props;
    
    const [search, setSearch] = useState(filters.search || '');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const debouncedSearch = useCallback(
        debounce((query) => {
            router.get(route('iceman.companies.index'), { search: query }, { preserveState: true, replace: true });
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
    };

    const handlePageChange = (event, value) => {
        router.get(route('iceman.companies.index'), { search: search, page: value }, { preserveState: true });
    };

    const handleCreateClick = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title="Manage Companies" />
            
            <div className="dashboard-page-wrapper">
                <IcemanNavbar />

                <Container maxWidth="md" className="iceman-companies-content-container">
                    
                    <Box className="iceman-companies-header-section">
                        <div>
                            <Typography variant="h4" className="page-title">
                                Manage Companies
                            </Typography>
                            <Typography variant="body1" className="page-subtitle">
                                Create companies and manage their services.
                            </Typography>
                        </div>
                    </Box>

                    <Box className="companies-toolbar">
                        <div className="search-input-wrapper">
                            <SearchIcon className="search-icon" />
                            <TextField 
                                placeholder="Search companies..." 
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                className="search-input"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            className="add-company-btn"
                            onClick={handleCreateClick}
                        >
                            Add Company
                        </Button>
                    </Box>

                    <div className="company-list">
                        {companies.data && companies.data.length > 0 ? (
                            companies.data.map((company) => (
                                <div key={company.id} className="company-item">
                                    <div className="company-info-group">
                                        <Avatar 
                                            src={company.logo_url} 
                                            className="company-logo"
                                            variant="rounded"
                                        >
                                            {company.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        
                                        <div className="company-details">
                                            <Typography className="company-name">
                                                {company.name}
                                            </Typography>
                                            <div className="company-meta">
                                                <span className="service-count-badge">
                                                    {company.services_count} Services
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="company-actions-group">
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<EditIcon />}
                                            className="edit-btn"
                                            size="small"
                                            onClick={() => handleEditClick(company)}
                                        >
                                            Edit
                                        </Button>
                                        
                                        <Link href={route('iceman.companies.show', company.id)} style={{ textDecoration: 'none' }}>
                                            <Button 
                                                variant="outlined" 
                                                endIcon={<ArrowForwardIcon />}
                                                className="manage-services-btn"
                                                size="small"
                                            >
                                                Manage Services
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No companies found.</Typography>
                                <Typography variant="body2">Click "Add Company" to get started.</Typography>
                            </Box>
                        )}
                    </div>

                    {companies.last_page > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination 
                                count={companies.last_page} 
                                page={companies.current_page} 
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': { color: '#94A3B8' },
                                    '& .Mui-selected': { bgcolor: '#38BDF8 !important', color: '#0F172A' }
                                }}
                            />
                        </Box>
                    )}
                </Container>
            </div>

            <ManageCompanyModal 
                open={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                company={editingCompany}
            />
        </>
    );
}