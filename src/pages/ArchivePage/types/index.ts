// Type definitions for ArchivePage components

export interface Entity {
    tip: string;
    değer: string;
    rol?: string;
    açıklama?: string;
}

export interface Document {
    id: string;
    user_id: string;
    original_text: string;
    simplified_text: string;
    created_at: string;
    summary?: string | null;
    action_plan?: string | null;
    entities?: Entity[] | null;
    drafted_document?: string | null; // ✅ AI-generated personalized document
    // Dashboard-style structured data (new analysis format)
    actionable_steps?: Array<{
        description: string;
        actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
    }> | null;
    extracted_entities?: Array<{
        entity: string;
        value: string | number;
    }> | null;
    risk_items?: Array<{
        riskType: string;
        description: string;
        severity: 'high' | 'medium' | 'low';
        legalReference?: string;
        recommendation?: string;
    }> | null;
}

export interface FilterState {
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    hasSummary: boolean;
    hasActionPlan: boolean;
    sortBy: "date-desc" | "date-asc";
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface ArchiveStats {
    thisMonth: number;
    timeSaved: number;
    creditsUsed: number;
    totalDocs: number;
}

export interface ArchiveState {
    documents: Document[];
    filteredDocuments: Document[];
    loading: boolean;
    searchTerm: string;
    filters: FilterState;
    stats: ArchiveStats;
}

export interface DocumentActionsState {
    selectedDocument: Document | null;
    isModalOpen: boolean;
    deleteId: string | null;
    isDeleting: boolean;
}

// Utility types for components
export interface StatsCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    badge?: string;
}

export interface DocumentListItemProps {
    document: Document;
    onSelect: (doc: Document) => void;
    onDelete: (id: string) => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}