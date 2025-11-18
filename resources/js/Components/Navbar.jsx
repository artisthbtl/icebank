import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    Container 
} from '@mui/material';

export default function Navbar() {
    const { auth } = usePage().props;

    return (
        <AppBar position="static" className="dashboard-navbar" sx={{ boxShadow: 'none' }}>
            <Container maxWidth="md">
                <Toolbar disableGutters>
                    <Typography 
                        variant="h6"
                        component="div"
                        className="dashboard-logo-text"
                    >
                        Icebank
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {auth.user ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Link 
                                href="/profile"
                                className="dashboard-nav-link-profile"
                            >
                                Profile
                            </Link>
                            
                            <Link 
                                href="/logout" 
                                method="get" 
                                as="button" 
                                className="dashboard-nav-link-logout"
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer'
                                }}
                            >
                                Logout
                            </Link>
                        </Box>
                    ) : null}
                </Toolbar>
            </Container>
        </AppBar>
    );
}