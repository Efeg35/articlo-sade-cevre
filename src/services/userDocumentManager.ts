/**
 * 🎯 User Document Management System
 * 
 * LawDepot-level document lifecycle management:
 * - Document creation, saving, loading
 * - Session persistence and recovery
 * - Version tracking and history
 * - Template-based document generation
 */

import { supabase } from '../integrations/supabase/client';
import type {
    DynamicTemplate,
    DynamicQuestion,
    UserAnswer,
    DynamicWizardState,
    DocumentGenerationContext,
    WizardAnalytics
} from '../types/wizard/WizardTypes';

export interface UserDocument {
    document_id: string;
    user_id: string;
    template_id: string;
    document_title: string;
    document_status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
    completion_percentage: number;
    questions_answered: number;
    total_questions: number;
    generated_content?: string;
    output_format: 'PDF' | 'DOCX' | 'HTML';
    file_path?: string;
    styling_options: Record<string, unknown>;
    export_settings: Record<string, unknown>;
    started_at: string;
    completed_at?: string;
    last_modified_at: string;
    document_version: number;
}

export interface WizardSession {
    session_id: string;
    document_id: string;
    user_id: string;
    current_step: number;
    visible_questions: string[];
    completed_questions: string[];
    required_questions: string[];
    session_data: Record<string, unknown>;
    last_activity_at: string;
    expires_at: string;
    total_time_spent: number;
    questions_answered: number;
    back_navigation_count: number;
}

export class UserDocumentManager {
    private userId?: string;

    constructor(userId?: string) {
        this.userId = userId;
    }

    /**
     * Creates a new document from a template
     */
    async createDocument(
        templateId: string,
        documentTitle?: string,
        options: {
            outputFormat?: 'PDF' | 'DOCX' | 'HTML';
            stylingOptions?: Record<string, unknown>;
            exportSettings?: Record<string, unknown>;
        } = {}
    ): Promise<UserDocument> {
        if (!this.userId) {
            throw new Error('User ID required for document creation');
        }

        // Get template info - using any until migration is deployed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: template, error: templateError } = await (supabase as any)
            .from('dynamic_templates')
            .select('template_name, initial_questions')
            .eq('template_id', templateId)
            .single();

        if (templateError) {
            throw new Error(`Template not found: ${templateError.message}`);
        }

        // Generate document title if not provided
        const title = documentTitle || `${template.template_name} - ${new Date().toLocaleDateString('tr-TR')}`;

        // Create document record - using any until migration is deployed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: document, error: docError } = await (supabase as any)
            .from('user_documents')
            .insert({
                user_id: this.userId,
                template_id: templateId,
                document_title: title,
                document_status: 'DRAFT',
                completion_percentage: 0,
                questions_answered: 0,
                total_questions: template.initial_questions?.length || 0,
                output_format: options.outputFormat || 'PDF',
                styling_options: options.stylingOptions || {},
                export_settings: options.exportSettings || {},
                document_version: 1
            })
            .select()
            .single();

        if (docError) {
            throw new Error(`Failed to create document: ${docError.message}`);
        }

        return document as UserDocument;
    }

    /**
     * Loads an existing document
     */
    async loadDocument(documentId: string): Promise<UserDocument | null> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('user_documents')
            .select('*')
            .eq('document_id', documentId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            throw new Error(`Failed to load document: ${error.message}`);
        }

