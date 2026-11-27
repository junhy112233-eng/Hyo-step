export interface PrivacyCheckResult {
  hasPersonalInfo: boolean;
  reasons: string[];
  message: string;
}

const PRIVACY_WARNING =
  'Please do not write your real name, school, phone number, or address. Remove personal information and try again.';

const KOREAN_SURNAMES =
  'kim|lee|park|choi|jung|jeong|kang|cho|yoon|yun|jang|lim|im|han|oh|seo|shin|kwon|hwang|ahn|song|jeon|hong|ryu|ko|moon|yang|son|bae|baek|heo|nam|sim|noh|ha|kwak|sung|cha|woo|min|jin|joo';

const PATTERNS: Array<{ label: string; regex: RegExp }> = [
  {
    label: 'real name',
    regex: /\b(my\s+name\s+is|call\s+me)\b/i,
  },
  {
    label: 'full name',
    regex: new RegExp(`\\b(${KOREAN_SURNAMES})\\s+[a-z]{2,}\\b`, 'i'),
  },
  {
    label: 'full name',
    regex: new RegExp(`\\b[A-Z][a-z]{1,}\\s+(${KOREAN_SURNAMES})\\b`, 'i'),
  },
  {
    label: 'Korean name phrase',
    regex: /(내\s*이름|제\s*이름은|이름은\s*[가-힣]{2,4})/i,
  },
  {
    label: 'school name',
    regex: /\b[a-z]+\s+(middle|elementary|high|primary)\s+school\b/i,
  },
  {
    label: 'school phrase',
    regex: /\bi\s+(go\s+to|attend)\s+[a-z\s]{2,30}school\b/i,
  },
  {
    label: 'Korean school name',
    regex: /[가-힣]+(중학교|초등학교|고등학교)/,
  },
  {
    label: 'phone number',
    regex: /\b01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}\b/,
  },
  {
    label: 'phone number',
    regex: /\b\d{2,3}[-\s.]\d{3,4}[-\s.]\d{4}\b/,
  },
  {
    label: 'long number',
    regex: /\b\d{8,12}\b/,
  },
  {
    label: 'phone phrase',
    regex: /\b(my\s+phone\s+number|phone\s+number\s+is|call\s+me\s+at)\b/i,
  },
  {
    label: 'email address',
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  },
  {
    label: 'home address',
    regex: /\b(my\s+address\s+is|i\s+live\s+at\s+\d+)\b/i,
  },
  {
    label: 'street address',
    regex: /\b\d+\s+[a-z]+\s+(street|st\.?|avenue|ave\.?|road|rd\.?|blvd|lane|ro|gil)\b/i,
  },
  {
    label: 'district or apartment address',
    regex: /\b[a-z]+-(gu|si|dong|ro|gil)\b/i,
  },
  {
    label: 'Korean address',
    regex: /(아파트\s*\d+동|\d+동\s*\d+호|번지|집\s*주소)/,
  },
];

export function checkPrivacy(text: string): PrivacyCheckResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { hasPersonalInfo: false, reasons: [], message: '' };
  }

  const reasons = new Set<string>();
  for (const item of PATTERNS) {
    if (item.regex.test(trimmed)) {
      reasons.add(item.label);
    }
  }

  if (reasons.size > 0) {
    return {
      hasPersonalInfo: true,
      reasons: Array.from(reasons),
      message: PRIVACY_WARNING,
    };
  }

  return { hasPersonalInfo: false, reasons: [], message: '' };
}
