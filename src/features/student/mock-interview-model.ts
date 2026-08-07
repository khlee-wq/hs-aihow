export type PersonaId = "coach" | "panel" | "pressure";

export type InterviewScore = {
  evidence: number;
  judgment: number;
  delivery: number;
};

export type InterviewFeedback = {
  summary: string;
  strength: string;
  next: string;
  scores: InterviewScore;
};

export type InterviewPersona = {
  id: PersonaId;
  name: string;
  description: string;
  pace: string;
  tone: string;
  voiceRate: number;
  voicePitch: number;
};

export type InterviewQuestion = {
  id: string;
  year: 2024 | 2025 | 2026;
  type: string;
  personaId: PersonaId;
  timeLimitSeconds: 120;
  prompt: string;
  focus: string;
  answerGuide: string[];
  feedback: InterviewFeedback;
  followUp: {
    prompt: string;
    triggerQuote: string;
    answerGuide: string[];
    feedback: InterviewFeedback;
  };
};

export type InterviewTurnKind = "main" | "follow-up";

/**
 * 음성 전사와 AI 평가가 연결될 때 그대로 저장할 수 있는 한 번의 문답 단위입니다.
 * 지금은 목 피드백을 사용하고, 추후 transcript와 실제 평가 결과만 교체합니다.
 */
export type InterviewTurnResult = {
  questionId: string;
  kind: InterviewTurnKind;
  personaId: PersonaId;
  prompt: string;
  transcript: string;
  durationSeconds: number;
  feedback: InterviewFeedback;
};

export type InterviewSessionResult = {
  schoolSlug: "minsago";
  sourceYears: Array<2024 | 2025 | 2026>;
  turns: InterviewTurnResult[];
  overallScores: InterviewScore;
  completedAt: string;
};

export const interviewPersonas: InterviewPersona[] = [
  {
    id: "coach",
    name: "진행 위원",
    description: "학생의 답을 끝까지 듣고, 경험의 장면을 차분히 끌어내요.",
    pace: "여유",
    tone: "차분함",
    voiceRate: 0.92,
    voicePitch: 1.02,
  },
  {
    id: "panel",
    name: "탐구 위원",
    description: "말한 내용의 근거와 판단 기준을 구체적으로 확인해요.",
    pace: "보통",
    tone: "논리적",
    voiceRate: 1,
    voicePitch: 0.94,
  },
  {
    id: "pressure",
    name: "확장 위원",
    description: "조건을 빠르게 바꾸며 낯선 상황에서도 생각을 이어가게 해요.",
    pace: "빠름",
    tone: "기민함",
    voiceRate: 1.08,
    voicePitch: 0.88,
  },
];

