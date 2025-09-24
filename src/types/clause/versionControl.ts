/**
 * Clause Version Control System Types
 * For managing clause updates, legal compliance, and version tracking
 */

import { LegalClause } from './index';

export interface ClauseVersion {
    id: string;
    clauseId: string;
    version: string; // Semantic versioning: "1.0.0", "1.1.0", "2.0.0"
    content: string;
    metadata: ClauseVersionMetadata;
    legalContext: LegalComplianceContext;
    changelog: VersionChangelog;
    status: VersionStatus;
    createdAt: Date;
    effectiveDate: Date;
    deprecatedDate?: Date;
    createdBy: string; // User ID or system
}

export interface ClauseVersionMetadata {
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    applicableDocuments: string[]; // Document types this clause applies to
    requiredFields: string[]; // Fields needed for this clause
    optionalFields: string[]; // Optional fields for enhanced content
    compatibilityMatrix: CompatibilityMatrix;
}

export interface LegalComplianceContext {
    legalReferences: LegalReference[];
    complianceLevel: ComplianceLevel;
    jurisdictionScope: string[]; // ["TR", "EU"] etc.
    regulatoryUpdates: RegulatoryUpdate[];
    riskAssessment: RiskAssessment;
    auditTrail: AuditEntry[];
}

export interface LegalReference {
    code: string; // "TBK", "HMK", etc.
    article: string; // "m.344", "m.119", etc.
    section?: string;
    paragraph?: string;
    description: string;
    url?: string;
    lastVerified: Date;
    isActive: boolean;
}

export interface VersionChangelog {
    version: string;
    releaseDate: Date;
    changes: ChangeEntry[];
    migrationNotes?: string;
    breakingChanges: boolean;
    testingNotes?: string;
}

export interface ChangeEntry {
    type: ChangeType;
    description: string;
    impact: ImpactLevel;
    legalJustification?: string;
    references?: string[]; // Legal references for the change
}

export interface CompatibilityMatrix {
    minimumSystemVersion: string;
    deprecatedInVersion?: string;
    replacedBy?: string; // Clause ID that replaces this one
    dependsOn: string[]; // Other clause IDs this depends on
    conflictsWith: string[]; // Clauses that conflict with this one
}

export interface RegulatoryUpdate {
    updateId: string;
    title: string;
    description: string;
    source: string; // "Resmi Gazete", "TBMM", etc.
    updateDate: Date;
    effectiveDate: Date;
    impact: ImpactLevel;
    affectedClauses: string[];
    implementationStatus: ImplementationStatus;
}

export interface RiskAssessment {
    riskLevel: RiskLevel;
    identifiedRisks: Risk[];
    mitigationStrategies: string[];
    lastAssessment: Date;
    nextReviewDate: Date;
}

export interface Risk {
    riskId: string;
    description: string;
    probability: RiskProbability;
    impact: ImpactLevel;
    category: RiskCategory;
    mitigationStatus: MitigationStatus;
}

export interface AuditEntry {
    timestamp: Date;
    action: AuditAction;
    userId: string;
    details: string;
    ipAddress?: string;
    userAgent?: string;
}

// Enums
export enum VersionStatus {
    DRAFT = 'draft',
    REVIEW = 'review',
    APPROVED = 'approved',
    ACTIVE = 'active',
    DEPRECATED = 'deprecated',
    ARCHIVED = 'archived'
}

export enum ChangeType {
    FEATURE = 'feature',
    BUGFIX = 'bugfix',
    LEGAL_UPDATE = 'legal_update',
    SECURITY = 'security',
    PERFORMANCE = 'performance',
    BREAKING_CHANGE = 'breaking_change',
    DOCUMENTATION = 'documentation'
}

export enum ImpactLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum ComplianceLevel {
    BASIC = 'basic',
    STANDARD = 'standard',
    ENHANCED = 'enhanced',
    ENTERPRISE = 'enterprise'
}

export enum ImplementationStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    REJECTED = 'rejected'
}

export enum RiskLevel {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

export enum RiskProbability {
    VERY_LOW = 'very_low',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    VERY_HIGH = 'very_high'
}

export enum RiskCategory {
    LEGAL = 'legal',
    TECHNICAL = 'technical',
    COMPLIANCE = 'compliance',
    BUSINESS = 'business',
    SECURITY = 'security'
}

export enum MitigationStatus {
    IDENTIFIED = 'identified',
    PLANNED = 'planned',
    IN_PROGRESS = 'in_progress',
    IMPLEMENTED = 'implemented',
    VERIFIED = 'verified'
}

export enum AuditAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    APPROVE = 'approve',
    REJECT = 'reject',
    ACTIVATE = 'activate',
    DEPRECATE = 'deprecate',
    ARCHIVE = 'archive',
    VIEW = 'view',
    EXPORT = 'export'
}

// Service Interfaces
export interface VersionControlRequest {
    clauseId: string;
    newVersion: Partial<LegalClause>;
    changeReason: string;
    legalJustification?: string;
    effectiveDate?: Date;
    userId: string;
}

export interface VersionControlResponse {
    success: boolean;
    version?: ClauseVersion;
    error?: string;
    warnings?: string[];
    migrationRequired?: boolean;
    affectedDocuments?: string[];
}

export interface VersionComparisonRequest {
    clauseId: string;
    fromVersion: string;
    toVersion: string;
    comparisonType: ComparisonType;
}

export interface VersionComparisonResponse {
    success: boolean;
    comparison?: VersionComparison;
    error?: string;
}

export interface VersionComparison {
    clauseId: string;
    fromVersion: string;
    toVersion: string;
    differences: VersionDifference[];
    compatibilityImpact: CompatibilityImpact;
    migrationComplexity: MigrationComplexity;
    recommendedActions: string[];
}

export interface VersionDifference {
    field: string;
    type: DifferenceType;
    oldValue: string | number | boolean | string[] | object | null;
    newValue: string | number | boolean | string[] | object | null;
    impact: ImpactLevel;
    description: string;
}

export interface CompatibilityImpact {
    hasBreakingChanges: boolean;
    affectedFeatures: string[];
    migrationRequired: boolean;
    backwardCompatible: boolean;
}

export enum ComparisonType {
    CONTENT_ONLY = 'content_only',
    METADATA_ONLY = 'metadata_only',
    FULL_COMPARISON = 'full_comparison',
    LEGAL_CHANGES_ONLY = 'legal_changes_only'
}

export enum DifferenceType {
    ADDITION = 'addition',
    DELETION = 'deletion',
    MODIFICATION = 'modification',
    MOVE = 'move',
    FORMAT_CHANGE = 'format_change'
}

export enum MigrationComplexity {
    TRIVIAL = 'trivial',
    SIMPLE = 'simple',
    MODERATE = 'moderate',
    COMPLEX = 'complex',
    MAJOR = 'major'
}