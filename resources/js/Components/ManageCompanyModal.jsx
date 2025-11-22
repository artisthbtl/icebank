import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    Avatar,
    Typography,
    IconButton,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useSnackbar } from '@/Contexts/SnackbarContext';

export default function ManageCompanyModal({ open, onClose, company = null }) {
    const { showSnackbar } = useSnackbar();
    const [preview, setPreview] = useState(null);
    
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        logo: null,
    });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (company) {
                setData({
                    name: company.name || '',
                    logo: null,
                });
                setPreview(company.logo_url); 
            } else {
                reset();
                setPreview(null);
            }
        }
    }, [open, company]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showSnackbar('The file must be an image (PNG, JPG, etc).', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showSnackbar('File size must be less than 2MB.', 'error');
            return;
        }

        setData('logo', file);
        setPreview(URL.createObjectURL(file));
        
        if (errors.logo) clearErrors('logo'); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (company) {
            post(route('iceman.companies.update', company.id), {
                onSuccess: () => {
                    showSnackbar('Company updated successfully!');
                    onClose();
                },
                forceFormData: true,
            });
        } else {
            post(route('iceman.companies.store'), {
                onSuccess: () => {
                    showSnackbar('Company created successfully!');
                    onClose();
                    reset();
                },
                forceFormData: true,
            });
        }
    };

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
                    },
                    backgroundImage: 'none'
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {company ? 'Edit Company' : 'Add New Company'}
                </Typography>
                <IconButton onClick={onClose} sx={{ color: '#94A3B8' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar 
                                    src={preview} 
                                    variant="rounded"
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        bgcolor: '#0F172A',
                                        border: '2px dashed #475569',
                                        fontSize: '2rem',
                                        color: '#94A3B8'
                                    }}
                                >
                                    {!preview && (data.name ? data.name.charAt(0).toUpperCase() : '+')}
                                </Avatar>
                                
                                <label htmlFor="logo-upload">
                                    <input
                                        accept="image/*"
                                        id="logo-upload"
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                    />
                                    <IconButton 
                                        color="primary" 
                                        aria-label="upload picture" 
                                        component="span"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -10,
                                            right: -10,
                                            bgcolor: '#38BDF8',
                                            color: '#0F172A',
                                            '&:hover': { bgcolor: '#0EA5E9' },
                                            width: 32,
                                            height: 32,
                                        }}
                                    >
                                        <PhotoCamera sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </label>
                            </Box>
                            
                            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                {company ? 'Click icon to change logo' : 'Upload a company logo'}
                            </Typography>
                            
                            {errors.logo && (
                                <Typography variant="caption" color="error">
                                    {errors.logo}
                                </Typography>
                            )}
                        </Box>

                        <TextField
                            label="Company Name"
                            variant="outlined"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            slotProps={{
                                inputLabel: {
                                    sx: { color: '#94A3B8', }
                                },
                                input: {
                                    sx: {
                                        color: '#F1F5F9',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#475569' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#38BDF8' },
                                    }
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
                        {processing ? <CircularProgress size={24} color="inherit" /> : (company ? 'Save Changes' : 'Create Company')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}