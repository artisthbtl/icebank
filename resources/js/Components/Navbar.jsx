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
                                className="dashboard-nav-link"
                            >
                                Profile
                            </Link>
                            
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button" 
                                className="dashboard-nav-link"
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer', 
                                    color: '#f87171'
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