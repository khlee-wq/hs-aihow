export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      question_rules: {
        Row: { id: string; title: string; school: string; category: string; status: "draft" | "review" | "approved"; examples: number; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; school: string; category: string; status?: "draft" | "review" | "approved"; examples?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { title?: string; school?: string; category?: string; status?: "draft" | "review" | "approved"; examples?: number; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
