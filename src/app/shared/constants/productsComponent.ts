export const ERROR_MESSAGES = {
    required: (fieldName: string) => `${fieldName} is required.`,
    minlength: (fieldName: string, error: any) =>
      `${fieldName} must be at least ${error.requiredLength} characters.`,
    maxlength: (fieldName: string, error: any) =>
      `${fieldName} must be at most ${error.requiredLength} characters.`,
    pattern: () =>
      `forbidden characters.`,
} as const;

export const SUCCESS_MESSAGES = {
    PRODUCT_CREATED: 'Product created successfully!',
    UNEXPECTED_RESPONSE: 'Unexpected response from server',
} as const;

export const ERROR_CODES = {
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES_BY_CODE = {
    [ERROR_CODES.BAD_REQUEST]: 'An error occurred while creating the product.',
    [ERROR_CODES.NOT_FOUND]: 'Product not found.',
    [ERROR_CODES.CONFLICT]: 'Product already exists.',
    [ERROR_CODES.SERVER_ERROR]: 'Server error. Please try again later.',
} as const;

export const REGEX_PATTERNS = {
    FORBIDDEN_CHARACTERS: /^[^'";<>\\-]+$/,
} as const;

export const FIELD_NAMES = {
    PRODUCT_NAME: 'ProductName',
    PRODUCT_DESCRIPTION: 'ProductDescription',
} as const;

type ErrorMessageKeys = keyof typeof ERROR_MESSAGES;
type SuccessMessageKeys = keyof typeof SUCCESS_MESSAGES;
type ErrorCodeKeys = keyof typeof ERROR_MESSAGES_BY_CODE;
type RegexPatternKeys = keyof typeof REGEX_PATTERNS;
type FieldNameKeys = keyof typeof FIELD_NAMES;