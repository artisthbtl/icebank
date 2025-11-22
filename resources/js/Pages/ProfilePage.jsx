import React, { useState, useRef } from 'react';
import { usePage, Head, router, useForm } from '@inertiajs/react';
import Navbar from "@/Components/Navbar";
import { 
    Container, Box, Typography, Grid, Button, Avatar, 
    Divider, TextField, Alert, IconButton, InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteUserModal from '@/Components/DeleteUserModal';
import '../../css/ProfilePage.css';
import '../../css/DashboardPage.css';

export default function ProfilePage() {
    const { user } = usePage().props;
    const [emailStatus, setEmailStatus] = useState({ type: null, message: '' });
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [pinStatus, setPinStatus] = useState({ type: null, message: '' });
    const [passwordStatus, setPasswordStatus] = useState({ type: null, message: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photoStatus, setPhotoStatus] = useState({ type: null, message: '' });
    const [photoValidation, setPhotoValidation] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const showVerifyButton = user.isVerified === 'no' && (user.latestVerificationStatus === null || user.latestVerificationStatus === 'rejected');
    const isPending = user.latestVerificationStatus === 'pending';
    const fileInputRef = useRef(null);
    
    const emailForm = useForm({
        newEmail: '',
        pin: '',
    });

    const pinForm = useForm({
        currentPin: '',
        newPin: '',
        newPinConfirmation: '',
    });

    const passwordForm = useForm({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirmation: '', 
    });

    const isValidEmailFormat = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isEmailInputInvalid = emailForm.data.newEmail.length > 0 && !isValidEmailFormat(emailForm.data.newEmail);

    const arePinsMismatched = pinForm.data.newPin && 
                            pinForm.data.newPinConfirmation && 
                            pinForm.data.newPin !== pinForm.data.newPinConfirmation;

    const arePasswordsMismatched = passwordForm.data.newPassword && 
                                   passwordForm.data.newPasswordConfirmation && 
                                   passwordForm.data.newPassword !== passwordForm.data.newPasswordConfirmation;

    const handlePinFormChange = (field) => (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        pinForm.setData(field, value);
    };
    
    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        emailForm.setData('pin', value);
    };

    const handleUpdateEmail = (e) => {
        e.preventDefault();
        setEmailStatus({ type: null, message: '' });
        
        emailForm.put(route('profile.update-email'), {
            onSuccess: () => {
                emailForm.reset();
                setEmailStatus({ 
                    type: 'success', 
                    message: 'Please verify your new email in order to apply the changes.' 
                });
            },
            onError: () => {
                setEmailStatus({ 
                    type: 'error', 
                    message: 'Failed to update email. Please correct the errors below.' 
                });
            },
            preserveScroll: true
        });
    };
    
    const handleUpdatePin = (e) => {
        e.preventDefault();
        setPinStatus({ type: null, message: '' });

        if (pinForm.data.newPin !== pinForm.data.newPinConfirmation) {
            pinForm.setError('newPinConfirmation', 'PINs do not match');
            return;
        }

        pinForm.put(route('profile.update-pin'), {
            onSuccess: () => {
                pinForm.reset();
                setPinStatus({ 
                    type: 'success', 
                    message: 'Your PIN has been successfully updated.' 
                });
            },
            onError: () => {
                setPinStatus({ 
                    type: 'error', 
                    message: 'Failed to update PIN. Please correct the errors below.' 
                });
            },
            preserveScroll: true
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        setPasswordStatus({ type: null, message: '' });

        if (passwordForm.data.newPassword !== passwordForm.data.newPasswordConfirmation) {
            passwordForm.setError('newPasswordConfirmation', 'Passwords do not match');
            return;
        }

        passwordForm.put(route('profile.update-password'), {
            onSuccess: () => {
                passwordForm.reset();
                setPasswordStatus({ 
                    type: 'success', 
                    message: 'Password updated successfully.' 
                });
            },
            onError: () => {
                setPasswordStatus({ 
                    type: 'error', 
                    message: 'Failed to update password. Please correct the errors below.' 
                });
            },
            preserveScroll: true
        });
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoValidation('');
            setPhotoStatus({ type: null, message: '' });

            if (file.size > 2 * 1024 * 1024) {
                setPhotoValidation('The photo must not be greater than 2MB.');
                return;
            }

            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                setPhotoValidation('The photo must be a file of type: jpeg, png, jpg.');
                return;
            }

            const formData = new FormData();
            formData.append('photo', file);
            
            router.post(route('profile.update-photo'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setPhotoStatus({ type: 'success', message: 'Profile photo updated successfully.' });
                    setPhotoValidation(''); 
                },
                onError: (errors) => {
                    setPhotoStatus({ 
                        type: 'error', 
                        message: errors.photo || 'Failed to update profile photo.' 
                    });
                },
            });
        }
    };

    const handleDeletePhoto = () => {
        setPhotoStatus({ type: null, message: '' });
        setPhotoValidation('');

        if (!user.profilePhotoPath) {
            setPhotoStatus({ type: 'error', message: 'No profile photo to delete.' });
            return;
        }

        router.delete(route('profile.delete-photo'), {
            preserveScroll: true,
            onSuccess: () => {
                setPhotoStatus({ type: 'success', message: 'Profile photo deleted successfully.' });
            },
            onError: () => {
                setPhotoStatus({ type: 'error', message: 'You have no profile photo to delete.' });
            },
        });
    };

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <>
            <Head title="Profile" />
            <div className="dashboard-page-wrapper">
                <Navbar />

                <Container maxWidth="md" className="profile-container">
                    <div className="profile-section-card">
                        <Box className="profile-photo-section" >
                            <input 
                                type="file" 
                                accept="image/png, image/jpeg, image/jpg" 
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

                            {photoValidation && (
                                <Typography sx={{ color: '#d32f2f', fontSize: '0.85rem', mt: 1, fontWeight: 500 }}>
                                    {photoValidation}
                                </Typography>
                            )}
                            
                            {user.profilePhotoPath && (
                                <Button 
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDeletePhoto}
                                    color="error"
                                    size="medium"
                                    sx={{ mt: 1, textTransform: 'none' }}
                                >
                                    Remove Photo
                                </Button>
                            )}

                            {photoStatus.type && (
                                <Grid container sx={{ mt: 2, width: '100%' }}>
                                    <Grid size={12}>
                                        <Alert 
                                            severity={photoStatus.type === 'success' ? 'info' : 'error'}
                                            icon={photoStatus.type === 'success' 
                                                ? <CheckCircleIcon fontSize="inherit" /> 
                                                : <ErrorOutlineIcon fontSize="inherit" />
                                            }
                                            sx={{ 
                                                backgroundColor: photoStatus.type === 'success' 
                                                    ? 'rgba(56, 189, 248, 0.15) !important' 
                                                    : 'rgba(211, 47, 47, 0.1) !important', 
                                                color: photoStatus.type === 'success' 
                                                    ? '#38BDF8 !important' 
                                                    : '#d32f2f !important', 
                                                border: photoStatus.type === 'success' 
                                                    ? '1px solid rgba(56, 189, 248, 0.3) !important' 
                                                    : '1px solid rgba(211, 47, 47, 0.3) !important',
                                                borderRadius: '8px !important',
                                                fontWeight: 500
                                            }}
                                        >
                                            {photoStatus.message}
                                        </Alert>
                                    </Grid>
                                </Grid>
                            )}
                        </Box>

                        <Divider className="divider-dashed" sx={{ mt: 0 }} />

                        <Grid container spacing={3}>
                            <Grid size={4}>
                                <div className="info-label">First Name</div>
                                <div className="info-value">{user.firstName}</div>
                            </Grid>
                            <Grid size={4}>
                                <div className="info-label">Last Name</div>
                                <div className="info-value">{user.lastName}</div>
                            </Grid>
                            <Grid size={4}>
                                <div className="info-label">City</div>
                                <div className="info-value">{user.city}</div>
                            </Grid>
                            <Grid size={4}>
                                <div className="info-label">Date of Birth</div>
                                <div className="info-value">{formatDate(user.dateOfBirth)}</div>
                            </Grid>
                            <Grid size={4}>
                                <div className="info-label">Member Since</div>
                                <div className="info-value">{formatDate(user.createdAt)}</div>
                            </Grid>
                            <Grid size={4}>
                                <div className="info-label">Verification Status</div>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                                    {user.isVerified === 'yes' ? (
                                        <span className="verify-status-badge status-verified">
                                            <CheckCircleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                            Verified
                                        </span>
                                    ) : isPending ? (
                                        <span className="verify-status-badge status-pending" style={{ 
                                            backgroundColor: 'rgba(234, 179, 8, 0.1)', 
                                            color: '#ca8a04',
                                            border: '1px solid rgba(234, 179, 8, 0.2)'
                                        }}>
                                            <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} /> {/* Import AccessTimeIcon */}
                                            Pending
                                        </span>
                                    ) : (
                                        <span className="verify-status-badge status-unverified">
                                            <ErrorOutlineIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                            Unverified
                                        </span>
                                    )}
                                </Box>
                            </Grid>

                            {showVerifyButton && (
                                <Grid size={12}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        className="btn-primary"
                                        sx={{ textTransform: 'none' }}
                                        href={route('verify.id')}
                                        disabled={pinForm.processing}
                                        fullWidth
                                    >
                                        Verify ID
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        <Divider className="divider-dashed" />

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
                                    sx={{ textTransform: 'none' }}
                                >
                                    {showEmailForm ? 'Cancel' : 'Change Email'}
                                </Button>
                            </Box>

                            {showEmailForm && (
                                <Box component="form" onSubmit={handleUpdateEmail}>
                                    <Grid container spacing={2}>
                                        {emailStatus.type && (
                                            <Grid size={12}>
                                                <Alert 
                                                    severity={emailStatus.type === 'success' ? 'info' : 'error'}
                                                    icon={emailStatus.type === 'success' 
                                                        ? <CheckCircleIcon fontSize="inherit" /> 
                                                        : <ErrorOutlineIcon fontSize="inherit" />
                                                    }
                                                    sx={{ 
                                                        backgroundColor: emailStatus.type === 'success' 
                                                            ? 'rgba(56, 189, 248, 0.15) !important' 
                                                            : 'rgba(211, 47, 47, 0.1) !important', 
                                                        color: emailStatus.type === 'success' 
                                                            ? '#38BDF8 !important' 
                                                            : '#d32f2f !important', 
                                                        border: emailStatus.type === 'success' 
                                                            ? '1px solid rgba(56, 189, 248, 0.3) !important' 
                                                            : '1px solid rgba(211, 47, 47, 0.3) !important',
                                                        borderRadius: '8px !important',
                                                        mb: 1,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {emailStatus.message}
                                                </Alert>
                                            </Grid>
                                        )}

                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="New Email Address"
                                                value={emailForm.data.newEmail}
                                                onChange={e => emailForm.setData('newEmail', e.target.value)}
                                                error={!!emailForm.errors.newEmail || isEmailInputInvalid}
                                                helperText={emailForm.errors.newEmail || (isEmailInputInvalid ? "Invalid email format" : "")}
                                                className="profile-input-field"
                                            />
                                        </Grid>

                                        <Grid size={6}>
                                            <TextField
                                                fullWidth
                                                label="6-Digit PIN"
                                                type="password"
                                                slotProps={{ 
                                                    htmlInput: { 
                                                        maxLength: 6, 
                                                        pattern: '[0-9]*',
                                                        inputMode: 'numeric'
                                                    } 
                                                }}
                                                value={emailForm.data.pin}
                                                onChange={handlePinChange}
                                                error={!!emailForm.errors.pin}
                                                helperText={emailForm.errors.pin}
                                                className="profile-input-field"
                                            />
                                        </Grid>

                                        <Grid size={9.8} />
                                        <Grid size={2.2}>   
                                            <Button
                                                type="submit" 
                                                variant="contained" 
                                                className="btn-primary"
                                                disabled={emailForm.processing}
                                                fullWidth
                                                sx={{ textTransform: 'none' }}
                                            >
                                                Update
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>

                        <Divider className="divider-dashed" />

                        <Box component="form" onSubmit={handleUpdatePin}>
                            <Typography className="profile-form-title" sx={{ mb: 2 }}>Change PIN</Typography>
                            
                            <Grid container spacing={2}>
                                {pinStatus.type && (
                                    <Grid size={12}>
                                        <Alert 
                                            severity={pinStatus.type === 'success' ? 'info' : 'error'}
                                            icon={pinStatus.type === 'success' 
                                                ? <CheckCircleIcon fontSize="inherit" /> 
                                                : <ErrorOutlineIcon fontSize="inherit" />
                                            }
                                            sx={{ 
                                                backgroundColor: pinStatus.type === 'success' 
                                                    ? 'rgba(56, 189, 248, 0.15) !important' 
                                                    : 'rgba(211, 47, 47, 0.1) !important', 
                                                color: pinStatus.type === 'success' 
                                                    ? '#38BDF8 !important' 
                                                    : '#d32f2f !important', 
                                                border: pinStatus.type === 'success' 
                                                    ? '1px solid rgba(56, 189, 248, 0.3) !important' 
                                                    : '1px solid rgba(211, 47, 47, 0.3) !important',
                                                borderRadius: '8px !important',
                                                mb: 1,
                                                fontWeight: 500
                                            }}
                                        >
                                            {pinStatus.message}
                                        </Alert>
                                    </Grid>
                                )}

                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Current PIN"
                                        type="password"
                                        slotProps={{ 
                                            htmlInput: { maxLength: 6, pattern: '[0-9]*', inputMode: 'numeric' } 
                                        }}
                                        value={pinForm.data.currentPin}
                                        onChange={handlePinFormChange('currentPin')}
                                        error={!!pinForm.errors.currentPin}
                                        helperText={pinForm.errors.currentPin}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="New PIN"
                                        type="password"
                                        slotProps={{ 
                                            htmlInput: { maxLength: 6, pattern: '[0-9]*', inputMode: 'numeric' } 
                                        }}
                                        value={pinForm.data.newPin}
                                        onChange={handlePinFormChange('newPin')}
                                        error={!!pinForm.errors.newPin}
                                        helperText={pinForm.errors.newPin}
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New PIN"
                                        type="password"
                                        slotProps={{ 
                                            htmlInput: { maxLength: 6, pattern: '[0-9]*', inputMode: 'numeric' } 
                                        }}
                                        value={pinForm.data.newPinConfirmation}
                                        onChange={handlePinFormChange('newPinConfirmation')}
                                        error={!!pinForm.errors.newPinConfirmation || arePinsMismatched}
                                        helperText={
                                            pinForm.errors.newPinConfirmation || 
                                            (arePinsMismatched ? "PINs do not match" : "")
                                        }
                                        className="profile-input-field"
                                    />
                                </Grid>
                                <Grid size={9.8} />
                                <Grid size={2.2}>
                                    <Button 
                                        type="submit" 
                                        variant="contained" 
                                        className="btn-primary"
                                        sx={{ textTransform: 'none' }}
                                        disabled={pinForm.processing}
                                        fullWidth
                                    >
                                        Change
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider className="divider-dashed" />

                        <Box component="form" onSubmit={handleUpdatePassword}>
                            <Typography className="profile-form-title" sx={{ mb: 2 }} >Change Password</Typography>
                            
                            <Grid container spacing={2}>
                                {passwordStatus.type && (
                                    <Grid size={12}>
                                        <Alert 
                                            severity={passwordStatus.type === 'success' ? 'info' : 'error'}
                                            icon={passwordStatus.type === 'success' 
                                                ? <CheckCircleIcon fontSize="inherit" /> 
                                                : <ErrorOutlineIcon fontSize="inherit" />
                                            }
                                            sx={{ 
                                                backgroundColor: passwordStatus.type === 'success' 
                                                    ? 'rgba(56, 189, 248, 0.15) !important' 
                                                    : 'rgba(211, 47, 47, 0.1) !important', 
                                                color: passwordStatus.type === 'success' 
                                                    ? '#38BDF8 !important' 
                                                    : '#d32f2f !important', 
                                                border: passwordStatus.type === 'success' 
                                                    ? '1px solid rgba(56, 189, 248, 0.3) !important' 
                                                    : '1px solid rgba(211, 47, 47, 0.3) !important',
                                                borderRadius: '8px !important',
                                                mb: 1,
                                                fontWeight: 500
                                            }}
                                        >
                                            {passwordStatus.message}
                                        </Alert>
                                    </Grid>
                                )}

                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordForm.data.currentPassword}
                                        onChange={e => passwordForm.setData('currentPassword', e.target.value)}
                                        error={!!passwordForm.errors.currentPassword}
                                        helperText={passwordForm.errors.currentPassword}
                                        className="profile-input-field"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            edge="end"
                                                        >
                                                            {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordForm.data.newPassword}
                                        onChange={e => passwordForm.setData('newPassword', e.target.value)}
                                        error={!!passwordForm.errors.newPassword}
                                        helperText={passwordForm.errors.newPassword}
                                        className="profile-input-field"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            edge="end"
                                                        >
                                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordForm.data.newPasswordConfirmation}
                                        onChange={e => passwordForm.setData('newPasswordConfirmation', e.target.value)}
                                        error={!!passwordForm.errors.newPasswordConfirmation || arePasswordsMismatched}
                                        helperText={
                                            passwordForm.errors.newPasswordConfirmation || 
                                            (arePasswordsMismatched ? "Passwords do not match" : "")
                                        }
                                        className="profile-input-field"
                                        slotProps={{
                                            input: {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid size={9.8} />
                                <Grid size={2.2}>
                                    <Button 
                                        type="submit" 
                                        variant="contained"
                                        className="btn-primary"
                                        sx={{ textTransform: 'none' }}
                                        disabled={passwordForm.processing}
                                        fullWidth
                                    >
                                        Change
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider className="divider-dashed" />

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
                                sx={{ textTransform: 'none' }}
                            >
                                Delete Account
                            </Button>
                        </Box>
                        
                        <DeleteUserModal 
                            isOpen={isDeleteModalOpen} 
                            onClose={() => setIsDeleteModalOpen(false)} 
                        />

                    </div>
                </Container>

            </div>
        </>
    );
}