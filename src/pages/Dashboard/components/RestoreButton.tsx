import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RestoreButtonProps {
    criticalError: string | null;
    isRecovering: boolean;
    onErrorRecovery: () => void;
    onPageReload: () => void;
}

export const RestoreButton: React.FC<RestoreButtonProps> = ({
    criticalError,
    isRecovering,
    onErrorRecovery,
    onPageReload
}) => {
    if (!criticalError) return null;

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Dashboard Yüklenemedi</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-destructive">{criticalError}</p>
                    <div className="flex gap-2">
                        <Button onClick={onErrorRecovery} disabled={isRecovering}>
                            {isRecovering ? 'Kurtarılıyor...' : 'Kurtarmayı Dene'}
                        </Button>
                        <Button onClick={onPageReload} variant="outline">
                            Sayfayı Yenile
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};