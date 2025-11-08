import { Modal, Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Link } from '@inertiajs/react';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: 'center',
};

export default function StatusModal({ open, onClose, status, message, redirectLink }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="status-modal-title"
            aria-describedby="status-modal-description"
        >
            <Paper sx={style}> {/* This line will now work */}
                {status === 'success' ? (
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                ) : (
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
                )}
                
                <Typography id="status-modal-title" variant="h6" component="h2" sx={{ textTransform: 'capitalize' }}>
                    {status}
                </Typography>
                
                <Typography id="status-modal-description" sx={{ mt: 2, mb: 3 }}>
                    {message}
                </Typography>

                {redirectLink && (
                    <Button
                        component={Link}
                        href={redirectLink}
                        variant="contained"
                        fullWidth
                        onClick={onClose}
                    >
                        Go to Login
                    </Button>
                )}

                {!redirectLink && (
                     <Button
                        variant="contained"
                        fullWidth
                        onClick={onClose}
                    >
                        Close
                    </Button>
                )}
            </Paper>
        </Modal>
    );
}