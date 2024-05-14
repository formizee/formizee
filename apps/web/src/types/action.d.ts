type ActionState =
  | {
      code: 'SUCCESS';
      message: string;
    }
  | {
      code: 'COMMON_ERROR';
      title: string;
      message: string;
    }
  | {
      code: 'INTERNAL_ERROR';
      err: any;
    }
  | {
      code: 'VALIDATION_ERROR';
      fieldErrors: {
        [field: string]: string[];
      };
    };
