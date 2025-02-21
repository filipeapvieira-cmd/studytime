export interface FlattenedError {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}
