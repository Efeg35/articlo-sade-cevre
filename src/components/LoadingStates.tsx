import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Generic Page Loader with modern design
export const PageLoader = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
            {/* Animated logo/icon */}
            <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-primary/30 animate-bounce" />
                </div>
                <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-2 border-primary/30 animate-spin"
                    style={{ borderTopColor: 'transparent' }} />
            </div>

            <h2 className="text-xl font-semibold mb-2 animate-fade-in">Sayfa Yükleniyor</h2>
            <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
                Lütfen bekleyiniz...
            </p>

            {/* Progress indicator */}
            <div className="w-full bg-secondary rounded-full h-1 mt-6 overflow-hidden">
                <div className="bg-primary h-1 rounded-full animate-loading-bar" />
            </div>
        </div>
    </div>
);

// Blog List Skeleton
export const BlogListSkeleton = () => (
    <div className="space-y-6">
        {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-3/4 mb-3" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

// Blog Post Skeleton
export const BlogPostSkeleton = () => (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <Skeleton className="h-4 w-64 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    </div>
);

// Dashboard Skeleton
export const DashboardSkeleton = () => (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>

        {/* Main Content Area */}
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// Archive/Document List Skeleton
export const DocumentListSkeleton = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
            <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>

        {[...Array(8)].map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// Form Skeleton
export const FormSkeleton = () => (
    <Card>
        <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>
        </CardContent>
    </Card>
);

// Template List Skeleton
export const TemplateListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
                <div className="aspect-video">
                    <Skeleton className="h-full w-full" />
                </div>
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex justify-between items-center pt-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// Generic Card Skeleton
interface CardSkeletonProps {
    count?: number;
    className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
    count = 3,
    className
}) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(count)].map((_, index) => (
            <Card key={index}>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

// Text Content Skeleton
export const TextSkeleton = () => (
    <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
    </div>
);