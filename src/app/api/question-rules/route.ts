import { NextResponse } from "next/server";
import { questionRuleInputSchema } from "@/features/admin/question-rules/schema";
import { requireExpertApi } from "@/server/api/require-expert";
import { questionRuleRepository } from "@/server/repositories/question-rules";

export async function GET() {
  const auth = await requireExpertApi();
  if (auth.response) return auth.response;
  const rules = await questionRuleRepository().list();
  return NextResponse.json({ rules }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await requireExpertApi();
  if (auth.response) return auth.response;
  const parsed = questionRuleInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "입력 내용을 확인해 주세요.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  const rule = await questionRuleRepository().create(parsed.data);
  return NextResponse.json({ rule }, { status: 201 });
}
