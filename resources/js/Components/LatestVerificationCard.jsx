import { useState } from 'react';
import { Box, Typography, Button, Chip, Dialog } from '@mui/material';
import '../../css/DashboardPage.css';

export default function LatestVerificationCard({ verification }) {
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');

    if (!verification) return null;

    const isRejected = verification.status === 'rejected';

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'warning';
        }
    };

    const handleViewImage = (imagePath, title) => {
        setSelectedImage(imagePath);
        setSelectedTitle(title);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => setSelectedImage(''), 150); 
    };

    return (
        <Box className="dashboard-recent-txn-container">
            <Typography variant="h6" className="dashboard-section-title">
                Latest Verification
            </Typography>

            <Box className="verification-content">
                <Box className="verification-grid" sx={{ mb: 3 }}> 
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        className="verification-doc-btn"
                        onClick={() => handleViewImage(verification.ktpImagePath, 'KTP Image')}
                    >
                        View KTP Image
                    </Button>
                    <Button 
                        fullWidth 
                        variant="outlined" 
                        className="verification-doc-btn"
                        onClick={() => handleViewImage(verification.selfieImagePath, 'Selfie Image')}
                    >
                        View Selfie Image
                    </Button>
                </Box>

                <Box className="verification-grid">
                    <Box>
                        <Typography className="verification-label">Submitted at</Typography>
                        <Typography className="verification-value">
                            {formatDate(verification.createdAt)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography className="verification-label">Status</Typography>
                        <Chip 
                            label={verification.status.toUpperCase()} 
                            color={getStatusColor(verification.status)}
                            size="small"
                            className="verification-chip"
                        />
                    </Box>

                    {isRejected && (
                        <>
                            <Box>
                                <Typography className="verification-label">Reviewed at</Typography>
                                <Typography className="verification-value">
                                    {formatDate(verification.updatedAt)}
                                </Typography>
                            </Box>
                            
                            <Box> 
                                <Typography className="verification-label">Rejection Reason</Typography>
                                <Typography className="verification-value rejection-text">
                                    {verification.rejectionReason || "No reason provided."}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>

            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="md"
                fullWidth={false}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            backgroundImage: 'none',
                            overflow: 'hidden',
                            maxWidth: '800px',
                            m: 2
                        }
                    }
                }}
            >
                {selectedImage && (
                    <img 
                        src={selectedImage} 
                        alt={selectedTitle} 
                        onClick={handleClose}
                        style={{ 
                            width: '100%',
                            height: 'auto',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            display: 'block',
                            cursor: 'pointer'
                        }} 
                    />
                )}
            </Dialog>
        </Box>
    );
}