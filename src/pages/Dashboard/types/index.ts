// Type definitions for Dashboard components

export type View = 'input' | 'result';

// API Response Types
export interface ExtractedEntity {
    entity: string;
    value: string | number;
}

export interface ActionableStep {
    description: string;
    actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY';
    documentToCreate?: string;
}

export interface RiskItem {
    riskType: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    article?: string;
    legalReference?: string;
    recommendation?: string;
}

export interface AnalysisResponse {
    simplifiedText: string;
    documentType: string;
    summary: string;
    criticalFacts?: Array<{ type: string; value: string }>;
    extractedEntities: ExtractedEntity[];
    actionableSteps: ActionableStep[];
    riskItems?: RiskItem[];
    generatedDocument: GeneratedDocument | null;
}

export interface GeneratedDocument {
    addressee: string;
    caseReference: string;
    parties: Array<{ role: string; details: string }>;
    subject: string;
    explanations: string[];
    legalGrounds: string;
    conclusionAndRequest: string;
    attachments?: string[];
    signatureBlock: string;
}

// Draft Document Types
export interface Kisi {
    ad_soyad: string;
    tc_kimlik?: string;
    adres?: string;
}

export interface ItirazNedeni {
    tip: string;
    aciklama: string;
}

export interface KullaniciGirdileri {
    makam_adi: string;
    dosya_no?: string;
    itiraz_eden_kisi: Kisi;
    alacakli_kurum?: { unvan: string; adres?: string };
    itiraz_nedenleri?: ItirazNedeni[];
    talep_sonucu: string;
    ekler?: string[];
}

export interface AnalysisLite {
    summary?: string;
    simplifiedText?: string;
    documentType?: string;
    criticalFacts?: Array<{ type: string; value: string }>;
    extractedEntities?: Array<{ entity: string; value: string | number }>;
    actionableSteps?: Array<{ description: string; actionType: 'CREATE_DOCUMENT' | 'INFO_ONLY'; documentToCreate?: string }>;
    riskItems?: Array<{ riskType: string; description: string; severity: 'high' | 'medium' | 'low'; legalReference?: string; recommendation?: string }>;
    originalText?: string;
}

export interface DraftRequest {
    belge_turu: string;
    kullanici_girdileri: KullaniciGirdileri;
    analysis?: AnalysisLite
}

// Legacy entity type for backwards compatibility
export type Entity = {
    tip: string;
    değer: string;
    rol?: string;
    açıklama?: string;
};

// Loading states
export type LoadingState = null | 'flash' | 'pro';

// Error types
export interface DashboardError {
    message: string;
    type: 'critical' | 'validation' | 'api' | 'fallback';
    details?: unknown;
}

// File types
export interface NativeFile {
    name: string;
    type: string;
    data: string; // base64 encoded
}

// State interfaces
export interface DashboardState {
    // Form state
    originalText: string;
    selectedFiles: File[];

    // Analysis results
    analysisResult: AnalysisResponse | null;
    loading: LoadingState;

    // Legacy states for backwards compatibility
    simplifiedText: string;
    summary: string;
    actionPlan: string;
    entities: Entity[];

    // UI state
    view: View;
    validationErrors: Record<string, string>;

    // Modal states
    isProModalOpen: boolean;
    showTip: boolean;
    showOnboarding: boolean;
    profileId: string | null;

    // Document drafting
    draftedText: string;
    isModalOpen: boolean;
    editMode: boolean;

    // Credits
    credits: number | null;

    // Error states
    criticalError: string | null;
    apiFallbackMode: boolean;
    nativeFeatureFallback: boolean;
    isRecovering: boolean;
}