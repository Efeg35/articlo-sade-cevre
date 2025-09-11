import { useState, useMemo } from 'react';
import { Document, PaginationState } from '../types';

interface UsePaginationProps {
    documents: Document[];
    initialItemsPerPage?: number;
}

export function usePagination({ documents, initialItemsPerPage = 10 }: UsePaginationProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    // Pagination state calculations
    const paginationState: PaginationState = useMemo(() => {
        const totalItems = documents.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        return {
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages
        };
    }, [currentPage, itemsPerPage, documents.length]);

    // Get paginated documents
    const paginatedDocuments = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return documents.slice(startIndex, endIndex);
    }, [documents, currentPage, itemsPerPage]);

    // Handler functions
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= paginationState.totalPages) {
            setCurrentPage(page);
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        // Reset to first page when changing items per page
        setCurrentPage(1);
    };

    const goToFirstPage = () => handlePageChange(1);
    const goToLastPage = () => handlePageChange(paginationState.totalPages);
    const goToPreviousPage = () => handlePageChange(currentPage - 1);
    const goToNextPage = () => handlePageChange(currentPage + 1);

    // Reset pagination when documents change (e.g., after filtering)
    const resetPagination = () => {
        setCurrentPage(1);
    };

    return {
        paginationState,
        paginatedDocuments,
        handlePageChange,
        handleItemsPerPageChange,
        goToFirstPage,
        goToLastPage,
        goToPreviousPage,
        goToNextPage,
        resetPagination,
        // Convenience getters
        hasNextPage: currentPage < paginationState.totalPages,
        hasPreviousPage: currentPage > 1,
        isFirstPage: currentPage === 1,
        isLastPage: currentPage === paginationState.totalPages
    };
}