type OmitKeys<T, K extends keyof T> = Omit<T, K>;

export function omit<T, K extends keyof T>(
  obj: T,
  keysToOmit: K[]
): OmitKeys<T, K> {
  const result = {...obj} as OmitKeys<T, K>;

  for (const key of keysToOmit) {
    // biome-ignore lint:
    delete (result as any)[key];
  }

  return result;
}
