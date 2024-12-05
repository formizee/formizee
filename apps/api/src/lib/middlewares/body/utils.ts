export const supportedContentTypes = [
  'application/json',
  'application/x-www-form-urlencoded',
  'multipart/form-data'
] as const;

export type ContentType =
  (typeof supportedContentTypes)[keyof typeof supportedContentTypes];

type ValidatedContentType =
  | {contentType: ContentType; valid: true}
  | {contentType: null; valid: false};

export const validateContentType = (
  contentType: string | undefined
): ValidatedContentType => {
  if (contentType === undefined) {
    return {contentType: null, valid: false};
  }

  for (const type of supportedContentTypes) {
    if (contentType.includes(type)) {
      return {contentType: type, valid: true};
    }
  }
  return {contentType: null, valid: false};
};
