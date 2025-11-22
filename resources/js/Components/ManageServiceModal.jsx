import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    Typography, 
    IconButton,
    MenuItem,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '@/Contexts/SnackbarContext';

const SERVICE_TYPES = [
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Lifestyle', label: 'Lifestyle' },
    { value: 'Education', label: 'Education' },
    { value: 'Utility', label: 'Utility' },
];

export default function ManageServiceModal({ open, onClose, company, service = null }) {
    const { showSnackbar } = useSnackbar();
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        type: 'Entertainment',
        description: '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (service) {
                setData({
                    name: service.name || '',
                    type: service.type || 'Entertainment',
                    description: service.description || '',
                });
            } else {
                reset();
                setData(prev => ({ ...prev, type: 'Entertainment' }));
            }
        }
    }, [open, service]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (service) {
            post(route('iceman.services.update', service.id), {
                onSuccess: () => {
                    showSnackbar('Service updated successfully!');
                    onClose();
                },
            });
        } else {
            post(route('iceman.services.store', company.id), {
                onSuccess: () => {
                    showSnackbar('Service created successfully!');
                    onClose();
                    reset();
                },
            });
        }
    };

    const inputStyles = {
        color: '#F1F5F9',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38BDF8' },
        '& .MuiSvgIcon-root': { color: '#94A3B8' } // For Select arrow
    };

    const labelStyles = { color: '#94A3B8' };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        bgcolor: '#1E293B',
                        color: '#F1F5F9',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                    }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {service ? 'Edit Service' : 'Add New Service'}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#94A3B8' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        
                        <Box sx={{ p: 2, bgcolor: '#0F172A', borderRadius: 2, border: '1px solid #334155' }}>
                            <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 0.5 }}>
                                COMPANY
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {company?.logo_url && (
                                    <img 
                                        src={company.logo_url} 
                                        alt="" 
                                        style={{ width: 24, height: 24, borderRadius: 4 }} 
                                    />
                                )}
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                                    {company?.name}
                                </Typography>
                            </Box>
                        </Box>

                        <TextField
                            label="Service Name"
                            variant="outlined"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            slotProps={{
                                inputLabel: {
                                    sx: labelStyles,
                                },
                                input: {
                                    sx: inputStyles,
                                }
                            }}
                        />

                        <TextField
                            select
                            label="Service Type"
                            variant="outlined"
                            fullWidth
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            error={!!errors.type}
                            helperText={errors.type}
                            slotProps={{
                                inputLabel: {
                                    sx: labelStyles,
                                },
                                input: {
                                    sx: inputStyles,
                                }
                            }}
                        >
                            {SERVICE_TYPES.map((option) => (
                                <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                    sx={{ 
                                        bgcolor: '#1E293B', 
                                        color: '#F1F5F9',
                                        '&:hover': { bgcolor: '#334155' },
                                        '&.Mui-selected': { bgcolor: '#38BDF8 !important', color: '#0F172A' }
                                    }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            error={!!errors.description}
                            helperText={errors.description}
                            slotProps={{
                                inputLabel: {
                                    sx: labelStyles,
                                },
                                input: {
                                    sx: inputStyles,
                                }
                            }}
                        />
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={onClose} sx={{ color: '#94A3B8', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={processing}
                        sx={{
                            bgcolor: '#38BDF8',
                            color: '#0F172A',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            '&:hover': { bgcolor: '#0EA5E9' },
                            minWidth: 120
                        }}
                    >
                        {processing ? <CircularProgress size={24} color="inherit" /> : (service ? 'Save Changes' : 'Create Service')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}