        return data as UserDocument;
    }

    /**
     * Saves user answers to a document
     */
    async saveAnswers(
        documentId: string,
        answers: Record<string, UserAnswer>
    ): Promise<void> {
        if (!this.userId) {
            throw new Error('User ID required for saving answers');
        }

        // Prepare answer records for batch insert/upsert
        const answerRecords = Object.values(answers).map(answer => ({
            document_id: documentId,
            question_id: answer.question_id,
            answer_value: answer.value,
            is_auto_calculated: answer.is_auto_calculated || false,
            calculation_source: answer.calculation_source,
            is_valid: answer.is_valid,
            validation_errors: answer.validation_errors || [],
            answered_at: answer.answered_at,
            modified_at: new Date().toISOString(),
            answer_version: 1
        }));

        // Use upsert to handle both new and updated answers - using any until migration is deployed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('user_answers')
            .upsert(answerRecords, {
                onConflict: 'document_id,question_id',
                ignoreDuplicates: false
            });

        if (error) {
            throw new Error(`Failed to save answers: ${error.message}`);
        }

        // Update document progress
        await this.updateDocumentProgress(documentId);
    }

    /**
     * Loads user answers for a document
     */
    async loadAnswers(documentId: string): Promise<Record<string, UserAnswer>> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('user_answers')
            .select('*')
            .eq('document_id', documentId);

        if (error) {
            throw new Error(`Failed to load answers: ${error.message}`);
        }

        // Convert array to object keyed by question_id
        const answersMap: Record<string, UserAnswer> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.forEach((record: any) => {
            answersMap[record.question_id] = {
                question_id: record.question_id,
                template_id: '', // Will be filled from document template
                document_id: record.document_id,
                value: record.answer_value,
                answered_at: record.answered_at,
                is_auto_calculated: record.is_auto_calculated,
                calculation_source: record.calculation_source,
                is_valid: record.is_valid,
                validation_errors: record.validation_errors
            };
        });

        return answersMap;
    }

    /**
     * Creates or updates a wizard session
     */
    async saveSession(
        documentId: string,
        wizardState: DynamicWizardState,
        analytics?: Partial<WizardAnalytics>
    ): Promise<string> {
        if (!this.userId) {
            throw new Error('User ID required for session management');
        }

        const sessionData = {
            document_id: documentId,
            user_id: this.userId,
            current_step: wizardState.current_step,
            visible_questions: wizardState.visible_questions,
            completed_questions: wizardState.completed_questions,
            required_questions: wizardState.required_questions,
            session_data: {
                completion_percentage: wizardState.completion_percentage,
                is_complete: wizardState.is_complete,
                validation_errors: wizardState.validation_errors,
                started_at: wizardState.started_at,
                last_updated_at: wizardState.last_updated_at
            },
            last_activity_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
            total_time_spent: analytics?.total_time_spent || 0,
            questions_answered: wizardState.completed_questions.length,
            back_navigation_count: analytics?.back_navigation_count || 0
        };

        // Try to update existing session first - using any until migration is deployed
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingSession } = await (supabase as any)
            .from('wizard_sessions')
            .select('session_id')
            .eq('document_id', documentId)
            .eq('user_id', this.userId)
            .single();

        if (existingSession) {
            // Update existing session - using any until migration is deployed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('wizard_sessions')
                .update(sessionData)
                .eq('session_id', existingSession.session_id);

            if (error) {
                throw new Error(`Failed to update session: ${error.message}`);
            }

            return existingSession.session_id;
        } else {
            // Create new session - using any until migration is deployed
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: newSession, error } = await (supabase as any)
                .from('wizard_sessions')
                .insert(sessionData)
                .select('session_id')
                .single();

            if (error) {
                throw new Error(`Failed to create session: ${error.message}`);
            }

            return newSession.session_id;
        }
    }

    /**
     * Loads an existing wizard session
     */
    async loadSession(documentId: string): Promise<WizardSession | null> {
        if (!this.userId) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('wizard_sessions')
            .select('*')
            .eq('document_id', documentId)
            .eq('user_id', this.userId)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            throw new Error(`Failed to load session: ${error.message}`);
        }

        return data as WizardSession;
    }

    /**
     * Lists user documents with filtering and pagination
     */
    async listDocuments(options: {
        status?: UserDocument['document_status'];
        templateId?: string;
        limit?: number;
        offset?: number;
        orderBy?: 'created' | 'modified' | 'title';
        orderDirection?: 'asc' | 'desc';
    } = {}): Promise<{
        documents: UserDocument[];
        total: number;
    }> {
        if (!this.userId) {
            throw new Error('User ID required for listing documents');
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let query = (supabase as any)
            .from('user_documents')
            .select('*, dynamic_templates(template_name, category)', { count: 'exact' })
            .eq('user_id', this.userId);

        // Apply filters
        if (options.status) {
            query = query.eq('document_status', options.status);
        }

        if (options.templateId) {
            query = query.eq('template_id', options.templateId);
        }

        // Apply ordering
        const orderField = options.orderBy === 'created' ? 'started_at' :
            options.orderBy === 'modified' ? 'last_modified_at' :
                'document_title';
        query = query.order(orderField, {
            ascending: options.orderDirection === 'asc'
        });

        // Apply pagination
        if (options.limit) {
            query = query.limit(options.limit);
        }
        if (options.offset) {
            query = query.range(options.offset, (options.offset || 0) + (options.limit || 10) - 1);
        }

        const { data, error, count } = await query;

        if (error) {
            throw new Error(`Failed to list documents: ${error.message}`);
        }

        return {
            documents: data as UserDocument[],
            total: count || 0
        };
    }

    /**
     * Updates document progress based on answers
     */
    private async updateDocumentProgress(documentId: string): Promise<void> {
        // This will be handled by the database trigger we created
        // But we can also call the stored procedure directly for immediate update
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any).rpc('update_document_progress', {
            doc_id: documentId
        });

        if (error) {
            console.error('Failed to update document progress:', error);
            // Don't throw here as it's not critical for the main flow
        }
    }

    /**
     * Archives a document
     */
    async archiveDocument(documentId: string): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('user_documents')
            .update({
                document_status: 'ARCHIVED',
                last_modified_at: new Date().toISOString()
            })
            .eq('document_id', documentId)
            .eq('user_id', this.userId);

        if (error) {
            throw new Error(`Failed to archive document: ${error.message}`);
        }
    }

    /**
     * Deletes a document and all related data
     */
    async deleteDocument(documentId: string): Promise<void> {
        if (!this.userId) {
            throw new Error('User ID required for document deletion');
        }

        // Supabase will handle cascade deletes for related records
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('user_documents')
            .delete()
            .eq('document_id', documentId)
            .eq('user_id', this.userId);

        if (error) {
            throw new Error(`Failed to delete document: ${error.message}`);
        }
    }

    /**
     * Duplicates an existing document
     */
    async duplicateDocument(
        sourceDocumentId: string,
        newTitle?: string
    ): Promise<UserDocument> {
        if (!this.userId) {
            throw new Error('User ID required for document duplication');
        }

        // Load source document
        const sourceDoc = await this.loadDocument(sourceDocumentId);
        if (!sourceDoc) {
            throw new Error('Source document not found');
        }

        // Load source answers
        const sourceAnswers = await this.loadAnswers(sourceDocumentId);

        // Create new document
        const newDoc = await this.createDocument(
            sourceDoc.template_id,
            newTitle || `${sourceDoc.document_title} (Kopya)`,
            {
                outputFormat: sourceDoc.output_format,
                stylingOptions: sourceDoc.styling_options,
                exportSettings: sourceDoc.export_settings
            }
        );

        // Copy answers if any exist
        if (Object.keys(sourceAnswers).length > 0) {
            await this.saveAnswers(newDoc.document_id, sourceAnswers);
        }

        return newDoc;
    }

    /**
     * Generates document analytics
     */
    async generateAnalytics(documentId: string): Promise<WizardAnalytics | null> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('document_analytics')
            .select('*')
            .eq('document_id', documentId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            throw new Error(`Failed to load analytics: ${error.message}`);
        }

        return {
            template_id: data?.template_id,
            document_id: data?.document_id,
            total_time_spent: data?.total_completion_time,
            questions_answered: data?.questions_answered,
            questions_skipped: data?.questions_skipped,
            step_times: data?.step_times || {},
            back_navigation_count: data?.back_navigation_count,
            validation_error_count: data?.validation_error_count,
            rule_evaluations: [], // Would need to join with rule_evaluations table
            abandoned_at_step: data?.abandonment_point?.toString(),
            completion_date: data?.analytics_generated_at
        };
    }

    /**
     * Clean up expired sessions
     */
    async cleanupExpiredSessions(): Promise<number> {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('wizard_sessions')
            .delete()
            .lt('expires_at', new Date().toISOString())
            .select('session_id');

        if (error) {
            throw new Error(`Failed to cleanup sessions: ${error.message}`);
        }

        return data?.length || 0;
    }

    /**
     * Export document data for backup/migration
     */
    async exportDocumentData(documentId: string): Promise<{
        document: UserDocument;
        answers: Record<string, UserAnswer>;
        session?: WizardSession;
        analytics?: WizardAnalytics;
    }> {
        const document = await this.loadDocument(documentId);
        if (!document) {
            throw new Error('Document not found');
        }

        const answers = await this.loadAnswers(documentId);
        const session = await this.loadSession(documentId);
        const analytics = await this.generateAnalytics(documentId);

        return {
            document,
            answers,
            session: session || undefined,
            analytics: analytics || undefined
        };
    }
}

