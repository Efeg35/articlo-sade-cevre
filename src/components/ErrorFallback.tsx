import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
    componentName?: string;
}

export const ErrorFallback = ({
    error,
    resetErrorBoundary,
    componentName = "Bilinmeyen Bileşen"
}: ErrorFallbackProps) => {
    const isDevelopment = import.meta.env.DEV;

    const handleReload = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleReportError = () => {
        // Future: Sentry error reporting
        console.error('User reported error:', { error, componentName });
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <CardTitle className="text-xl">Bir Hata Oluştu</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {componentName} bileşeninde beklenmeyen bir hata oluştu.
                            Lütfen sayfayı yenilemeyi deneyin.
                        </AlertDescription>
                    </Alert>

                    {isDevelopment && (
                        <Alert variant="destructive">
                            <Bug className="h-4 w-4" />
                            <AlertDescription className="font-mono text-xs">
                                {error.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-2">
                        <Button onClick={resetErrorBoundary} className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Tekrar Dene
                        </Button>

                        <Button onClick={handleReload} variant="outline" className="w-full">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Sayfayı Yenile
                        </Button>

                        <Button onClick={handleGoHome} variant="ghost" className="w-full">
                            <Home className="w-4 h-4 mr-2" />
                            Ana Sayfaya Dön
                        </Button>

                        <Button
                            onClick={handleReportError}
                            variant="ghost"
                            size="sm"
                            className="w-full text-muted-foreground"
                        >
                            <Bug className="w-4 h-4 mr-2" />
                            Hatayı Bildir
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorFallback;