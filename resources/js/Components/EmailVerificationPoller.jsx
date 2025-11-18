import React, { useEffect, useRef, useState } from 'react'; // Import useRef and useState
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Typography, Box, CircularProgress } from '@mui/material';

const checkStatus = async (pollToken) => {
    const { data } = await axios.get(`/api/auth/check-verification/${pollToken}`);
    return data;
};

export default function EmailVerificationPoller({ pollToken, onVerified }) {
    
    const onVerifiedCalled = useRef(false);
    
    const [isPolling, setIsPolling] = useState(true);

    const { data } = useQuery({
        queryKey: ['verificationStatus', pollToken],
        queryFn: () => checkStatus(pollToken),
        
        enabled: isPolling,
        
        refetchInterval: 10000, 
        
        refetchOnWindowFocus: false,
        retry: true, 
    });

    useEffect(() => {
        if (data?.verified === true && !onVerifiedCalled.current) {
            onVerifiedCalled.current = true; 
            setIsPolling(false); 
            onVerified();
        }
    }, [data, onVerified]);

    return (
        <>
            <Typography component="h1" variant="h4" className="login-title">
                Check Your Email
            </Typography>
            <Typography variant="subtitle1" className="login-subtitle">
                We've sent a verification link to your email address. Please click the link to verify.
            </Typography>
            
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '100%',
                mt: 2,
                mb: 2,
            }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body2" className="login-subtitle">
                    Waiting for verification...
                </Typography>
            </Box>
        </>
    );
}