/**
 * Utility functions
 */
export const DocumentUtils = {
    /**
     * Calculate document completion percentage
     */
    calculateCompletion(
        totalQuestions: number,
        answeredQuestions: number,
        requiredQuestions: number = totalQuestions
    ): number {
        if (requiredQuestions === 0) return 100;
        const completed = Math.min(answeredQuestions, requiredQuestions);
        return Math.round((completed / requiredQuestions) * 100);
    },

    /**
     * Generate document title suggestions
     */
    generateTitleSuggestions(
        templateName: string,
        answers: Record<string, UserAnswer>
    ): string[] {
        const date = new Date().toLocaleDateString('tr-TR');
        const suggestions = [
            `${templateName} - ${date}`,
            `${templateName} Belgesi`,
            `Yeni ${templateName}`
        ];

        // Try to extract meaningful info from answers for more personalized titles
        for (const answer of Object.values(answers)) {
            if (typeof answer.value === 'string' && answer.value.length < 50) {
                suggestions.push(`${templateName} - ${answer.value}`);
            }
        }

        return [...new Set(suggestions)]; // Remove duplicates
    },

    /**
     * Validate document status transitions
     */
    canTransitionTo(
        currentStatus: UserDocument['document_status'],
        newStatus: UserDocument['document_status']
    ): boolean {
        const validTransitions: Record<UserDocument['document_status'], UserDocument['document_status'][]> = {
            'DRAFT': ['IN_PROGRESS', 'ARCHIVED'],
            'IN_PROGRESS': ['COMPLETED', 'DRAFT', 'ARCHIVED'],
            'COMPLETED': ['ARCHIVED', 'IN_PROGRESS'],
            'ARCHIVED': ['DRAFT', 'IN_PROGRESS']
        };

        return validTransitions[currentStatus]?.includes(newStatus) || false;
    }
};

// Create a default instance
export const documentManager = new UserDocumentManager();

// Hook for React components
export const useDocumentManager = (userId?: string) => {
    return new UserDocumentManager(userId);
};