import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Document } from '../types';

interface DocumentListProps {
    documents: Document[];
    loading: boolean;
    searchTerm: string;
    onDocumentSelect: (doc: Document) => void;
    onDocumentDelete: (id: string) => void;
    getDocumentTitle: (doc: Document) => string;
}

// Skeleton component for loading state
const DocumentSkeleton = () => (
    <Card className="border shadow-sm">
        <CardContent className="p-6">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
    </Card>
);

export const DocumentList: React.FC<DocumentListProps> = ({
    documents,
    loading,
    searchTerm,
    onDocumentSelect,
    onDocumentDelete,
    getDocumentTitle
}) => {
    if (loading) {
        return (
            <div className="grid gap-4">
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
                <DocumentSkeleton />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <div className="text-muted-foreground">
                        {searchTerm ? "Arama kriterlerine uygun belge bulunamadı." : "Henüz sadeleştirilmiş bir belgeniz bulunmuyor."}
                    </div>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                // Bu fonksiyon parent component'ten gelecek
                                // searchTerm'i temizlemek için
                            }}
                        >
                            Tüm Belgeleri Göster
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {documents.map((doc) => (
                <div
                    key={doc.id}
                    className="relative cursor-pointer group"
                    onClick={(e) => {
                        if ((e.target as HTMLElement).closest('.delete-btn')) return;
                        onDocumentSelect(doc);
                    }}
                >
                    <button
                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition delete-btn bg-background rounded-full p-1 shadow hover:bg-destructive/10"
                        title="Belgeyi Sil"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDocumentDelete(doc.id);
                        }}
                    >
                        <Trash2 className="w-5 h-5 text-destructive" />
                    </button>
                    <Card className={`border shadow-sm hover:shadow-md hover:border-primary/40 transition duration-300 ${doc.drafted_document ? 'border-blue-200 bg-blue-50/30' : ''}`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-base text-foreground font-semibold flex-1">
                                    {getDocumentTitle(doc)}
                                </div>
                                {doc.drafted_document && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 text-xs ml-2 shrink-0">
                                        <FileText className="h-3 w-3 mr-1" />
                                        Belge Oluşturuldu
                                    </Badge>
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {doc.created_at && new Date(doc.created_at).toLocaleDateString("tr-TR", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};