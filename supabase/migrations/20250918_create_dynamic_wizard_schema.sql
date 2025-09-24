-- 🎯 LawDepot-Level Dynamic Wizard Database Schema
-- Bu migration, LawDepot'un dinamik soru sistemi için gerekli tabloları oluşturur.
-- Ana fark: Sorular arası conditional relationships ve dynamic question flow

-- Templates tablosu - Ana şablonlar
CREATE TABLE IF NOT EXISTS dynamic_templates (
  template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(255) NOT NULL,
  template_description TEXT,
  category VARCHAR(100) NOT NULL,
  
  -- Template metadata
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  complexity_level VARCHAR(20) CHECK (complexity_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')) DEFAULT 'BASIC',
  estimated_completion_time INTEGER DEFAULT 15, -- dakika
  
  -- Legal references
  legal_references JSONB DEFAULT '[]',
  
  -- Template configuration
  initial_questions UUID[] DEFAULT '{}', -- Başlangıçta görünen sorular
  output_config JSONB NOT NULL DEFAULT '{
    "default_format": "PDF",
    "supported_formats": ["PDF", "DOCX", "HTML"]
  }',
  
  -- Status and versioning
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Indexes for performance
  UNIQUE(template_name, version)
);

-- Dynamic Questions tablosu - Şablonlardaki sorular
CREATE TABLE IF NOT EXISTS dynamic_questions (
  question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES dynamic_templates(template_id) ON DELETE CASCADE,
  
  -- Question content
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) CHECK (question_type IN (
    'boolean', 'text', 'number', 'date', 'multiple_choice', 'currency', 'percentage'
  )) NOT NULL,
  
  -- Question behavior
  display_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT false,
  default_visible BOOLEAN DEFAULT true,
  
  -- UI configuration
  ui_config JSONB DEFAULT '{}',
  placeholder TEXT,
  help_text TEXT,
  tooltip TEXT,
  
  -- Validation rules
  validation_rules JSONB DEFAULT '{}',
  
  -- Question metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Answer Options tablosu - Çoktan seçmeli sorular için seçenekler
