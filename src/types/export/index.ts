/**
 * Document Export System Types
 * Support for PDF, DOCX, and other document formats
 */

export interface DocumentExportRequest {
    documentContent: string;
    documentType: DocumentType;
    format: ExportFormat;
    options: ExportOptions;
    metadata: DocumentMetadata;
}

export interface DocumentExportResponse {
    success: boolean;
    exportedDocument?: ExportedDocument;
    error?: string;
    warnings?: string[];
    downloadUrl?: string;
    fileSize?: number;
}

export interface ExportedDocument {
    id: string;
    originalDocumentId?: string;
    format: ExportFormat;
    filename: string;
    content: Uint8Array | string;
    contentType: string;
    fileSize: number;
    metadata: ExportMetadata;
    createdAt: Date;
    expiresAt?: Date;
}

export interface ExportOptions {
    // PDF Options
    pdf?: PDFExportOptions;

    // DOCX Options
    docx?: DOCXExportOptions;

    // Common Options
    includeWatermark?: boolean;
    watermarkText?: string;
    includeMetadata?: boolean;
    compressionLevel?: CompressionLevel;
    pageOrientation?: PageOrientation;
    pageSize?: PageSize;
    margins?: PageMargins;
    fonts?: FontOptions;
    language?: string;
}

export interface PDFExportOptions {
    // Quality and Performance
    quality: PDFQuality;
    enableA11y: boolean; // Accessibility features

    // Security
    permissions?: PDFPermissions;
    password?: string;
    ownerPassword?: string;

    // Layout
    layout: PDFLayout;
    headerFooter?: HeaderFooterOptions;

    // Content
    embedFonts: boolean;
    optimizeForPrint: boolean;
    includeBookmarks: boolean;
    includeThumbnails: boolean;

    // Advanced
    pdfVersion?: PDFVersion;
    colorProfile?: ColorProfile;
    metadata?: PDFMetadata;
}

export interface DOCXExportOptions {
    // Document Properties
    template?: string;
    styles?: DOCXStyles;

    // Content
    includeComments: boolean;
    includeTrackedChanges: boolean;
    includeHeaders: boolean;
    includeFooters: boolean;

    // Formatting
    defaultFont?: string;
    defaultFontSize?: number;
    lineSpacing?: number;

    // Compatibility
    wordVersion?: WordVersion;
    compatibility?: CompatibilityMode;
}

export interface DocumentMetadata {
    title: string;
    author: string;
    subject?: string;
    keywords?: string[];
    description?: string;
    category?: string;
    documentType: DocumentType;
    language: string;
    createdAt: Date;
    modifiedAt?: Date;
    version?: string;

    // Legal Document Specific
    legalReferences?: LegalReference[];
    jurisdiction?: string;
    legalCategory?: string;
    confidentialityLevel?: ConfidentialityLevel;
    retentionPeriod?: number; // days
}

export interface ExportMetadata {
    exportFormat: ExportFormat;
    exportedAt: Date;
    exportedBy: string;
    exportOptions: ExportOptions;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    processingTime: number; // milliseconds
    qualityScore?: number;
    validationResults?: ValidationResult[];
}

export interface LegalReference {
    code: string;
    article: string;
    description: string;
    url?: string;
}

export interface ValidationResult {
    type: ValidationType;
    message: string;
    severity: ValidationSeverity;
    location?: DocumentLocation;
}

export interface DocumentLocation {
    page?: number;
    line?: number;
    column?: number;
    section?: string;
}

export interface PageMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: MarginUnit;
}

export interface FontOptions {
    primary: string;
    fallback: string[];
    embedSubsets: boolean;
    optimizeForWeb: boolean;
}

export interface HeaderFooterOptions {
    includeHeader: boolean;
    includeFooter: boolean;
    headerText?: string;
    footerText?: string;
    includePageNumbers: boolean;
    includeLegalNotice: boolean;
    customHeaderFooter?: CustomHeaderFooter;
}

export interface CustomHeaderFooter {
    headerHTML?: string;
    footerHTML?: string;
    headerHeight?: number;
    footerHeight?: number;
}

export interface PDFPermissions {
    allowPrinting: boolean;
    allowCopying: boolean;
    allowModifying: boolean;
    allowAnnotations: boolean;
    allowFormFilling: boolean;
    allowContentExtraction: boolean;
    allowAssembly: boolean;
    allowHighQualityPrinting: boolean;
}

export interface PDFMetadata {
    producer?: string;
    creator?: string;
    title?: string;
    subject?: string;
    keywords?: string;
    customProperties?: Record<string, string>;
}

