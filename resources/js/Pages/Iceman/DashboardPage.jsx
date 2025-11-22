import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import IcemanNavbar from '@/Components/IcemanNavbar';
import PeopleIcon from '@mui/icons-material/People';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import '../../../css/IcemanDashboardPage.css'; 

export default function DashboardPage() {
    return (
        <>
            <Head title="Iceman Dashboard" />
            
            <div className="dashboard-page-wrapper">
                <IcemanNavbar />

                <Container maxWidth="md" className="dashboard-content-container">
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Admin Page
                        </Typography>
                        <Typography variant="body1">
                            Manage the Icebank system resources.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={6} md={6}>
                            <div className="iceman-card">
                                <div className="iceman-card-icon">
                                    <PeopleIcon sx={{ fontSize: 32 }} />
                                </div>
                                <h2 className="iceman-card-title">Manage Users</h2>
                                <p className="iceman-card-description">
                                    View registered users, verify identities, and manage account statuses.
                                </p>
                                <Link href={route('iceman.users')} style={{ width: '100%', textDecoration: 'none' }}>
                                    <Button 
                                        variant="contained" 
                                        className="iceman-action-btn"
                                        fullWidth
                                    >
                                        Go to Users
                                    </Button>
                                </Link>
                            </div>
                        </Grid>

                        <Grid size={6} md={6}>
                            <div className="iceman-card">
                                <div className="iceman-card-icon">
                                    <DesignServicesIcon sx={{ fontSize: 32 }} />
                                </div>
                                <h2 className="iceman-card-title">Manage Services</h2>
                                <p className="iceman-card-description">
                                    Configure subscription plans, update service details, and pricing.
                                </p>
                                <Link href={route('iceman.services')} style={{ width: '100%', textDecoration: 'none' }}>
                                    <Button 
                                        variant="contained" 
                                        className="iceman-action-btn"
                                        fullWidth
                                    >
                                        Go to Services
                                    </Button>
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </>
    );
}