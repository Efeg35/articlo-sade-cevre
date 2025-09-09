import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkStatusIndicatorProps {
    className?: string;
    showWhenOnline?: boolean;
}

export const NetworkStatusIndicator = ({
    className,
    showWhenOnline = false
}: NetworkStatusIndicatorProps) => {
    const { isOnline, isSlowConnection, connectionType } = useNetworkStatus();

    if (isOnline && !showWhenOnline && !isSlowConnection) {
        return null;
    }

    return (
        <div className={cn("fixed top-20 left-4 right-4 z-50", className)}>
            {!isOnline && (
                <Alert variant="destructive" className="border-red-500 bg-red-50">
                    <WifiOff className="h-4 w-4" />
                    <AlertDescription>
                        İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.
                    </AlertDescription>
                </Alert>
            )}

            {isOnline && isSlowConnection && (
                <Alert variant="default" className="border-yellow-500 bg-yellow-50">
                    <Signal className="h-4 w-4" />
                    <AlertDescription>
                        Yavaş internet bağlantısı tespit edildi ({connectionType}).
                        İşlemler normalden uzun sürebilir.
                    </AlertDescription>
                </Alert>
            )}

            {isOnline && showWhenOnline && !isSlowConnection && (
                <Alert variant="default" className="border-green-500 bg-green-50">
                    <Wifi className="h-4 w-4" />
                    <AlertDescription>
                        İnternet bağlantısı aktif ({connectionType})
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default NetworkStatusIndicator;