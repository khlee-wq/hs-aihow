import type { DashboardSnapshot } from "./dashboard-model";

export type InterestSchool = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  aliases: string[];
  latestAdmissions: {
    year: string;
    applicants: number;
    capacity: number;
  };
};

// 원본 입시 자료는 클라이언트에 두지 않습니다. 이 목록은 선택 UI와 이후
// 데이터 연결 계약을 위한 화면용 목 데이터입니다.
export const interestSchools: InterestSchool[] = [
  {
    id: "minsago",
    name: "민족사관고등학교",
    shortName: "민사고",
    category: "전국단위 자사고",
    aliases: ["민사고", "민족사관", "민족사관고"],
    latestAdmissions: { year: "2026", applicants: 214, capacity: 96 },
  },
  {
    id: "hanil",
    name: "한일고등학교",
    shortName: "한일고",
    category: "전국단위 자사고",
    aliases: ["한일", "한일고"],
    latestAdmissions: { year: "2026", applicants: 178, capacity: 80 },
  },
  {
    id: "hana",
    name: "하나고등학교",
    shortName: "하나고",
    category: "자율형 사립고",
    aliases: ["하나", "하나고"],
    latestAdmissions: { year: "2026", applicants: 262, capacity: 200 },
  },
  {
    id: "sangsan",
    name: "상산고등학교",
    shortName: "상산고",
    category: "자율형 사립고",
    aliases: ["상산", "상산고"],
    latestAdmissions: { year: "2026", applicants: 301, capacity: 336 },
  },
  {
    id: "foreign-language",
    name: "대원외국어고등학교",
    shortName: "대원외고",
    category: "외국어고",
    aliases: ["대원", "대원외고", "외고"],
    latestAdmissions: { year: "2026", applicants: 352, capacity: 250 },
  },
];

const normalize = (value: string) => value.replaceAll(/\s/g, "").toLowerCase();

export function findInterestSchools(query: string) {
  const keyword = normalize(query);
  if (!keyword) return interestSchools.slice(0, 4);

  return interestSchools.filter((school) =>
    [school.name, school.shortName, school.category, ...school.aliases].some(
      (value) => normalize(value).includes(keyword),
    ),
  );
}

export function applyInterestSchool(
  snapshot: DashboardSnapshot,
  school: InterestSchool,
): DashboardSnapshot {
  return {
    ...snapshot,
    school: school.name,
    schoolShort: school.shortName,
    admissionsOutlook: snapshot.admissionsOutlook
      ? {
          ...snapshot.admissionsOutlook,
          category: school.category,
          latestAdmissions: school.latestAdmissions,
        }
      : null,
  };
}
