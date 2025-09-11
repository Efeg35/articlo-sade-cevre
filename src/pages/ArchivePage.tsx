import React, { useState } from "react";
import { useCredits } from "@/hooks/useCredits";
import { Capacitor } from "@capacitor/core";

// Import custom hooks
import { useArchiveData } from './ArchivePage/hooks/useArchiveData';
import { useDocumentFilters } from './ArchivePage/hooks/useDocumentFilters';
import { usePagination } from './ArchivePage/hooks/usePagination';

// Import components
import { ArchiveStats } from './ArchivePage/components/ArchiveStats';
import { DocumentFilters } from './ArchivePage/components/DocumentFilters';
import { DocumentList } from './ArchivePage/components/DocumentList';
import { DocumentModal } from './ArchivePage/components/DocumentModal';
import { DeleteConfirmModal } from './ArchivePage/components/DeleteConfirmModal';
import { Pagination } from './ArchivePage/components/Pagination';
import { DocumentModal as DashboardDocumentModal } from './Dashboard/components/DocumentModal';

// Import types
import { Document, FilterState } from './ArchivePage/types';

const ArchivePage = () => {
  const { credits } = useCredits();

  // Custom hooks for data management
  const { documents, loading, stats, getDocumentTitle, deleteDocument } = useArchiveData();
  const {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    filteredDocuments,
    activeFilterCount,
    resetFilters,
    removeFilter
  } = useDocumentFilters(documents, getDocumentTitle);

  // Pagination hook
  const {
    paginationState,
    paginatedDocuments,
    handlePageChange,
    handleItemsPerPageChange,
    resetPagination
  } = usePagination({ documents: filteredDocuments, initialItemsPerPage: 10 });

  // Modal states
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Draft document modal states
  const [draftedText, setDraftedText] = useState('');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Document selection handler
  const handleDocumentSelect = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  // Document deletion handler
  const handleDeleteRequest = (id: string) => {
    setDeleteId(id);
  };

  // Confirm delete handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const success = await deleteDocument(deleteId);
    setIsDeleting(false);

    if (success) {
      setDeleteId(null);
    }
  };

  // Cancel delete handler
  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setDeleteId(null);
    }
  };

  // Close modal handler
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  // Draft modal handlers
  const handleOpenDraftModal = (draftText: string) => {
    setDraftedText(draftText);
    setIsDraftModalOpen(true);
    setEditMode(false);
    // Archive modal'ını kapat
    setIsModalOpen(false);
  };

  const handleDraftModalClose = () => {
    setIsDraftModalOpen(false);
    setDraftedText('');
    setEditMode(false);
  };

  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleDraftedTextChange = (text: string) => {
    setDraftedText(text);
  };

  // Clear search handler for DocumentList
  const handleClearSearch = () => {
    setSearchTerm("");
    resetPagination();
  };

  // Reset pagination when filters change
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    resetPagination();
  };

  // Reset pagination when search term changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    resetPagination();
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 ${Capacitor.isNativePlatform() ? 'mobile-scroll-fix ios-scroll-container overflow-auto' : ''}`}>
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Belge Arşivim
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sadeleştirdiğiniz tüm dokümanlar burada. Kolayca erişin, görüntüleyin ve yönetin.
          </p>
        </div>

        {/* Statistics */}
        <ArchiveStats
          stats={stats}
          credits={credits}
          loading={loading}
        />

        {/* Filters */}
        <DocumentFilters
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          filters={filters}
          setFilters={handleFiltersChange}
          activeFilterCount={activeFilterCount}
          resetFilters={() => {
            resetFilters();
            resetPagination();
          }}
          removeFilter={(filterType) => {
            removeFilter(filterType);
            resetPagination();
          }}
        />

        {/* Document List */}
        <DocumentList
          documents={paginatedDocuments}
          loading={loading}
          searchTerm={searchTerm}
          onDocumentSelect={handleDocumentSelect}
          onDocumentDelete={handleDeleteRequest}
          getDocumentTitle={getDocumentTitle}
        />

        {/* Pagination */}
        {!loading && filteredDocuments.length > 0 && (
          <Pagination
            currentPage={paginationState.currentPage}
            totalPages={paginationState.totalPages}
            totalItems={paginationState.totalItems}
            itemsPerPage={paginationState.itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* Document Detail Modal */}
        <DocumentModal
          document={selectedDocument}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onOpenDraftModal={handleOpenDraftModal}
        />

        {/* Draft Document Modal (Dashboard style) */}
        <DashboardDocumentModal
          isOpen={isDraftModalOpen}
          onClose={handleDraftModalClose}
          draftedText={draftedText}
          onDraftedTextChange={handleDraftedTextChange}
          editMode={editMode}
          onToggleEditMode={handleToggleEditMode}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={!!deleteId}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </main>
    </div>
  );
};

export default ArchivePage;