const base64abc = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '+',
  '/'
];

/**
 * Encodes a given Uint8Array, ArrayBuffer or string into RFC4648 base64 representation
 * @param data
 */
function encode(data: ArrayBuffer | string): string {
  let bytes: Uint8Array;

  if (typeof data === 'string') {
    bytes = new TextEncoder().encode(data);
  } else if (data instanceof ArrayBuffer) {
    bytes = new Uint8Array(data);
  } else {
    throw new Error('Unsupported data type');
  }

  let base64 = '';
  const len = bytes.length;
  for (let i = 0; i < len; i += 3) {
    const a = bytes[i] ?? 0;
    const b = (i + 1 < len ? bytes[i + 1] : 0) ?? 0;
    const c = (i + 2 < len ? bytes[i + 2] : 0) ?? 0;

    const triplet = (a << 16) | (b << 8) | c;

    base64 += base64abc[(triplet >> 18) & 0x3f];
    base64 += base64abc[(triplet >> 12) & 0x3f];
    base64 += i + 1 < len ? base64abc[(triplet >> 6) & 0x3f] : '=';
    base64 += i + 2 < len ? base64abc[triplet & 0x3f] : '=';
  }

  return base64;
}

/**
 * Decodes a given RFC4648 base64 encoded string
 * @param b64
 */
function decode(b64: string): Uint8Array {
  const binString = atob(b64);
  const size = binString.length;
  const bytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

export const base64 = {
  encode,
  decode
};
