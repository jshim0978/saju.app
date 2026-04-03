import { SAJU_REFS } from './saju-references';

type SajuRefTopic = keyof typeof SAJU_REFS;

const DAY_MASTER_NAMES = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;

export function getRelevantRefs(options: {
  dayMaster: number;
  topics: string[];
  maxRefs?: number;
}): string {
  const { dayMaster, topics, maxRefs = 15 } = options;
  const dmName = DAY_MASTER_NAMES[dayMaster] || '';

  const collected: string[] = [];

  for (const topic of topics) {
    const refs = SAJU_REFS[topic as SajuRefTopic];
    if (!refs) continue;

    // Prioritize day-master-specific references
    const dmSpecific: string[] = [];
    const generic: string[] = [];

    for (const ref of refs) {
      if (dmName && ref.includes(dmName)) {
        dmSpecific.push(ref);
      } else {
        generic.push(ref);
      }
    }

    // Add day-master-specific refs first, then generic
    for (const r of dmSpecific) {
      if (!collected.includes(r)) collected.push(r);
    }
    for (const r of generic) {
      if (!collected.includes(r)) collected.push(r);
    }
  }

  // Limit to maxRefs
  const selected = collected.slice(0, maxRefs);

  if (selected.length === 0) return '';

  let result = '=== 참고 명리학 지식 (자연스럽게 녹여서 해석해. 원문 인용 최소화!) ===\n';
  for (let i = 0; i < selected.length; i++) {
    result += (i + 1) + '. ' + selected[i] + '\n';
  }
  result += '\n';

  return result;
}
