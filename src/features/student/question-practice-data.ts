export type QuestionPriority = {
  id: string;
  rank: 1 | 2 | 3 | 4;
  label: string;
  shortLabel: string;
  intent: string;
  question: string;
  guide: string;
  checkpoints: string[];
};

export type QuestionTrack = {
  id: string;
  category: string;
  title: string;
  summary: string;
  source: string;
  importance: "필수" | "중요";
  priorities: QuestionPriority[];
};

export const questionTracks: QuestionTrack[] = [
  {
    id: "motivation",
    category: "지원 동기",
    title: "학교와 내 경험 연결하기",
    summary:
      "학교 소개를 외우는 답이 아니라, 내 경험이 다음 선택으로 이어진 이유를 확인합니다.",
    source: "자소서 1번 · 과학 동아리 실험 설계",
    importance: "필수",
    priorities: [
      {
        id: "motivation-scene",
        rank: 1,
        label: "경험 확인",
        shortLabel: "장면",
        intent: "답변의 출발점이 되는 실제 장면을 확인해요.",
        question:
          "과학 동아리 활동에서 가장 오래 고민했던 한 장면을 설명해 보세요.",
        guide:
          "상황을 길게 설명하기보다, 당시 마주한 문제와 내가 한 행동을 먼저 말해 보세요.",
        checkpoints: ["문제가 생긴 시점", "내가 맡은 역할", "직접 한 행동"],
      },
      {
        id: "motivation-choice",
        rank: 2,
        label: "선택의 이유",
        shortLabel: "이유",
        intent: "행동 뒤에 있었던 판단 기준을 한 단계 더 물어요.",
        question:
          "여러 해결 방법 중 기록 방식을 다시 점검하기로 한 이유는 무엇인가요?",
        guide:
          "결과론적으로 말하지 말고, 그때 확인할 수 있었던 정보와 선택 기준을 구분해 보세요.",
        checkpoints: ["고려한 대안", "선택 기준", "포기한 방법"],
      },
      {
        id: "motivation-school",
        rank: 3,
        label: "학교 연결",
        shortLabel: "연결",
        intent: "내 경험과 지원 학교의 환경이 실제로 이어지는지 확인해요.",
        question: "그 탐구 방식을 민사고의 어떤 환경에서 더 발전시키고 싶나요?",
        guide:
          "학교의 프로그램 이름보다, 그 환경에서 내가 이어갈 질문과 행동을 말해 보세요.",
        checkpoints: [
          "학교 환경 한 가지",
          "이어갈 탐구 질문",
          "구체적인 다음 행동",
        ],
      },
      {
        id: "motivation-counter",
        rank: 4,
        label: "관점 확장",
        shortLabel: "확장",
        intent: "익숙한 답을 벗어나도 판단 기준이 유지되는지 살펴봐요.",
        question:
          "원하는 탐구 환경이 기대와 다르다면, 스스로 어떤 기회를 만들어 보겠나요?",
        guide:
          "시설이나 프로그램에 의존하지 않고도 이어갈 수 있는 실행 방법을 제시해 보세요.",
        checkpoints: ["예상 밖의 상황", "스스로 만들 기회", "지속할 기준"],
      },
    ],
  },
  {
    id: "inquiry",
    category: "탐구 태도",
    title: "결과보다 판단 과정 설명하기",
    summary:
      "정답을 맞힌 경험보다, 예상 밖의 결과를 어떻게 해석하고 다음 행동을 정했는지 묻습니다.",
    source: "자소서 1번 · 수질에 따른 식물 생장 실험",
    importance: "필수",
    priorities: [
      {
        id: "inquiry-change",
        rank: 1,
        label: "변화 포착",
        shortLabel: "변화",
        intent: "예상과 실제 결과가 달랐던 지점을 정확히 짚어요.",
        question:
          "실험 결과가 처음 예상과 어떻게 달랐는지 구체적으로 말해 보세요.",
        guide:
          "‘실패했다’고 요약하지 말고, 관찰값과 예상값의 차이를 말해 보세요.",
        checkpoints: ["처음 예상", "실제 관찰", "차이를 발견한 순간"],
      },
      {
        id: "inquiry-decision",
        rank: 2,
        label: "판단 기준",
        shortLabel: "판단",
        intent: "다음 행동을 고른 근거가 무엇이었는지 확인해요.",
        question:
          "온도와 빛의 양부터 다시 기록한 순서는 어떤 기준으로 정했나요?",
        guide:
          "가장 의심한 변인과 그 변인을 먼저 확인할 수 있었던 근거를 연결하세요.",
        checkpoints: ["우선순위", "판단 근거", "확인 순서"],
      },
      {
        id: "inquiry-verify",
        rank: 3,
        label: "검증 방식",
        shortLabel: "검증",
        intent: "내 해석이 맞는지 어떤 방식으로 확인했는지 물어요.",
        question: "수정한 가설이 더 타당하다고 판단한 근거는 무엇이었나요?",
        guide:
          "느낌이나 결과 하나가 아니라, 비교한 기록과 반복 여부를 포함해 보세요.",
        checkpoints: ["비교한 데이터", "반복 과정", "판단의 한계"],
      },
      {
        id: "inquiry-transfer",
        rank: 4,
        label: "새 문제 적용",
        shortLabel: "적용",
        intent: "배운 기준을 새로운 상황에도 적용할 수 있는지 확인해요.",
        question:
          "같은 문제가 다른 탐구에서 생긴다면 처음부터 무엇을 다르게 기록하겠나요?",
        guide:
          "배운 점을 추상적으로 말하지 말고, 다음 실험의 기록 항목으로 바꿔 말해 보세요.",
        checkpoints: ["바꿀 기록 항목", "바꾸는 이유", "기대 효과"],
      },
    ],
  },
  {
    id: "collaboration",
    category: "협업 경험",
    title: "의견 차이 속 내 행동 보여주기",
    summary:
      "‘잘 협력했다’는 결론 대신, 의견이 갈린 순간의 말과 선택을 차례대로 확인합니다.",
    source: "자소서 2번 · 교내 환경 프로젝트",
    importance: "중요",
    priorities: [
      {
        id: "collaboration-conflict",
        rank: 1,
        label: "의견 차이",
        shortLabel: "차이",
        intent: "갈등을 과장하지 않고 실제 쟁점을 분명하게 만들어요.",
        question: "팀원과 의견이 가장 크게 달랐던 지점은 무엇이었나요?",
        guide:
          "누가 옳았는지보다, 서로 중요하게 본 기준이 무엇이었는지 말해 보세요.",
        checkpoints: ["공통 목표", "서로 다른 기준", "당시 내 입장"],
      },
      {
        id: "collaboration-action",
        rank: 2,
        label: "조정 행동",
        shortLabel: "행동",
        intent: "상황을 바꾸기 위해 내가 실제로 한 행동을 확인해요.",
        question:
          "상대 의견을 이해하기 위해 어떤 질문을 했고, 내 계획을 무엇을 바꿨나요?",
        guide:
          "‘대화했다’고 줄이지 말고, 했던 질문과 바뀐 계획을 각각 한 문장으로 말해 보세요.",
        checkpoints: ["직접 한 질문", "새로 알게 된 점", "바꾼 행동"],
      },
      {
        id: "collaboration-result",
        rank: 3,
        label: "변화 확인",
        shortLabel: "결과",
        intent: "협업 방식의 변화가 결과에 어떤 영향을 주었는지 살펴봐요.",
        question:
          "의견을 조정한 뒤 프로젝트의 진행 방식이나 결과가 어떻게 달라졌나요?",
        guide:
          "좋아졌다는 평가 대신, 일정·역할·결과 중 확인 가능한 변화를 골라 말해 보세요.",
        checkpoints: ["전후 차이", "확인 가능한 결과", "내 기여 범위"],
      },
      {
        id: "collaboration-reflect",
        rank: 4,
        label: "역할 성찰",
        shortLabel: "성찰",
        intent: "같은 상황에서 더 나은 선택을 할 수 있는지 확인해요.",
        question:
          "지금 다시 팀을 이끈다면 가장 먼저 바꾸고 싶은 행동은 무엇인가요?",
        guide:
          "아쉬움을 말하는 데서 끝내지 말고, 다음 팀 활동에서 사용할 방법까지 연결하세요.",
        checkpoints: ["아쉬웠던 행동", "바꿀 방법", "적용 시점"],
      },
    ],
  },
];

export const totalQuestionPriorities = questionTracks.reduce(
  (total, track) => total + track.priorities.length,
  0,
);
