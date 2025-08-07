import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    componentName?: string; // Hata oluşan component adı
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Hata detaylarını state'e kaydet
        this.setState({ errorInfo });
        // Kapsamlı loglama
        console.error(
            `[ErrorBoundary] Hata yakalandı${this.props.componentName ? ` (Component: ${this.props.componentName})` : ''}:`,
            error,
            errorInfo
        );

        // Log error to external service (Sentry, etc.)
        // if (window.Sentry) {
        //   window.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            const { error, errorInfo } = this.state;
            const { componentName } = this.props;

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <CardTitle className="text-xl">Bir Hata Oluştu</CardTitle>
                            {componentName && (
                                <div className="mt-2 text-xs text-muted-foreground">Bileşen: <span className="font-semibold">{componentName}</span></div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Uygulamada beklenmedik bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.<br />
                                Sorun devam ederse destek ekibine ulaşabilirsiniz.
                            </p>

                            {error && (
                                <details className="text-xs bg-muted p-3 rounded" open>
                                    <summary className="cursor-pointer font-medium mb-2">Hata Detayları</summary>
                                    <pre className="whitespace-pre-wrap text-red-600">
                                        {error.toString()}
                                    </pre>
                                    {errorInfo && (
                                        <pre className="whitespace-pre-wrap text-muted-foreground mt-2">
                                            {errorInfo.componentStack}
                                        </pre>
                                    )}
                                </details>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={this.handleReset}
                                    className="flex-1"
                                    variant="outline"
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Yenile
                                </Button>
                                <Button
                                    onClick={this.handleGoHome}
                                    className="flex-1"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Ana Sayfa
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
