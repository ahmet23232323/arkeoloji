export interface AncientScript {
  id: string;
  name: string;
  code: string;
  period: string;
  region: string;
  description: string;
  created_at: string;
}

export interface Translation {
  id: string;
  user_id: string | null;
  image_url: string;
  script_id: string | null;
  original_text: string;
  translated_text: string;
  confidence_score: number;
  analysis_data: Record<string, any>;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  ancient_scripts?: AncientScript;
}

export interface Comment {
  id: string;
  translation_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisResult {
  scriptType: string;
  originalText: string;
  translation: string;
  period: string;
  region: string;
  confidence: number;
  notes: string;
}
