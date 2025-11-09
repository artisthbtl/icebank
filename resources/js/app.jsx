import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthenticatedLayout from './Layouts/AuthenticatedLayout';

const queryClient = new QueryClient();
const appName = 'Icebank';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`, 
            import.meta.glob('./Pages/**/*.jsx')
        );

        const publicPages = [
            'LandingPage',
            'LoginPage',
            'RegisterPage',
            'CreatePinPage'
        ];

        if (!publicPages.includes(name)) {
            page.default.layout = pageComponent => <AuthenticatedLayout children={pageComponent} />;
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
            </QueryClientProvider>
        );
    },
    progress: {
        delay: 250,
        color: '#29d',
        includeCSS: true,
        showSpinner: false,
    },
});