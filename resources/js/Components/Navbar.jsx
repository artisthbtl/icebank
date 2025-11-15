import React from 'react';
import { Link } from '@inertiajs/react';
import { Typography } from '@mui/material';
import '../../css/DashboardPage.css';

export default function Navbar() {
    return (
        <nav className="dashboard-navbar">
            <div className="dashboard-navbar-logo">
                <Typography variant="h4" className="dashboard-logo-text">
                    ICEBANK
                </Typography>
            </div>
            <div className="dashboard-navbar-links">
                <Link href="/profile" className="dashboard-nav-link">
                    Profile
                </Link>
            </div>
        </nav>
    );
}