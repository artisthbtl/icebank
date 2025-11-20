import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    MenuItem, 
    Select, 
    FormControl, 
    Button,
    Collapse,
    Avatar,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IceCubeIcon from '@/Components/IceCubeIcon';
import Navbar from "@/Components/Navbar";
import SubscribeModal from '@/Components/SubscribeModal';
import { debounce } from 'lodash';
import '../../css/SubscribePage.css';
import '../../css/DashboardPage.css';

const ServiceItem = ({ service, onSelectPlan }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="service-card">
            <div className="service-header" onClick={() => setExpanded(!expanded)}>
                <div className="service-info-left">
                    <Avatar 
                        src={service.company?.logo_path ? `/storage/${service.company.logo_path}` : undefined} 
                        alt={service.company?.name}
                        className="company-logo"
                        variant="rounded"
                    >
                        {service.company?.name?.charAt(0)}
                    </Avatar>
                    
                    <div className="service-text">
                        <Typography variant="h6" className="service-name">
                            {service.name}
                        </Typography>
                        <Typography variant="body2" className="company-name">
                            {service.company?.name} • <span className="service-type-tag">{service.type}</span>
                        </Typography>
                    </div>
                </div>

                <IconButton 
                    className={`expand-btn ${expanded ? 'expanded' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                    {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div className="service-details">
                    <Typography variant="body2" className="service-description">
                        {service.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" className="plans-header">
                        Available Plans
                    </Typography>
                    
                    <div className="plans-grid">
                        {service.plans?.length > 0 ? (
                            service.plans.map((plan) => (
                                <div key={plan.id} className="plan-card" onClick={() => onSelectPlan({...plan, service})}>
                                    <div className="plan-info">
                                        <Typography className="plan-name">{plan.name}</Typography>
                                        <Typography className="plan-duration">{plan.duration} Days</Typography>
                                    </div>
                                    <div className="plan-price-wrapper">
                                        <IceCubeIcon width={16} height={16} color="#38BDF8" />
                                        <Typography className="plan-price">{plan.price}</Typography>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                                No plans available.
                            </Typography>
                        )}
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default function SubscribePage() {
    const { services, filters, types } = usePage().props;
    
    const [allServices, setAllServices] = useState(services.data);
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (services.meta.current_page === 1) {
            setAllServices(services.data);
        } else {
            setAllServices(prev => {
                const newIds = new Set(services.data.map(s => s.id));
                const existing = prev.filter(s => !newIds.has(s.id));
                return [...existing, ...services.data];
            });
        }
    }, [services]);

    const debouncedSearch = useCallback(
        debounce((query, filterType) => {
            router.get(route('subscribe.index'), 
                { search: query, type: filterType }, 
                { preserveState: true, replace: true }
            );
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value, type);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
        router.get(route('subscribe.index'), 
            { search: search, type: e.target.value }, 
            { preserveState: true }
        );
    };

    const handleLoadMore = () => {
        if (services.links.next) {
            router.visit(services.links.next, {
                preserveState: true,
                preserveScroll: true,
                only: ['services']
            });
        }
    };

    const handlePlanClick = (plan) => {
        setSelectedPlan(plan);
        setIsModalOpen(true);
    };

    return (
        <>
            <Head title="Subscribe" />
            <div className="dashboard-page-wrapper">
                <Navbar />
                
                <Container maxWidth="md" className="subscribe-content-container">
                    
                    <Box className="subscribe-header-section">
                        <Typography variant="h4" className="page-title">
                            Marketplace
                        </Typography>
                        <Typography variant="body1" className="page-subtitle">
                            Discover services and subscribe to premium plans.
                        </Typography>
                    </Box>

                    <Box className="search-filter-bar">
                        <div className="search-input-wrapper">
                            <SearchIcon className="search-icon" />
                            <TextField 
                                placeholder="Search companies..." 
                                variant="standard"
                                InputProps={{ disableUnderline: true }}
                                className="search-input"
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        
                        <FormControl variant="standard" className="type-filter">
                            <Select
                                value={type}
                                onChange={handleTypeChange}
                                disableUnderline
                                displayEmpty
                                className="type-select"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: '#1E293B',
                                            color: '#E2E8F0',
                                            '& .MuiMenuItem-root:hover': { backgroundColor: '#334155' },
                                            '& .Mui-selected': { backgroundColor: '#38BDF8 !important', color: '#0F172A' }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="all">All Types</MenuItem>
                                {types.map((t) => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <div className="services-list">
                        {allServices.length > 0 ? (
                            allServices.map((service) => (
                                <ServiceItem 
                                    key={service.id} 
                                    service={service} 
                                    onSelectPlan={handlePlanClick} 
                                />
                            ))
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No services found.</Typography>
                            </Box>
                        )}
                    </div>

                    {services.links.next && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Button onClick={handleLoadMore} variant="outlined" className="load-more-btn">
                                Load More
                            </Button>
                        </Box>
                    )}

                </Container>

                <SubscribeModal 
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    plan={selectedPlan}
                    onSuccess={(name) => setSuccessMessage(`Subscribed to ${name}!`)}
                />

                <Snackbar
                    open={!!successMessage}
                    autoHideDuration={6000}
                    onClose={() => setSuccessMessage('')}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
                        {successMessage}
                    </Alert>
                </Snackbar>
            </div>
        </>
    );
}