-- Add drafted_document column to documents table for storing AI-generated documents
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS drafted_document TEXT;

-- Add index for faster queries on documents with drafted content
CREATE INDEX IF NOT EXISTS idx_documents_drafted_document_not_null 
ON public.documents (user_id, created_at DESC) 
WHERE drafted_document IS NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.documents.drafted_document IS 'AI-generated personalized legal document content';