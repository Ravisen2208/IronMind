/**
 * Input validation and sanitization for IronMind
 */

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  error?: string;
}

export type TaskCategory = "intellect" | "willpower";

export function validateTaskInput(input: any): ValidationResult<{
  title: string;
  category: TaskCategory;
}> {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Invalid request payload." };
  }

  const rawTitle = typeof input.title === "string" ? input.title.trim() : "";
  if (!rawTitle) {
    return { valid: false, error: "Quest title cannot be empty." };
  }

  if (rawTitle.length > 120) {
    return { valid: false, error: "Quest title must be 120 characters or fewer." };
  }

  const category = input.category;
  if (category !== "intellect" && category !== "willpower") {
    return {
      valid: false,
      error: "Invalid category. Must be either 'intellect' or 'willpower'.",
    };
  }

  return {
    valid: true,
    data: {
      title: rawTitle,
      category,
    },
  };
}
