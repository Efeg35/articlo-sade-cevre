import { useState, useEffect } from 'react';
import { Logger } from '@/utils/logger';

interface NetworkStatus {
    isOnline: boolean;
    isSlowConnection: boolean;
    connectionType: string;
}

export const useNetworkStatus = () => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isOnline: navigator.onLine,
        isSlowConnection: false,
        connectionType: 'unknown'
    });

    useEffect(() => {
        const updateNetworkStatus = () => {
            const isOnline = navigator.onLine;

            // Check connection type if available
            const connection = (navigator as any).connection ||
                (navigator as any).mozConnection ||
                (navigator as any).webkitConnection;

            let connectionType = 'unknown';
            let isSlowConnection = false;

            if (connection) {
                connectionType = connection.effectiveType || connection.type || 'unknown';
                // Consider 2g and slow-2g as slow connections
                isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType);
            }

            setNetworkStatus({
                isOnline,
                isSlowConnection,
                connectionType
            });

            Logger.log('NetworkStatus', 'Network status updated', {
                isOnline,
                isSlowConnection,
                connectionType
            });
        };

        // Initial check
        updateNetworkStatus();

        // Listen for online/offline events
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Listen for connection changes if available
        const connection = (navigator as any).connection ||
            (navigator as any).mozConnection ||
            (navigator as any).webkitConnection;

        if (connection) {
            connection.addEventListener('change', updateNetworkStatus);
        }

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);

            if (connection) {
                connection.removeEventListener('change', updateNetworkStatus);
            }
        };
    }, []);

    return networkStatus;
};