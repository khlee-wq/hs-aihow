import { NextResponse } from "next/server";
import { questionRulePatchSchema } from "@/features/admin/question-rules/schema";
import { requireExpertApi } from "@/server/api/require-expert";
import { questionRuleRepository } from "@/server/repositories/question-rules";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireExpertApi();
  if (auth.response) return auth.response;
  const parsed = questionRulePatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "변경 내용을 확인해 주세요.", issues: parsed.error.flatten().fieldErrors }, { status: 400 });
  const { id } = await params;
  const rule = await questionRuleRepository().update(id, parsed.data);
  if (!rule) return NextResponse.json({ message: "질문 기준을 찾지 못했습니다." }, { status: 404 });
  return NextResponse.json({ rule });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireExpertApi();
  if (auth.response) return auth.response;
  const { id } = await params;
  const removed = await questionRuleRepository().delete(id);
  if (!removed) return NextResponse.json({ message: "질문 기준을 찾지 못했습니다." }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
