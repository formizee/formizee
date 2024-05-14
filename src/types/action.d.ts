type ActionState =
  | {
      code: 'SUCCESS';
      message: string;
    }
  | {
      code: 'EXISTS_ERROR';
      key: string;
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
