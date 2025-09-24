/**
 * LawDepot "Akıllı Lego Seti" - Clause Database Service
 * Modüler hukuki metin parçacıkları için CRUD operations
 */

import { supabase } from '@/integrations/supabase/client';
import {
    LegalClause,
    ClauseSearchParams,
    ClauseResponse,
    ClauseCategory,
    UsageContext,
    ClauseInsert,
    ClauseUpdate,
    ClauseCondition
} from '@/types/clause';
import type { Database } from '@/integrations/supabase/types';

type ClauseRow = Database['public']['Tables']['legal_clauses']['Row'];
type ClauseInsertType = Database['public']['Tables']['legal_clauses']['Insert'];
type ClauseUpdateType = Database['public']['Tables']['legal_clauses']['Update'];

export class ClauseDatabaseService {
    /**
     * Clause Row'u LegalClause objesine dönüştür
     */
    private mapRowToClause(row: ClauseRow): LegalClause {
        return {
            clause_id: row.clause_id,
            clause_name: row.clause_name,
            clause_category: row.clause_category as ClauseCategory,
            clause_text: row.clause_text,
            clause_description: row.clause_description || undefined,
            jurisdiction: "TR" as const,
            legal_basis: row.legal_basis,
            legal_references: row.legal_references || undefined,
            version: row.version,
            is_active: row.is_active,
            supersedes: row.supersedes || undefined,
            created_by: row.created_by,
            reviewed_by: row.reviewed_by || undefined,
            approved_by: row.approved_by || undefined,
            created_at: row.created_at,
            updated_at: row.updated_at,
            usage_context: row.usage_context as UsageContext[],
            required_variables: row.required_variables,
            optional_variables: row.optional_variables || undefined,
            display_conditions: row.display_conditions ? (row.display_conditions as unknown as ClauseCondition[]) : undefined,
            dependency_clauses: row.dependency_clauses || undefined,
        };
    }

    /**
     * LegalClause objesini Clause Insert objesine dönüştür
     */
    private mapClauseToInsert(clause: Omit<LegalClause, 'created_at' | 'updated_at'>): ClauseInsertType {
        return {
            clause_id: clause.clause_id,
            clause_name: clause.clause_name,
            clause_category: clause.clause_category,
            clause_text: clause.clause_text,
            clause_description: clause.clause_description || null,
            jurisdiction: clause.jurisdiction,
            legal_basis: clause.legal_basis,
            legal_references: clause.legal_references || null,
            version: clause.version,
            is_active: clause.is_active,
            supersedes: clause.supersedes || null,
            created_by: clause.created_by,
            reviewed_by: clause.reviewed_by || null,
            approved_by: clause.approved_by || null,
            usage_context: clause.usage_context,
            required_variables: clause.required_variables,
            optional_variables: clause.optional_variables || null,
            display_conditions: clause.display_conditions ? (clause.display_conditions as unknown as Database['public']['Tables']['legal_clauses']['Row']['display_conditions']) : null,
            dependency_clauses: clause.dependency_clauses || null,
        };
    }

