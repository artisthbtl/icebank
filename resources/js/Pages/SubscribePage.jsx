import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
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
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IceCubeIcon from '@/Components/IceCubeIcon';
import Navbar from "@/Components/Navbar";
import SubscribeModal from '@/Components/SubscribeModal';
import ReactivateSubscriptionModal from '@/Components/ReactivateSubscriptionModal';
import { debounce } from 'lodash';
import '../../css/SubscribePage.css';
import '../../css/DashboardPage.css';

const ServiceItem = ({ service, onSelectPlan }) => {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className="service-list-item"> 
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
                            service.plans.map((plan) => {
                                const isCancelled = plan.subscriptions && 
                                                    plan.subscriptions.length > 0 && 
                                                    plan.subscriptions[0].status === 'canceled';
                                
                                return (
                                    <div key={plan.id} className="plan-card" onClick={() => onSelectPlan({...plan, service, isCancelled})}>
                                        <div className="plan-info">
                                            <Typography className="plan-name" sx={{ lineHeight: 1.2 }}>
                                                {plan.name}
                                            </Typography>
                                            
                                            {isCancelled && (
                                                <span style={{
                                                    color: '#FBBF24', 
                                                    fontSize: '0.75rem', 
                                                    fontWeight: 'bold',
                                                    display: 'inline-block',
                                                    marginTop: '2px',
                                                    marginBottom: '2px'
                                                }}>
                                                    ● Restorable
                                                </span>
                                            )}

                                            <Typography className="plan-duration">{plan.duration} Days</Typography>
                                        </div>
                                        <div className="plan-price-wrapper">
                                            <IceCubeIcon width={16} height={16} color="#38BDF8" />
                                            <Typography className="plan-price">{plan.price}</Typography>
                                        </div>
                                    </div>
                                );
                            })
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
    const [nextUrl, setNextUrl] = useState(services.links.next);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
    const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);
    
    useEffect(() => {
        setAllServices(services.data);
        setNextUrl(services.links.next);
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

    const handleLoadMore = async () => {
        if (!nextUrl || loadingMore) return;

        setLoadingMore(true);
        try {
            const response = await axios.get(nextUrl, {
                headers: { 'X-Inertia': 'true' }
            });
            
            const newServicesData = response.data.props?.services;
            
            if (newServicesData) {
                setAllServices(prev => [...prev, ...newServicesData.data]);
                setNextUrl(newServicesData.links.next);
            }
        } catch (error) {
            console.error("Failed to load more services", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handlePlanClick = (plan) => {
        setSelectedPlan(plan);
        if (plan.isCancelled) {
            setIsReactivateModalOpen(true);
        } else {
            setIsSubscribeModalOpen(true);
        }
    };

    return (
        <>
            <Head title="Subscribe" />
            <Navbar />
            <div className="dashboard-page-wrapper"> 
                <Container maxWidth="md" className="subscribe-content-container">
                    <Box className="subscribe-header-section">
                        <Typography variant="h4" className="page-title">
                            Subscribe
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
                            <div className="services-container-card">
                                {allServices.map((service) => (
                                    <ServiceItem 
                                        key={service.id} 
                                        service={service} 
                                        onSelectPlan={handlePlanClick} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8, color: '#64748B' }}>
                                <Typography variant="h6">No services found.</Typography>
                            </Box>
                        )}
                    </div>

                    {nextUrl && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                            <Button 
                                onClick={handleLoadMore} 
                                variant="outlined" 
                                className="load-more-btn"
                                disabled={loadingMore}
                            >
                                {loadingMore ? <CircularProgress size={24} color="inherit" /> : 'Load More'}
                            </Button>
                        </Box>
                    )}

                </Container>

                <SubscribeModal 
                    open={isSubscribeModalOpen}
                    onClose={() => setIsSubscribeModalOpen(false)}
                    plan={selectedPlan}
                />

                <ReactivateSubscriptionModal 
                    open={isReactivateModalOpen}
                    onClose={() => setIsReactivateModalOpen(false)}
                    plan={selectedPlan}
                />
            </div>
        </>
    );
}