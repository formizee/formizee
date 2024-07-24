import { sha256 } from "@formizee/hashing";
import { KeyV1 } from "./v1";

export async function newKey(): Promise<{
  key: string;
  hash: string;
  start: string;
}> {
  const prefix = 'fz';
  const key = new KeyV1({ byteLength: 13, prefix }).toString();
  const start = key.slice(0, (prefix.length ?? 0) + 5);
  const hash = await sha256(key);

  return { key, hash, start };
}
