// error.types.ts

export type SignupErrorCode =
  | "USERNAME_TAKEN"
  | "EMAIL_TAKEN"
  | "MISSING_FIELDS"
  | "UNAUTHORIZED"
  | "UNKNOWN_ERROR";

export interface AppError extends Error {
  code: SignupErrorCode;
  status: number;
}