export interface DOCXStyles {
    normalStyle?: StyleDefinition;
    headingStyles?: Record<number, StyleDefinition>;
    paragraphStyles?: Record<string, StyleDefinition>;
    characterStyles?: Record<string, StyleDefinition>;
}

export interface StyleDefinition {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: FontWeight;
    fontStyle?: FontStyle;
    textDecoration?: TextDecoration;
    color?: string;
    backgroundColor?: string;
    alignment?: TextAlignment;
    lineHeight?: number;
    marginTop?: number;
    marginBottom?: number;
    indent?: number;
}

// Enums
export enum DocumentType {
    RENT_DISPUTE = 'rent_dispute',
    EMPLOYMENT_CONTRACT = 'employment_contract',
    LEGAL_PETITION = 'legal_petition',
    CONSUMER_COMPLAINT = 'consumer_complaint',
    FAMILY_LAW = 'family_law',
    GENERAL_DOCUMENT = 'general_document'
}

export enum ExportFormat {
    PDF = 'pdf',
    DOCX = 'docx',
    HTML = 'html',
    TXT = 'txt',
    RTF = 'rtf'
}

export enum PDFQuality {
    LOW = 'low',           // Optimized for size
    MEDIUM = 'medium',     // Balanced
    HIGH = 'high',         // Optimized for quality
    PRINT = 'print'        // Print-ready quality
}

export enum PDFLayout {
    PORTRAIT = 'portrait',
    LANDSCAPE = 'landscape'
}

export enum PDFVersion {
    PDF_1_4 = '1.4',
    PDF_1_5 = '1.5',
    PDF_1_6 = '1.6',
    PDF_1_7 = '1.7',
    PDF_2_0 = '2.0'
}

export enum ColorProfile {
    sRGB = 'sRGB',
    ADOBE_RGB = 'Adobe RGB',
    CMYK = 'CMYK',
    GRAYSCALE = 'Grayscale'
}

export enum WordVersion {
    WORD_2016 = '2016',
    WORD_2019 = '2019',
    WORD_365 = '365'
}

export enum CompatibilityMode {
    STRICT = 'strict',
    TRANSITIONAL = 'transitional',
    LEGACY = 'legacy'
}

export enum CompressionLevel {
    NONE = 'none',
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    MAXIMUM = 'maximum'
}

export enum PageOrientation {
    PORTRAIT = 'portrait',
    LANDSCAPE = 'landscape'
}

export enum PageSize {
    A4 = 'A4',
    A3 = 'A3',
    A5 = 'A5',
    LETTER = 'Letter',
    LEGAL = 'Legal',
    TABLOID = 'Tabloid'
}

export enum MarginUnit {
    MM = 'mm',
    CM = 'cm',
    INCH = 'inch',
    PT = 'pt'
}

export enum ConfidentialityLevel {
    PUBLIC = 'public',
    INTERNAL = 'internal',
    CONFIDENTIAL = 'confidential',
    RESTRICTED = 'restricted'
}

export enum ValidationType {
    FORMAT = 'format',
    CONTENT = 'content',
    LEGAL = 'legal',
    ACCESSIBILITY = 'accessibility',
    SECURITY = 'security'
}

export enum ValidationSeverity {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    CRITICAL = 'critical'
}

export enum FontWeight {
    NORMAL = 'normal',
    BOLD = 'bold',
    LIGHT = 'light',
    MEDIUM = 'medium',
    HEAVY = 'heavy'
}

export enum FontStyle {
    NORMAL = 'normal',
    ITALIC = 'italic',
    OBLIQUE = 'oblique'
}

export enum TextDecoration {
    NONE = 'none',
    UNDERLINE = 'underline',
    LINE_THROUGH = 'line-through',
    OVERLINE = 'overline'
}

export enum TextAlignment {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
    JUSTIFY = 'justify'
}

// Utility Types
export type ExportProgressCallback = (progress: number, stage: string) => void;

export interface ExportJob {
    id: string;
    request: DocumentExportRequest;
    status: ExportJobStatus;
    progress: number;
    stage: string;
    startedAt: Date;
    completedAt?: Date;
    result?: DocumentExportResponse;
    error?: string;
}

export enum ExportJobStatus {
    QUEUED = 'queued',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

// Template Export Types
export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    category: DocumentType;
    content: string;
    placeholders: string[];
    supportedFormats: ExportFormat[];
    defaultOptions: ExportOptions;
    previewImageUrl?: string;
}

export interface TemplateExportRequest extends DocumentExportRequest {
    templateId: string;
    templateVariables: Record<string, string | number | boolean>;
}