    /**
     * Tüm aktif clause'ları getir
     */
    async getAllClauses(): Promise<ClauseResponse> {
        try {
            const { data, error, count } = await supabase
                .from('legal_clauses')
                .select('*', { count: 'exact' })
                .eq('is_active', true)
                .order('clause_category', { ascending: true })
                .order('version', { ascending: false });

            if (error) throw error;

            const clauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: clauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error fetching clauses:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * ID'ye göre clause getir
     */
    async getClauseById(clauseId: string): Promise<ClauseResponse> {
        try {
            const { data, error } = await supabase
                .from('legal_clauses')
                .select('*')
                .eq('clause_id', clauseId)
                .eq('is_active', true)
                .single();

            if (error) throw error;

            const clause = data ? this.mapRowToClause(data) : null;

            return {
                success: true,
                data: clause
            };
        } catch (error) {
            console.error('Error fetching clause by ID:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Clause not found'
            };
        }
    }

    /**
     * Kategoriye göre clause'ları getir
     */
    async getClausesByCategory(category: ClauseCategory): Promise<ClauseResponse> {
        try {
            const { data, error, count } = await supabase
                .from('legal_clauses')
                .select('*', { count: 'exact' })
                .eq('clause_category', category)
                .eq('is_active', true)
                .order('version', { ascending: false });

            if (error) throw error;

            const clauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: clauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error fetching clauses by category:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Usage context'e göre clause'ları getir
     */
    async getClausesByUsageContext(context: UsageContext): Promise<ClauseResponse> {
        try {
            const { data, error, count } = await supabase
                .from('legal_clauses')
                .select('*', { count: 'exact' })
                .contains('usage_context', [context])
                .eq('is_active', true)
                .order('clause_category', { ascending: true })
                .order('version', { ascending: false });

            if (error) throw error;

            const clauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: clauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error fetching clauses by usage context:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Gelişmiş arama
     */
    async searchClauses(params: ClauseSearchParams): Promise<ClauseResponse> {
        try {
            let query = supabase
                .from('legal_clauses')
                .select('*', { count: 'exact' });

            // Aktif clause'lar sadece (varsayılan true)
            if (params.active_only !== false) {
                query = query.eq('is_active', true);
            }

            // Kategori filtresi
            if (params.category) {
                query = query.eq('clause_category', params.category);
            }

            // Usage context filtresi
            if (params.usage_context) {
                query = query.contains('usage_context', [params.usage_context]);
            }

            // Text arama
            if (params.search_text) {
                query = query.or(`clause_name.ilike.%${params.search_text}%,clause_text.ilike.%${params.search_text}%,clause_description.ilike.%${params.search_text}%`);
            }

            // Legal basis filtresi
            if (params.legal_basis && params.legal_basis.length > 0) {
                query = query.overlaps('legal_basis', params.legal_basis);
            }

            const { data, error, count } = await query
                .order('clause_category', { ascending: true })
                .order('version', { ascending: false });

            if (error) throw error;

            const clauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: clauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error searching clauses:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Search error'
            };
        }
    }

    /**
     * Yeni clause ekle
     */
    async createClause(clauseData: Omit<LegalClause, 'created_at' | 'updated_at'>): Promise<ClauseResponse> {
        try {
            const insertData = this.mapClauseToInsert(clauseData);

            const { data, error } = await supabase
                .from('legal_clauses')
                .insert(insertData)
                .select()
                .single();

            if (error) throw error;

            const clause = data ? this.mapRowToClause(data) : null;

            return {
                success: true,
                data: clause
            };
        } catch (error) {
            console.error('Error creating clause:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Create error'
            };
        }
    }

    /**
     * Clause güncelle
     */
    async updateClause(clauseId: string, updates: ClauseUpdate): Promise<ClauseResponse> {
        try {
            const updateData: ClauseUpdateType = {
                ...updates,
                display_conditions: updates.display_conditions ?
                    (updates.display_conditions as unknown as Database['public']['Tables']['legal_clauses']['Update']['display_conditions']) :
                    undefined,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from('legal_clauses')
                .update(updateData)
                .eq('clause_id', clauseId)
                .select()
                .single();

            if (error) throw error;

            const clause = data ? this.mapRowToClause(data) : null;

            return {
                success: true,
                data: clause
            };
        } catch (error) {
            console.error('Error updating clause:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Update error'
            };
        }
    }

    /**
     * Clause'u pasif hale getir (soft delete)
     */
    async deactivateClause(clauseId: string): Promise<ClauseResponse> {
        try {
            const { data, error } = await supabase
                .from('legal_clauses')
                .update({
                    is_active: false,
                    updated_at: new Date().toISOString()
                })
                .eq('clause_id', clauseId)
                .select()
                .single();

            if (error) throw error;

            const clause = data ? this.mapRowToClause(data) : null;

            return {
                success: true,
                data: clause
            };
        } catch (error) {
            console.error('Error deactivating clause:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Deactivation error'
            };
        }
    }

    /**
     * Clause versiyonlarını getir
     */
    async getClauseVersions(clauseIdPrefix: string): Promise<ClauseResponse> {
        try {
            const { data, error, count } = await supabase
                .from('legal_clauses')
                .select('*', { count: 'exact' })
                .like('clause_id', `${clauseIdPrefix}%`)
                .order('version', { ascending: false });

            if (error) throw error;

            const clauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: clauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error fetching clause versions:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Version fetch error'
            };
        }
    }

    /**
     * Bulk clause import (seed data için)
     */
    async importClauses(clauses: Omit<LegalClause, 'created_at' | 'updated_at'>[]): Promise<ClauseResponse> {
        try {
            const insertData = clauses.map(clause => this.mapClauseToInsert(clause));

            const { data, error, count } = await supabase
                .from('legal_clauses')
                .insert(insertData)
                .select();

            if (error) throw error;

            const importedClauses = data?.map(row => this.mapRowToClause(row)) || [];

            return {
                success: true,
                data: importedClauses,
                count: count || 0
            };
        } catch (error) {
            console.error('Error importing clauses:', error);
            return {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'Import error'
            };
        }
    }
}

// Singleton instance
export const clauseDB = new ClauseDatabaseService();