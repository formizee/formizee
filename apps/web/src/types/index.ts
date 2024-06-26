export type ActionState =
  | {
      code: 'SUCCESS';
      title: string;
      message: string;
    }
  | {
      code: 'COMMON_ERROR';
      title: string;
      message: string;
    }
  | {
      code: 'INTERNAL_ERROR';
      err: Error;
    }
  | {
      code: 'VALIDATION_ERROR';
      fieldErrors: Record<string, string[]>;
    };
