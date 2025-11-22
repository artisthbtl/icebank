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
    InputAdornment,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import IceCubeIcon from '@/Components/IceCubeIcon';
import { useSnackbar } from '@/Contexts/SnackbarContext';

export default function ManagePlanModal({ open, onClose, service, plan = null }) {
    const { showSnackbar } = useSnackbar();
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        duration: '',
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (plan) {
                setData({
                    name: plan.name || '',
                    price: plan.price || '',
                    duration: plan.duration || '',
                });
            } else {
                reset();
                setData({
                    name: '',
                    price: '',
                    duration: '',
                });
            }
        }
    }, [open, plan, service]);

    const handlePriceChange = (e) => {
        let value = e.target.value;
        if (value < 0) value = 0;
        if (value > 100000) value = 100000;
        
        setData('price', value);
    };

    const handleDurationChange = (e) => {
        let value = e.target.value;
        if (value < 0) value = 0;
        if (value > 1825) value = 1825; 
        
        setData('duration', value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanData = {
            ...data,
            name: data.name.trim(),
        };

        data.name = cleanData.name;

        const options = {
            onSuccess: () => {
                showSnackbar(plan ? 'Plan updated successfully!' : 'Plan created successfully!');
                onClose();
                if (!plan) reset();
            },
        };

        if (plan) {
            post(route('iceman.plans.update', plan.id), options);
        } else {
            post(route('iceman.plans.store', service.id), options);
        }
    };

    const inputStyles = {
        color: '#F1F5F9',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38BDF8' },
        '& .MuiSvgIcon-root': { color: '#94A3B8' },
        '& .MuiInputAdornment-root p': { color: '#94A3B8' }
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
                    {plan ? 'Edit Plan' : 'Add New Plan'}
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
                                SERVICE
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
                                {service?.name}
                            </Typography>
                        </Box>

                        <TextField
                            label="Plan Name"
                            placeholder="e.g. Premium Monthly"
                            variant="outlined"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            slotProps={{
                                inputLabel: { sx: labelStyles },
                                input: { sx: inputStyles }
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Price (Ices)"
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={data.price}
                                onChange={handlePriceChange}
                                error={!!errors.price}
                                helperText={errors.price || 'Max 100,000 Ice'}
                                slotProps={{
                                    inputLabel: { sx: labelStyles },
                                    input: { 
                                        sx: inputStyles,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <IceCubeIcon sx={{ width: 20, height: 20 }} />
                                            </InputAdornment>
                                        ),
                                    },
                                    formHelperText: {
                                        sx: {
                                            color: !!errors.price ? '#EF4444' : '#94A3B8', 
                                        }
                                    }
                                }}
                            />

                            <TextField
                                label="Duration (Days)"
                                variant="outlined"
                                fullWidth
                                type="number"
                                value={data.duration}
                                onChange={handleDurationChange}
                                error={!!errors.duration}
                                helperText={errors.duration}
                                slotProps={{
                                    inputLabel: { sx: labelStyles },
                                    input: { 
                                        sx: inputStyles,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccessTimeIcon fontSize="small" sx={{ color: '#94A3B8' }} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                        </Box>
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
                        {processing ? <CircularProgress size={24} color="inherit" /> : (plan ? 'Save Changes' : 'Create Plan')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}