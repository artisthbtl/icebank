import React, { useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ children }) {
    const { auth, url } = usePage().props;

    useEffect(() => {
        if (auth.user && auth.user.hasPin === false) {
            if (url !== '/create-pin') {
                router.visit('/create-pin');
            }
        }
    }, [auth.user, url]);

    return (
        <main>
            {children}
        </main>
    );
}