CREATE TABLE IF NOT EXISTS answer_options (
  option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES dynamic_questions(question_id) ON DELETE CASCADE,
  
  -- Option content
  option_value VARCHAR(255) NOT NULL,
  option_label TEXT NOT NULL,
  option_description TEXT,
  
  -- Option behavior
  display_order INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Option metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conditional Rules tablosu - Dynamic behavior rules
CREATE TABLE IF NOT EXISTS conditional_rules (
  rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES dynamic_templates(template_id) ON DELETE CASCADE,
  
  -- Rule trigger
  trigger_question_id UUID NOT NULL REFERENCES dynamic_questions(question_id) ON DELETE CASCADE,
  operator VARCHAR(50) CHECK (operator IN (
    'EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 
    'CONTAINS', 'NOT_CONTAINS', 'IS_EMPTY', 'IS_NOT_EMPTY'
  )) NOT NULL,
  trigger_value JSONB NOT NULL, -- Can be string, number, boolean, or array
  
  -- Rule action
  action VARCHAR(50) CHECK (action IN (
    'SHOW_QUESTION', 'HIDE_QUESTION', 'REQUIRE_QUESTION', 
    'OPTIONAL_QUESTION', 'INCLUDE_CLAUSE', 'EXCLUDE_CLAUSE',
    'SET_VALUE', 'CALCULATE_VALUE'
  )) NOT NULL,
  target_id UUID NOT NULL, -- Can reference questions or clauses
  
  -- Rule metadata
  priority INTEGER DEFAULT 100, -- Lower number = higher priority
  description TEXT,
  calculation_formula TEXT, -- For CALCULATE_VALUE action
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Documents tablosu - Kullanıcı belgeleri
CREATE TABLE IF NOT EXISTS user_documents (
  document_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  template_id UUID NOT NULL REFERENCES dynamic_templates(template_id),
  
  -- Document metadata
  document_title VARCHAR(500) NOT NULL,
  document_status VARCHAR(50) CHECK (document_status IN (
    'DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'
  )) DEFAULT 'DRAFT',
  
  -- Progress tracking
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  questions_answered INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  
  -- Generated content
  generated_content TEXT,
  output_format VARCHAR(10) DEFAULT 'PDF',
  file_path TEXT, -- Path to generated file
  
  -- Document settings
  styling_options JSONB DEFAULT '{}',
  export_settings JSONB DEFAULT '{}',
  
  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_modified_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Version tracking
  document_version INTEGER DEFAULT 1
);

-- User Answers tablosu - Kullanıcı cevapları
CREATE TABLE IF NOT EXISTS user_answers (
  answer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES user_documents(document_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES dynamic_questions(question_id),
  
  -- Answer content
  answer_value JSONB NOT NULL, -- Flexible storage for any answer type
  
  -- Answer metadata
  is_auto_calculated BOOLEAN DEFAULT false,
  calculation_source TEXT, -- Formula or rule that calculated this
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00 for AI-generated answers
  
  -- Validation
  is_valid BOOLEAN DEFAULT true,
  validation_errors JSONB DEFAULT '[]',
  
  -- Audit trail
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  answer_version INTEGER DEFAULT 1,
  
  -- Unique constraint: bir document'ta her soru için tek cevap
  UNIQUE(document_id, question_id)
);

-- Wizard Sessions tablosu - Active wizard sessions
CREATE TABLE IF NOT EXISTS wizard_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES user_documents(document_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Session state
  current_step INTEGER DEFAULT 0,
  visible_questions UUID[] DEFAULT '{}',
  completed_questions UUID[] DEFAULT '{}',
  required_questions UUID[] DEFAULT '{}',
  
  -- Session metadata
  session_data JSONB DEFAULT '{}', -- Store complex session state
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Performance tracking
  total_time_spent INTEGER DEFAULT 0, -- seconds
  questions_answered INTEGER DEFAULT 0,
  back_navigation_count INTEGER DEFAULT 0
);

-- Rule Evaluations tablosu - Rule execution audit log
CREATE TABLE IF NOT EXISTS rule_evaluations (
  evaluation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES wizard_sessions(session_id) ON DELETE CASCADE,
  rule_id UUID NOT NULL REFERENCES conditional_rules(rule_id),
  
  -- Evaluation details
  triggered BOOLEAN NOT NULL,
  trigger_value JSONB,
  expected_value JSONB,
  evaluation_result JSONB,
  
  -- Performance
  evaluation_time_ms INTEGER,
  
  -- Timestamp
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Analytics tablosu - Wizard performans analizi
CREATE TABLE IF NOT EXISTS document_analytics (
  analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES user_documents(document_id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES dynamic_templates(template_id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Completion analytics
  total_completion_time INTEGER, -- seconds
  questions_answered INTEGER DEFAULT 0,
  questions_skipped INTEGER DEFAULT 0,
  back_navigation_count INTEGER DEFAULT 0,
  validation_error_count INTEGER DEFAULT 0,
  
  -- Step analytics
  step_times JSONB DEFAULT '{}', -- question_id -> time_spent mapping
  abandonment_point VARCHAR(255), -- Where user abandoned if incomplete
  
  -- Rule analytics
  rules_triggered INTEGER DEFAULT 0,
  avg_rule_evaluation_time DECIMAL(10,3),
  
  -- Document quality metrics
  completion_percentage INTEGER,
  content_quality_score DECIMAL(3,2), -- 0.00 to 1.00
  
  -- Timestamps
  analytics_generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create all indexes separately after table creation
CREATE INDEX IF NOT EXISTS idx_questions_template_order ON dynamic_questions(template_id, display_order);
CREATE INDEX IF NOT EXISTS idx_questions_template_visible ON dynamic_questions(template_id, default_visible);

CREATE INDEX IF NOT EXISTS idx_options_question_order ON answer_options(question_id, display_order);
CREATE UNIQUE INDEX IF NOT EXISTS idx_options_unique ON answer_options(question_id, option_value);

CREATE INDEX IF NOT EXISTS idx_rules_trigger_question ON conditional_rules(trigger_question_id);
CREATE INDEX IF NOT EXISTS idx_rules_template_priority ON conditional_rules(template_id, priority);
CREATE INDEX IF NOT EXISTS idx_rules_action_target ON conditional_rules(action, target_id);

CREATE INDEX IF NOT EXISTS idx_user_documents_user ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_template ON user_documents(template_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_status ON user_documents(document_status);
CREATE INDEX IF NOT EXISTS idx_user_documents_modified ON user_documents(last_modified_at DESC);

CREATE INDEX IF NOT EXISTS idx_answers_document ON user_answers(document_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON user_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_modified ON user_answers(modified_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_document ON wizard_sessions(document_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON wizard_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON wizard_sessions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON wizard_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_evaluations_session ON rule_evaluations(session_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_rule ON rule_evaluations(rule_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_time ON rule_evaluations(evaluated_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_document ON document_analytics(document_id);
CREATE INDEX IF NOT EXISTS idx_analytics_template ON document_analytics(template_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON document_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_generated ON document_analytics(analytics_generated_at DESC);

-- Views for common queries
CREATE OR REPLACE VIEW template_questions_view AS
SELECT 
  dt.template_id,
  dt.template_name,
  dq.question_id,
  dq.question_text,
  dq.question_type,
  dq.display_order,
  dq.is_required,
  dq.default_visible,
  COUNT(cr.rule_id) as rule_count
FROM dynamic_templates dt
LEFT JOIN dynamic_questions dq ON dt.template_id = dq.template_id
LEFT JOIN conditional_rules cr ON dq.question_id = cr.trigger_question_id
WHERE dt.is_active = true
GROUP BY dt.template_id, dt.template_name, dq.question_id, dq.question_text, 
         dq.question_type, dq.display_order, dq.is_required, dq.default_visible
ORDER BY dt.template_name, dq.display_order;

-- Document progress view
CREATE OR REPLACE VIEW document_progress_view AS
SELECT 
  ud.document_id,
  ud.user_id,
  ud.document_title,
  ud.document_status,
  ud.completion_percentage,
  dt.template_name,
  dt.category,
  COUNT(ua.answer_id) as answers_given,
  COUNT(dq.question_id) as total_questions,
  ud.last_modified_at
FROM user_documents ud
JOIN dynamic_templates dt ON ud.template_id = dt.template_id
LEFT JOIN dynamic_questions dq ON dt.template_id = dq.template_id AND dq.default_visible = true
LEFT JOIN user_answers ua ON ud.document_id = ua.document_id
GROUP BY ud.document_id, ud.user_id, ud.document_title, ud.document_status,
         ud.completion_percentage, dt.template_name, dt.category, ud.last_modified_at
ORDER BY ud.last_modified_at DESC;

-- RLS (Row Level Security) Policies
ALTER TABLE dynamic_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditional_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wizard_sessions ENABLE ROW LEVEL SECURITY;

-- Templates are public for reading (anyone can see available templates)
CREATE POLICY "Templates are publicly readable" ON dynamic_templates
  FOR SELECT USING (is_active = true);

-- Questions and rules are public for reading (part of template structure)
CREATE POLICY "Questions are publicly readable" ON dynamic_questions
  FOR SELECT USING (true);

CREATE POLICY "Answer options are publicly readable" ON answer_options
  FOR SELECT USING (true);

CREATE POLICY "Conditional rules are publicly readable" ON conditional_rules
  FOR SELECT USING (true);

-- User documents are private to the owner
CREATE POLICY "Users can manage their own documents" ON user_documents
  FOR ALL USING (auth.uid() = user_id);

-- User answers are private to the document owner
CREATE POLICY "Users can manage their own answers" ON user_answers
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_documents WHERE document_id = user_answers.document_id
    )
  );

-- Wizard sessions are private to the user
CREATE POLICY "Users can manage their own sessions" ON wizard_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Functions for common operations

-- Function to get next visible questions for a document
CREATE OR REPLACE FUNCTION get_visible_questions(doc_id UUID)
RETURNS TABLE (
  question_id UUID,
  question_text TEXT,
  question_type VARCHAR(50),
  is_required BOOLEAN,
  ui_config JSONB,
  options JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This is a simplified version. Full implementation would evaluate conditional rules.
  RETURN QUERY
  SELECT 
    dq.question_id,
    dq.question_text,
    dq.question_type,
    dq.is_required,
    dq.ui_config,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'value', ao.option_value,
          'label', ao.option_label,
          'description', ao.option_description
        )
        ORDER BY ao.display_order
      ) FILTER (WHERE ao.option_id IS NOT NULL),
      '[]'::jsonb
    ) as options
  FROM user_documents ud
  JOIN dynamic_templates dt ON ud.template_id = dt.template_id
  JOIN dynamic_questions dq ON dt.template_id = dq.template_id
  LEFT JOIN answer_options ao ON dq.question_id = ao.question_id AND ao.is_active = true
  WHERE ud.document_id = doc_id
    AND dq.default_visible = true
  GROUP BY dq.question_id, dq.question_text, dq.question_type, 
           dq.is_required, dq.ui_config, dq.display_order
  ORDER BY dq.display_order;
END;
$$;

-- Function to update document progress
CREATE OR REPLACE FUNCTION update_document_progress(doc_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_q INTEGER;
  answered_q INTEGER;
  progress INTEGER;
BEGIN
  -- Count total visible questions
  SELECT COUNT(*)
  INTO total_q
  FROM user_documents ud
  JOIN dynamic_questions dq ON ud.template_id = dq.template_id
  WHERE ud.document_id = doc_id AND dq.default_visible = true;
  
  -- Count answered questions
  SELECT COUNT(*)
  INTO answered_q
  FROM user_answers ua
  WHERE ua.document_id = doc_id AND ua.is_valid = true;
  
  -- Calculate progress
  progress := CASE 
    WHEN total_q > 0 THEN ROUND((answered_q::DECIMAL / total_q) * 100)
    ELSE 0
  END;
  
  -- Update document
  UPDATE user_documents 
  SET 
    completion_percentage = progress,
    questions_answered = answered_q,
    total_questions = total_q,
    last_modified_at = NOW(),
    document_status = CASE 
      WHEN progress = 100 THEN 'COMPLETED'
      WHEN progress > 0 THEN 'IN_PROGRESS'
      ELSE 'DRAFT'
    END
  WHERE document_id = doc_id;
END;
$$;

-- Trigger to auto-update document progress when answers change
CREATE OR REPLACE FUNCTION trigger_update_document_progress()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update progress for the affected document
  PERFORM update_document_progress(COALESCE(NEW.document_id, OLD.document_id));
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER user_answers_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_answers
  FOR EACH ROW EXECUTE FUNCTION trigger_update_document_progress();

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_dynamic_templates_active ON dynamic_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_dynamic_questions_template_type ON dynamic_questions(template_id, question_type);
CREATE INDEX IF NOT EXISTS idx_user_documents_user_status ON user_documents(user_id, document_status);
CREATE INDEX IF NOT EXISTS idx_user_answers_document_valid ON user_answers(document_id, is_valid);
CREATE INDEX IF NOT EXISTS idx_wizard_sessions_active ON wizard_sessions(user_id, expires_at);

COMMENT ON TABLE dynamic_templates IS 'LawDepot-style document templates with dynamic question flow';
COMMENT ON TABLE dynamic_questions IS 'Questions within templates that can show/hide based on conditional rules';
COMMENT ON TABLE conditional_rules IS 'Rules that control dynamic question visibility and behavior';
COMMENT ON TABLE user_documents IS 'User-generated documents based on templates';
COMMENT ON TABLE user_answers IS 'User answers to template questions';
COMMENT ON TABLE wizard_sessions IS 'Active wizard sessions with state management';