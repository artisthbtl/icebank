import React, { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { SnackbarProvider } from '@/Contexts/SnackbarContext';

const LayoutContent = ({ children }) => {
    const { auth, url } = usePage().props;

    useEffect(() => {
        if (auth.user && auth.user.hasPin === false) {
            if (url !== '/create-pin') {
                router.visit(route('pin.create'));
            }
        }
    }, [auth.user, url]);

    return (
        <main>
            {children}
        </main>
    );
};

export default function AuthenticatedLayout({ children }) {
    return (
        <SnackbarProvider>
            <LayoutContent>{children}</LayoutContent>
        </SnackbarProvider>
    );
}