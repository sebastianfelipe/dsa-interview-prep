/** Map ASCII digits to Unicode superscripts / subscripts. */
const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  n: 'ⁿ',
  N: 'ᴺ',
  k: 'ᵏ',
  m: 'ᵐ',
  h: 'ʰ',
  L: 'ᴸ',
  x: 'ˣ',
};

const SUBSCRIPT: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  n: 'ₙ',
  k: 'ₖ',
  i: 'ᵢ',
  j: 'ⱼ',
  m: 'ₘ',
  x: 'ₓ',
};

function toSuper(token: string): string {
  return [...token].map((ch) => SUPERSCRIPT[ch] ?? ch).join('');
}

function toSub(token: string): string {
  return [...token].map((ch) => SUBSCRIPT[ch] ?? ch).join('');
}

/**
 * Normalize Big-O style strings to the studio Unicode style used in solutions.json
 * (e.g. O(n^2) → O(n²), O(log10 x) / O(log_10 x) → O(log₁₀ x)).
 */
export function formatComplexity(input: string | null | undefined): string | undefined {
  if (!input) return undefined;
  let s = input.trim();
  if (!s) return undefined;

  // Drop light LaTeX wrappers the model sometimes emits.
  s = s.replace(/\$([^$]+)\$/g, '$1').replace(/\\mathrm\{([^}]+)\}/g, '$1');

  // log_10 / log_{10} / log10 → log₁₀ (also log2, log_n, …)
  s = s.replace(/\blog_\{([0-9A-Za-z]+)\}/g, (_, base: string) => `log${toSub(base)}`);
  s = s.replace(/\blog_([0-9A-Za-z]+)/g, (_, base: string) => `log${toSub(base)}`);
  s = s.replace(/\blog([0-9]+)\b/g, (_, base: string) => `log${toSub(base)}`);

  // a^{n} / a^n / a^10 → superscripts
  s = s.replace(/\^\{([0-9A-Za-z+-]+)\}/g, (_, exp: string) => toSuper(exp));
  s = s.replace(/\^([0-9A-Za-z+-]+)/g, (_, exp: string) => toSuper(exp));

  // ASCII / LaTeX multiply → middle dot (house style: n · m)
  s = s.replace(/\s*(?:\\cdot|\*|×)\s*/g, ' · ');
  s = s.replace(/\s{2,}/g, ' ').trim();

  return s;
}
