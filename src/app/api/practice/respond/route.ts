import { NextResponse } from "next/server";
import { questionPracticeRequestSchema } from "@/features/student/question-practice-schema";
import { getSession } from "@/lib/session";
import { questionPracticeEngine } from "@/server/question-practice/engine";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { message: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  const parsed = questionPracticeRequestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { message: "답변 내용을 확인해 주세요." },
      { status: 400 },
    );
  }

  const result = await questionPracticeEngine().evaluate(parsed.data);
  if (!result) {
    return NextResponse.json(
      { message: "질문 단계를 찾지 못했습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
