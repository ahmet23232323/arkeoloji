export interface Database {
  public: {
    Tables: {
      ancient_scripts: {
        Row: {
          id: string;
          name: string;
          code: string;
          period: string;
          region: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          period: string;
          region: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          period?: string;
          region?: string;
          description?: string;
          created_at?: string;
        };
      };
      translations: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          image_url: string;
          script_id?: string | null;
          original_text?: string;
          translated_text?: string;
          confidence_score?: number;
          analysis_data?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          image_url?: string;
          script_id?: string | null;
          original_text?: string;
          translated_text?: string;
          confidence_score?: number;
          analysis_data?: Record<string, any>;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          translation_id: string;
          user_id: string | null;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          translation_id: string;
          user_id?: string | null;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          translation_id?: string;
          user_id?: string | null;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
