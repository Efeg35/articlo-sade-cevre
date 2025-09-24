/**
 * Clause Version Control Service
 * Manages clause versioning, updates, and legal compliance tracking
 */

import { supabase } from '@/integrations/supabase/client';
import {
    ClauseVersion,
    VersionControlRequest,
    VersionControlResponse,
    VersionComparisonRequest,
    VersionComparisonResponse,
    VersionComparison,
    VersionStatus,
    ChangeType,
    ImpactLevel,
    AuditAction,
    RegulatoryUpdate,
    ComparisonType,
    MigrationComplexity,
    DifferenceType,
    ComplianceLevel,
    RiskLevel,
    ImplementationStatus
} from '@/types/clause/versionControl';
import { LegalClause } from '@/types/clause';

// Extended interface for version control operations
interface VersionControlUpdate extends Partial<LegalClause> {
    content?: string;
    title?: string;
    description?: string;
    category?: string;
    subcategory?: string;
    applicableDocuments?: string[];
    legalReferences?: Array<{
        code: string;
        article: string;
        section?: string;
        paragraph?: string;
        description: string;
        url?: string;
        lastVerified: Date;
        isActive: boolean;
    }>;
    placeholders?: string[];
}

class ClauseVersionControlService {
    /**
     * Create a new version of a clause
     */
    async createClauseVersion(request: VersionControlRequest): Promise<VersionControlResponse> {
        try {
            const { clauseId, newVersion, changeReason, legalJustification, effectiveDate, userId } = request;

            // Cast to our extended interface for version control
            const versionUpdate = newVersion as VersionControlUpdate;

            // Get current active version (simulated)
            const currentVersion = await this.getActiveVersionSimulated(clauseId);
            if (!currentVersion.success) {
                return { success: false, error: 'Current version not found' };
            }

            // Generate new version number
            const newVersionNumber = this.generateVersionNumber(
                currentVersion.version?.version || '1.0.0',
                this.determineChangeType(versionUpdate, currentVersion.version!)
            );

            // Create new version record
            const clauseVersion: ClauseVersion = {
                id: `${clauseId}_v${newVersionNumber}`,
                clauseId,
                version: newVersionNumber,
                content: versionUpdate.content || currentVersion.version!.content,
                metadata: {
                    title: versionUpdate.title || currentVersion.version!.metadata.title,
                    description: versionUpdate.description || currentVersion.version!.metadata.description,
                    category: versionUpdate.category || currentVersion.version!.metadata.category,
                    subcategory: versionUpdate.subcategory,
                    applicableDocuments: versionUpdate.applicableDocuments || currentVersion.version!.metadata.applicableDocuments,
                    requiredFields: versionUpdate.placeholders || currentVersion.version!.metadata.requiredFields,
                    optionalFields: [],
                    compatibilityMatrix: {
                        minimumSystemVersion: '1.0.0',
                        dependsOn: [],
                        conflictsWith: []
                    }
                },
                legalContext: {
                    legalReferences: versionUpdate.legalReferences || currentVersion.version!.legalContext.legalReferences,
                    complianceLevel: ComplianceLevel.STANDARD,
                    jurisdictionScope: ['TR'],
                    regulatoryUpdates: [],
                    riskAssessment: {
                        riskLevel: RiskLevel.LOW,
                        identifiedRisks: [],
                        mitigationStrategies: [],
                        lastAssessment: new Date(),
                        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
                    },
                    auditTrail: [{
                        timestamp: new Date(),
                        action: AuditAction.CREATE,
                        userId,
                        details: `Version ${newVersionNumber} created: ${changeReason}`
                    }]
                },
                changelog: {
                    version: newVersionNumber,
                    releaseDate: new Date(),
                    changes: [{
                        type: ChangeType.LEGAL_UPDATE,
                        description: changeReason,
                        impact: ImpactLevel.MEDIUM,
                        legalJustification
                    }],
                    breakingChanges: false
                },
                status: VersionStatus.DRAFT,
                createdAt: new Date(),
                effectiveDate: effectiveDate || new Date(),
                createdBy: userId
            };

            // For now, store in memory/localStorage (Supabase schema doesn't have version tables yet)
            this.storeVersionInMemory(clauseVersion);

            return {
                success: true,
                version: clauseVersion,
                warnings: this.generateVersionWarnings(clauseVersion, currentVersion.version!)
            };

        } catch (error) {
            console.error('Error creating clause version:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get active version of a clause (simulated implementation)
     */
    async getActiveVersionSimulated(clauseId: string): Promise<{ success: boolean; version?: ClauseVersion; error?: string }> {
        try {
            // For demo purposes, create a mock active version
            const mockVersion: ClauseVersion = {
                id: `${clauseId}_v1.0.0`,
                clauseId,
                version: '1.0.0',
                content: 'Mock clause content for ' + clauseId,
                metadata: {
                    title: 'Mock Clause Title',
                    description: 'Mock clause description',
                    category: 'rent_dispute',
                    applicableDocuments: ['rent-dispute-petition'],
                    requiredFields: ['tenant_name', 'landlord_name'],
                    optionalFields: [],
                    compatibilityMatrix: {
                        minimumSystemVersion: '1.0.0',
                        dependsOn: [],
                        conflictsWith: []
                    }
                },
                legalContext: {
                    legalReferences: [
                        {
                            code: 'TBK',
                            article: 'm.344',
                            description: 'Kira artırım bildirimi',
                            url: '',
                            lastVerified: new Date(),
                            isActive: true
                        }
                    ],
                    complianceLevel: ComplianceLevel.STANDARD,
                    jurisdictionScope: ['TR'],
                    regulatoryUpdates: [],
                    riskAssessment: {
                        riskLevel: RiskLevel.LOW,
                        identifiedRisks: [],
                        mitigationStrategies: [],
                        lastAssessment: new Date(),
                        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                    },
                    auditTrail: []
                },
                changelog: {
                    version: '1.0.0',
                    releaseDate: new Date(),
                    changes: [{
                        type: ChangeType.FEATURE,
                        description: 'Initial version',
                        impact: ImpactLevel.LOW
                    }],
                    breakingChanges: false
                },
                status: VersionStatus.ACTIVE,
                createdAt: new Date(),
                effectiveDate: new Date(),
                createdBy: 'system'
            };

            return { success: true, version: mockVersion };
        } catch (error) {
            console.error('Error getting active version:', error);
            return { success: false, error: 'Database error' };
        }
    }

    /**
     * Compare two versions of a clause
     */
    async compareVersions(request: VersionComparisonRequest): Promise<VersionComparisonResponse> {
        try {
            const { clauseId, fromVersion, toVersion, comparisonType } = request;

            // Get both versions
            const fromVersionData = await this.getSpecificVersion(clauseId, fromVersion);
            const toVersionData = await this.getSpecificVersion(clauseId, toVersion);

            if (!fromVersionData.success || !toVersionData.success) {
                return { success: false, error: 'One or both versions not found' };
            }

            const comparison = this.generateVersionComparison(
                fromVersionData.version!,
                toVersionData.version!,
                comparisonType
            );

            return { success: true, comparison };
        } catch (error) {
            console.error('Error comparing versions:', error);
            return { success: false, error: 'Comparison failed' };
        }
    }

    /**
     * Activate a version (make it the current active version)
     */
    async activateVersion(clauseId: string, version: string, userId: string): Promise<VersionControlResponse> {
        try {
            // Simulated activation (would update in real database)
            const activeVersion = await this.getActiveVersionSimulated(clauseId);

            if (activeVersion.success) {
                // Log audit entry (simulated)
                await this.logAuditEntrySimulated(clauseId, version, AuditAction.ACTIVATE, userId, `Version ${version} activated`);

                return {
                    success: true,
                    version: activeVersion.version
                };
            }

            return { success: false, error: 'Failed to activate version' };
        } catch (error) {
            console.error('Error activating version:', error);
            return { success: false, error: 'Activation failed' };
        }
    }

    /**
     * Get version history for a clause
     */
    async getVersionHistory(clauseId: string): Promise<ClauseVersion[]> {
        try {
            // Simulated version history
            const activeVersion = await this.getActiveVersionSimulated(clauseId);
            return activeVersion.success ? [activeVersion.version!] : [];
        } catch (error) {
            console.error('Error getting version history:', error);
            return [];
        }
    }

    /**
     * Check for regulatory updates that might affect clauses
     */
    async checkRegulatoryUpdates(): Promise<RegulatoryUpdate[]> {
        try {
            // In real implementation, this would check against legal databases
            // For now, return simulated regulatory updates
            return [
                {
                    updateId: 'tbk-344-update-2024',
                    title: 'TBK Madde 344 - Kira Artırım Oranları Güncellenmesi',
                    description: 'Kira artırım oranlarına ilişkin yeni düzenlemeler.',
                    source: 'Resmi Gazete - Sayı: 32456',
                    updateDate: new Date('2024-01-15'),
                    effectiveDate: new Date('2024-02-01'),
                    impact: ImpactLevel.HIGH,
                    affectedClauses: ['rent-increase-clause', 'rent-dispute-clause'],
                    implementationStatus: ImplementationStatus.PENDING
                },
                {
                    updateId: 'hmk-119-update-2024',
                    title: 'HMK Madde 119 - İcra Takibi Usul Değişiklikleri',
                    description: 'İcra takibi usulünde yeni düzenlemeler.',
                    source: 'Resmi Gazete - Sayı: 32457',
                    updateDate: new Date('2024-02-01'),
                    effectiveDate: new Date('2024-03-01'),
                    impact: ImpactLevel.MEDIUM,
                    affectedClauses: ['execution-clause', 'legal-process-clause'],
                    implementationStatus: ImplementationStatus.IN_PROGRESS
                }
            ];
        } catch (error) {
            console.error('Error checking regulatory updates:', error);
            return [];
        }
    }

    /**
     * Apply regulatory update to affected clauses
     */
    async applyRegulatoryUpdate(updateId: string, affectedClauses: string[], userId: string): Promise<VersionControlResponse[]> {
        const results: VersionControlResponse[] = [];

        for (const clauseId of affectedClauses) {
            try {
                const updateResult = await this.createClauseVersion({
                    clauseId,
                    newVersion: {}, // In real implementation, this would contain actual updates
                    changeReason: `Regulatory update applied: ${updateId}`,
                    legalJustification: 'Legal compliance requirement',
                    userId
                });

                results.push(updateResult);
            } catch (error) {
                results.push({
                    success: false,
                    error: error instanceof Error ? error.message : 'Update failed'
                });
            }
        }

        return results;
    }

    // Private helper methods

    private async getSpecificVersion(clauseId: string, version: string): Promise<{ success: boolean; version?: ClauseVersion }> {
        try {
            // Simulated - return active version for now
            return await this.getActiveVersionSimulated(clauseId);
        } catch {
            return { success: false };
        }
    }

    private generateVersionNumber(currentVersion: string, changeType: ChangeType): string {
        const [major, minor, patch] = currentVersion.split('.').map(Number);

        switch (changeType) {
            case ChangeType.BREAKING_CHANGE:
                return `${major + 1}.0.0`;
            case ChangeType.FEATURE:
            case ChangeType.LEGAL_UPDATE:
                return `${major}.${minor + 1}.0`;
            default:
                return `${major}.${minor}.${patch + 1}`;
        }
    }

    private determineChangeType(newVersion: VersionControlUpdate, currentVersion: ClauseVersion): ChangeType {
        // Simple logic to determine change type
        if (newVersion.legalReferences &&
            JSON.stringify(newVersion.legalReferences) !== JSON.stringify(currentVersion.legalContext.legalReferences)) {
            return ChangeType.LEGAL_UPDATE;
        }
        if (newVersion.content && newVersion.content !== currentVersion.content) {
            return ChangeType.FEATURE;
        }
        return ChangeType.BUGFIX;
    }

    private generateVersionComparison(
        fromVersion: ClauseVersion,
        toVersion: ClauseVersion,
        comparisonType: ComparisonType
    ): VersionComparison {
        const differences = [];

        // Content comparison
        if (fromVersion.content !== toVersion.content) {
            differences.push({
                field: 'content',
                type: DifferenceType.MODIFICATION,
                oldValue: fromVersion.content,
                newValue: toVersion.content,
                impact: ImpactLevel.MEDIUM,
                description: 'Clause content updated'
            });
        }

        // Legal references comparison
        if (JSON.stringify(fromVersion.legalContext.legalReferences) !==
            JSON.stringify(toVersion.legalContext.legalReferences)) {
            differences.push({
                field: 'legalReferences',
                type: DifferenceType.MODIFICATION,
                oldValue: fromVersion.legalContext.legalReferences,
                newValue: toVersion.legalContext.legalReferences,
                impact: ImpactLevel.HIGH,
                description: 'Legal references updated'
            });
        }

        return {
            clauseId: fromVersion.clauseId,
            fromVersion: fromVersion.version,
            toVersion: toVersion.version,
            differences,
            compatibilityImpact: {
                hasBreakingChanges: differences.some(d => d.impact === ImpactLevel.CRITICAL),
                affectedFeatures: differences.map(d => d.field),
                migrationRequired: differences.some(d => d.impact === ImpactLevel.HIGH),
                backwardCompatible: !differences.some(d => d.impact === ImpactLevel.CRITICAL)
            },
            migrationComplexity: this.calculateMigrationComplexity(differences),
            recommendedActions: this.generateRecommendedActions(differences)
        };
    }

    private calculateMigrationComplexity(differences: Array<{ impact: ImpactLevel }>): MigrationComplexity {
        const highImpactCount = differences.filter(d => d.impact === ImpactLevel.HIGH).length;
        const criticalImpactCount = differences.filter(d => d.impact === ImpactLevel.CRITICAL).length;

        if (criticalImpactCount > 0) return MigrationComplexity.MAJOR;
        if (highImpactCount > 2) return MigrationComplexity.COMPLEX;
        if (highImpactCount > 0) return MigrationComplexity.MODERATE;
        if (differences.length > 3) return MigrationComplexity.SIMPLE;
        return MigrationComplexity.TRIVIAL;
    }

    private generateRecommendedActions(differences: Array<{ field: string; impact: ImpactLevel }>): string[] {
        const actions = ['Review changes carefully'];

        if (differences.some(d => d.field === 'legalReferences')) {
            actions.push('Update legal compliance documentation');
            actions.push('Notify legal team of changes');
        }

        if (differences.some(d => d.impact === ImpactLevel.HIGH)) {
            actions.push('Test with existing document templates');
            actions.push('Update user documentation');
        }

        return actions;
    }

    private generateVersionWarnings(newVersion: ClauseVersion, currentVersion: ClauseVersion): string[] {
        const warnings: string[] = [];

        if (newVersion.legalContext.legalReferences.length !== currentVersion.legalContext.legalReferences.length) {
            warnings.push('Legal reference count changed - review compliance');
        }

        if (newVersion.metadata.requiredFields.length > currentVersion.metadata.requiredFields.length) {
            warnings.push('Additional required fields added - may affect existing documents');
        }

        return warnings;
    }

    private async logAuditEntrySimulated(
        clauseId: string,
        version: string,
        action: AuditAction,
        userId: string,
        details: string
    ): Promise<void> {
        try {
            // Simulated audit logging - would store in database in real implementation
            console.log(`Audit Log: ${action} - Clause ${clauseId} v${version} by ${userId}: ${details}`);
        } catch (error) {
            console.error('Error logging audit entry:', error);
        }
    }

    private serializeVersionForDB(version: ClauseVersion): Record<string, unknown> {
        return {
            id: version.id,
            clause_id: version.clauseId,
            version: version.version,
            content: version.content,
            metadata: JSON.stringify(version.metadata),
            legal_context: JSON.stringify(version.legalContext),
            changelog: JSON.stringify(version.changelog),
            status: version.status,
            created_at: version.createdAt.toISOString(),
            effective_date: version.effectiveDate.toISOString(),
            deprecated_date: version.deprecatedDate?.toISOString() || null,
            created_by: version.createdBy
        };
    }

    private deserializeVersionFromDB(data: Record<string, unknown>): ClauseVersion {
        return {
            id: String(data.id),
            clauseId: String(data.clause_id),
            version: String(data.version),
            content: String(data.content),
            metadata: JSON.parse(String(data.metadata)),
            legalContext: JSON.parse(String(data.legal_context)),
            changelog: JSON.parse(String(data.changelog)),
            status: data.status as VersionStatus,
            createdAt: new Date(String(data.created_at)),
            effectiveDate: new Date(String(data.effective_date)),
            deprecatedDate: data.deprecated_date ? new Date(String(data.deprecated_date)) : undefined,
            createdBy: String(data.created_by)
        };
    }

    // Helper method for storing versions in memory (demo purposes)
    private storeVersionInMemory(version: ClauseVersion): void {
        // In a real implementation, this would be stored in Supabase
        console.log(`Stored version ${version.version} for clause ${version.clauseId}`);
    }
}

// Export singleton instance
export const clauseVersionControl = new ClauseVersionControlService();
export default clauseVersionControl;