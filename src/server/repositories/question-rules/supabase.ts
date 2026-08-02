import "server-only";

import type { QuestionRule, QuestionRuleInput } from "@/features/admin/question-rules/schema";
import type { Database } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuestionRuleRepository } from "./types";

function mapRule(row: Database["public"]["Tables"]["question_rules"]["Row"]): QuestionRule {
  return { id: row.id, title: row.title, school: row.school, category: row.category, status: row.status, examples: row.examples, updatedAt: row.updated_at };
}

export class SupabaseQuestionRuleRepository implements QuestionRuleRepository {
  async list() {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.from("question_rules").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    return data.map(mapRule);
  }

  async create(input: QuestionRuleInput) {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.from("question_rules").insert(input).select().single();
    if (error) throw error;
    return mapRule(data);
  }

  async update(id: string, input: Partial<QuestionRuleInput>) {
    const client = await createSupabaseServerClient();
    const { data, error } = await client.from("question_rules").update(input).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return data ? mapRule(data) : null;
  }

  async delete(id: string) {
    const client = await createSupabaseServerClient();
    const { error, count } = await client.from("question_rules").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }
}
