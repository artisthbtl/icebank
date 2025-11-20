import React, { useState, useRef } from 'react';
import { usePage, Head, router, useForm } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import { 
    Container, Box, Typography, Grid, Button, Avatar, 
    Divider, TextField, Alert, IconButton, CircularProgress 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../../css/ProfilePage.css';

export default function ProfilePage() {
    const { user } = usePage().props;
    
    const fileInputRef = useRef(null);
    const [showEmailForm, setShowEmailForm] = useState(false);

    // --- Forms ---

    // 1. Update PIN Form
    const pinForm = useForm({
        currentPin: '',
        newPin: '',
        newPin_confirmation: '',
    });

    // 2. Update Password Form
    const passwordForm = useForm({
        currentPassword: '',
        newPassword: '',
        newPassword_confirmation: '',
    });

    // 3. Update Email Form
    const emailForm = useForm({
        newEmail: '',
        pin: '',
    });

    // --- Handlers ---

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('photo', file);
            router.post(route('profile.update-photo'), formData, {
                forceFormData: true,
                onSuccess: () => console.log('Photo updated'),
            });
        }
    };

    const handleDeletePhoto = () => {
        if (confirm('Are you sure you want to delete your profile photo?')) {
            router.delete(route('profile.delete-photo'));
        }
    };

    const handleUpdatePin = (e) => {
        e.preventDefault();
        pinForm.put(route('profile.update-pin'), {
            onSuccess: () => pinForm.reset(),
            preserveScroll: true
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        passwordForm.put(route('profile.update-password'), {
            onSuccess: () => passwordForm.reset(),
            preserveScroll: true
        });
    };

    const handleUpdateEmail = (e) => {
        e.preventDefault();
        emailForm.put(route('profile.update-email'), {
            onSuccess: () => {
                emailForm.reset();
                setShowEmailForm(false);
            },
            preserveScroll: true
        });
    };

    const handleDeleteAccount = () => {
        // Placeholder for future functionality
        // Typically you'd open a modal to ask for password confirmation here
        console.log("Delete account clicked");
    };

    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <>
            <Head title="Profile" />
            <div className="profile-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="profile-container">
                    
                    {/* Main Card */}
                    <div className="profile-section-card">
                        
                        {/* --- Profile Photo Section --- */}
                        <Box className="profile-photo-section">
                            <input 
                                type="file" 
                                accept="image/*" 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handlePhotoChange} 
                            />
                            <div style={{ position: 'relative' }}>
                                <Avatar 
                                    src={user.profilePhotoPath} 
                                    className="profile-avatar"
                                >
                                    {user.firstName.charAt(0)}
                                </Avatar>
                                <IconButton 
                                    className="btn-primary"
                                    onClick={handlePhotoClick}
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: 0, 
                                        right: -10,
                                        width: 36,
                                        height: 36,
                                        minWidth: 0,
                                        padding: 0
                                    }}
                                >
                                    <PhotoCamera sx={{ fontSize: 20 }} />
                                </IconButton>
                            </div>
                            
                            {user.profilePhotoPath && (
                                <Button 
                                    startIcon={<DeleteIcon />} 
                                    onClick={handleDeletePhoto}
                                    color="error"
                                    size="small"
                                >
                                    Remove Photo
                                </Button>
                            )}
                        </Box>

                        <Divider className="divider-dashed" />

                        {/* --- Personal Information Grid --- */}
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">First Name</div>
                                <div className="info-value">{user.firstName}</div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">Last Name</div>
                                <div className="info-value">{user.lastName}</div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">City</div>
                                <div className="info-value">{user.city}</div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">Date of Birth</div>
                                <div className="info-value">{formatDate(user.dateOfBirth)}</div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">Member Since</div>
                                <div className="info-value">{formatDate(user.createdAt)}</div>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <div className="info-label">Verification Status</div>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                    {user.emailVerifiedAt ? (
                                        <span className="verify-status-badge status-verified">
                                            <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                            Verified
                                        </span>
                                    ) : (
                                        <>
                                            <span className="verify-status-badge status-unverified">
                                                <ErrorOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                                Unverified
                                            </span>
                                            <Button 
                                                variant="contained" 
                                                size="small" 
                                                href={route('verify.id')}
                                                className="btn-primary"
                                                sx={{ py: 0.5, fontSize: '0.75rem' }}
                                            >
                                                Verify ID
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider className="divider-dashed" />

                        {/* --- Email Section --- */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <div className="info-label">Email Address</div>
                                    <div className="info-value">{user.email}</div>
                                </Box>
                                <Button 
                                    variant="outlined" 
                                    className="btn-secondary"
                                    onClick={() => setShowEmailForm(!showEmailForm)}
                                >
                                    {showEmailForm ? 'Cancel' : 'Change Email'}
                                </Button>
                            </Box>

                            {showEmailForm && (
                                <Box component="form" onSubmit={handleUpdateEmail} sx={{ mt: 3, maxWidth: '400px' }}>
                                    {emailForm.hasErrors && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            {emailForm.errors.message || "Please fix the errors below."}
                                        </Alert>
                                    )}
                                    <TextField
                                        fullWidth
                                        label="New Email Address"
                                        type="email"
                                        value={emailForm.data.newEmail}
                                        onChange={e => emailForm.setData('newEmail', e.target.value)}
                                        error={!!emailForm.errors.newEmail}
                                        helperText={emailForm.errors.newEmail}
                                        className="profile-input-field"
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="6-Digit PIN"
                                        type="password"
                                        inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                                        value={emailForm.data.pin}
                                        onChange={e => emailForm.setData('pin', e.target.value)}
                                        error={!!emailForm.errors.pin}
                                        helperText={emailForm.errors.pin}
                                        className="profile-input-field"
                                        sx={{ mb: 2 }}
                                    />
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        className="btn-primary"
                                        disabled={emailForm.processing}
                                    >
                                        Update Email
                                    </Button>
                                </Box>
                            )}
                        </Box>

                        <Divider className="divider-dashed" />

                        {/* --- Change PIN Form --- */}
                        <Box component="form" onSubmit={handleUpdatePin}>
                            <Typography className="profile-form-title">Change PIN</Typography>
                            
                            {pinForm.hasErrors && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {pinForm.errors.message || "Please check your inputs."}
                                </Alert>
                            )}
                            {pinForm.recentlySuccessful && (
                                <Alert severity="success" sx={{ mb: 2 }}>PIN updated successfully.</Alert>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Current PIN"
                                        type="password"
                                        inputProps={{ maxLength: 6 }}
                                        value={pinForm.data.currentPin}
                                        onChange={e => pinForm.setData('currentPin', e.target.value)}
                                        error={!!pinForm.errors.currentPin}
                                        helperText={pinForm.errors.currentPin}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="New PIN"
                                        type="password"
                                        inputProps={{ maxLength: 6 }}
                                        value={pinForm.data.newPin}
                                        onChange={e => pinForm.setData('newPin', e.target.value)}
                                        error={!!pinForm.errors.newPin}
                                        helperText={pinForm.errors.newPin}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New PIN"
                                        type="password"
                                        inputProps={{ maxLength: 6 }}
                                        value={pinForm.data.newPin_confirmation}
                                        onChange={e => pinForm.setData('newPin_confirmation', e.target.value)}
                                        error={!!pinForm.errors.newPin_confirmation}
                                        helperText={pinForm.errors.newPin_confirmation}
                                        className="profile-input-field"
                                    />
                                </Grid>
                            </Grid>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                className="btn-primary"
                                sx={{ mt: 2 }}
                                disabled={pinForm.processing}
                            >
                                Change PIN
                            </Button>
                        </Box>

                        <Divider className="divider-dashed" />

                        {/* --- Change Password Form --- */}
                        <Box component="form" onSubmit={handleUpdatePassword}>
                            <Typography className="profile-form-title">Change Password</Typography>
                            
                            {passwordForm.hasErrors && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {passwordForm.errors.message || "Please check your inputs."}
                                </Alert>
                            )}
                            {passwordForm.recentlySuccessful && (
                                <Alert severity="success" sx={{ mb: 2 }}>Password updated successfully.</Alert>
                            )}

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type="password"
                                        value={passwordForm.data.currentPassword}
                                        onChange={e => passwordForm.setData('currentPassword', e.target.value)}
                                        error={!!passwordForm.errors.currentPassword}
                                        helperText={passwordForm.errors.currentPassword}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        value={passwordForm.data.newPassword}
                                        onChange={e => passwordForm.setData('newPassword', e.target.value)}
                                        error={!!passwordForm.errors.newPassword}
                                        helperText={passwordForm.errors.newPassword}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        type="password"
                                        value={passwordForm.data.newPassword_confirmation}
                                        onChange={e => passwordForm.setData('newPassword_confirmation', e.target.value)}
                                        error={!!passwordForm.errors.newPassword_confirmation}
                                        helperText={passwordForm.errors.newPassword_confirmation}
                                        className="profile-input-field"
                                    />
                                </Grid>
                            </Grid>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                className="btn-primary"
                                sx={{ mt: 2 }}
                                disabled={passwordForm.processing}
                            >
                                Change Password
                            </Button>
                        </Box>

                        <Divider className="divider-dashed" />

                        {/* --- Delete Account --- */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography sx={{ color: '#F87171', fontWeight: 600, fontSize: '1.1rem' }}>
                                    Delete Account
                                </Typography>
                                <Typography sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>
                                    Once you delete your account, there is no going back. Please be certain.
                                </Typography>
                            </Box>
                            <Button 
                                variant="outlined" 
                                className="btn-danger"
                                onClick={handleDeleteAccount}
                            >
                                Delete Account
                            </Button>
                        </Box>

                    </div>
                </Container>
            </div>
        </>
    );
}