export const minsagoInterviewQuestions: InterviewQuestion[] = [
  {
    id: "judgment-2024",
    year: 2024,
    type: "탐구 판단",
    personaId: "panel",
    timeLimitSeconds: 120,
    prompt:
      "과학 동아리의 실험 결과가 예상과 달랐을 때, 무엇을 기준으로 다음 행동을 결정했나요?",
    focus: "예상과 다른 결과 앞에서 판단 기준을 설명하는 연습",
    answerGuide: ["달라진 결과", "판단 기준", "직접 한 행동"],
    feedback: {
      summary: "결과보다 판단 과정을 먼저 설명해 탐구 태도가 선명했어요.",
      strength: "관찰과 행동을 연결했어요.",
      next: "기준을 선택한 이유를 한 문장 더 보태 보세요.",
      scores: { evidence: 88, judgment: 84, delivery: 82 },
    },
    followUp: {
      prompt:
        "다시 실험할 시간이 없었다면, 어떤 기록을 근거로 결론을 내렸을까요?",
      triggerQuote: "기록을 다시 확인했다고 말했어요.",
      answerGuide: ["남아 있는 기록", "우선 확인할 항목", "결론의 한계"],
      feedback: {
        summary: "제한된 조건에서도 근거의 우선순위를 세웠어요.",
        strength: "결론의 한계까지 인정했어요.",
        next: "가장 먼저 볼 기록을 하나로 좁혀 보세요.",
        scores: { evidence: 86, judgment: 90, delivery: 80 },
      },
    },
  },
  {
    id: "collaboration-2024",
    year: 2024,
    type: "협업 판단",
    personaId: "coach",
    timeLimitSeconds: 120,
    prompt:
      "팀의 의견이 둘로 갈렸던 순간, 합의를 위해 가장 먼저 한 행동은 무엇인가요?",
    focus: "갈등을 해결한 구체적인 행동을 보여주는 연습",
    answerGuide: ["갈린 의견", "내가 한 행동", "달라진 결과"],
    feedback: {
      summary: "갈등 상황과 자신의 역할을 차분히 구분했어요.",
      strength: "상대의 의견을 먼저 확인했어요.",
      next: "합의 뒤 달라진 팀의 행동을 덧붙여 보세요.",
      scores: { evidence: 82, judgment: 85, delivery: 88 },
    },
    followUp: {
      prompt: "끝까지 반대하는 팀원이 있었다면, 결정은 그대로 밀고 갔을까요?",
      triggerQuote: "모두의 동의를 얻었다고 말했어요.",
      answerGuide: ["반대 이유", "지킬 기준", "결정 방식"],
      feedback: {
        summary: "합의와 결정의 차이를 구분해 답했어요.",
        strength: "반대 의견을 배제하지 않았어요.",
        next: "최종 결정 기준을 더 짧게 말해 보세요.",
        scores: { evidence: 80, judgment: 87, delivery: 86 },
      },
    },
  },
  {
    id: "school-fit-2025",
    year: 2025,
    type: "학교 연결",
    personaId: "panel",
    timeLimitSeconds: 120,
    prompt:
      "지금까지의 경험 중 민사고에서 더 깊게 이어가고 싶은 한 가지는 무엇인가요?",
    focus: "자신의 경험과 지원 학교를 자연스럽게 연결하는 연습",
    answerGuide: ["실제 경험", "더 알고 싶은 점", "학교에서의 행동"],
    feedback: {
      summary: "지원 이유를 자신의 경험에서 출발해 설명했어요.",
      strength: "학교 이름보다 하고 싶은 행동이 먼저 나왔어요.",
      next: "첫 학기에 실행할 장면을 하나 더 그려 보세요.",
      scores: { evidence: 89, judgment: 81, delivery: 84 },
    },
    followUp: {
      prompt:
        "기대했던 환경이 실제와 다르다면, 그 관심을 어떻게 이어갈 건가요?",
      triggerQuote: "학교의 탐구 환경을 기대한다고 말했어요.",
      answerGuide: ["달라질 조건", "내가 할 수 있는 일", "이어갈 방법"],
      feedback: {
        summary: "환경에 기대기보다 스스로 시작할 방법을 찾았어요.",
        strength: "주도적인 행동이 드러났어요.",
        next: "함께할 사람을 어떻게 찾을지도 말해 보세요.",
        scores: { evidence: 84, judgment: 86, delivery: 83 },
      },
    },
  },
  {
    id: "value-choice-2025",
    year: 2025,
    type: "가치 선택",
    personaId: "pressure",
    timeLimitSeconds: 120,
    prompt:
      "좋은 결과를 위해 정해진 방식을 바꿔야 했던 순간이 있나요? 무엇을 지키고 무엇을 바꿨나요?",
    focus: "빠르게 바뀌는 조건에서 가치와 판단을 설명하는 연습",
    answerGuide: ["지킨 원칙", "바꾼 방식", "결과와 배움"],
    feedback: {
      summary: "원칙과 방법을 구분해 선택의 이유가 또렷했어요.",
      strength: "결과만으로 결정을 정당화하지 않았어요.",
      next: "선택의 손해도 함께 말하면 더 진솔해져요.",
      scores: { evidence: 81, judgment: 91, delivery: 79 },
    },
    followUp: {
      prompt:
        "그 선택으로 팀 전체의 성과가 낮아진다면, 같은 결정을 다시 할 건가요?",
      triggerQuote: "과정보다 원칙을 지켰다고 말했어요.",
      answerGuide: ["바뀐 조건", "다시 볼 기준", "새로운 결정"],
      feedback: {
        summary: "조건이 바뀌어도 판단의 축을 유지했어요.",
        strength: "새로운 정보에 따라 결정을 조정했어요.",
        next: "대안까지 한 문장으로 제시해 보세요.",
        scores: { evidence: 78, judgment: 92, delivery: 82 },
      },
    },
  },
  {
    id: "transfer-2026",
    year: 2026,
    type: "배움의 확장",
    personaId: "coach",
    timeLimitSeconds: 120,
    prompt:
      "실패했던 경험에서 얻은 기준을 새로운 문제에 적용한 사례를 말해 주세요.",
    focus: "배운 점을 다른 상황의 행동으로 옮기는 연습",
    answerGuide: ["실패한 장면", "새로 얻은 기준", "달라진 행동"],
    feedback: {
      summary: "실패를 감상이 아니라 다음 행동의 기준으로 바꿨어요.",
      strength: "두 경험의 공통점을 정확히 짚었어요.",
      next: "적용 전후의 차이를 숫자나 장면으로 보여주세요.",
      scores: { evidence: 87, judgment: 88, delivery: 87 },
    },
    followUp: {
      prompt: "내일부터 같은 기준을 다시 실천한다면 가장 먼저 무엇을 하겠어요?",
      triggerQuote: "지금도 그 기준을 지킨다고 말했어요.",
      answerGuide: ["내일의 상황", "첫 행동", "확인 방법"],
      feedback: {
        summary: "배움을 즉시 실행 가능한 행동으로 좁혔어요.",
        strength: "확인 방법까지 제시했어요.",
        next: "첫 행동을 더 간결하게 말해 보세요.",
        scores: { evidence: 86, judgment: 87, delivery: 90 },
      },
    },
  },
];
