type OmitProperties<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

export function omit<T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): OmitProperties<T, K> {
  const result = {} as OmitProperties<T, K>;

  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      result[key] = obj[key];
    }
  }

  return result;
}
