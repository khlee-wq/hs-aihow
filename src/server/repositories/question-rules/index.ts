import "server-only";

import { serverEnv } from "@/lib/env";
import { DemoQuestionRuleRepository } from "./demo";
import { SupabaseQuestionRuleRepository } from "./supabase";

const demoRepository = new DemoQuestionRuleRepository();
const supabaseRepository = new SupabaseQuestionRuleRepository();

export function questionRuleRepository() {
  return serverEnv().DATA_BACKEND === "supabase" ? supabaseRepository : demoRepository;
}
