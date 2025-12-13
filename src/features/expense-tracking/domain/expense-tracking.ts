import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const CreateExpenseInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z
    .union([z.string(), z.number()])
    .default("")
    .refine(
      (val) => {
        if (typeof val === "string") {
          return val.trim() !== "";
        }
        return val !== undefined && val !== null;
      },
      { message: "Amount is required" }
    )
    .transform((val) => (typeof val === "string" ? Number(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Amount must be greater than zero",
    }),
});

type CreateExpenseInput = z.infer<typeof CreateExpenseInputSchema>;

const ExpenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  amount: z.number(),
  createdAt: z.date(),
});

export type Expense = z.infer<typeof ExpenseSchema>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export const createExpense = (
  input: unknown
): ValidationResult<Expense> => {
  const validationResult = CreateExpenseInputSchema.safeParse(input);

  if (validationResult.success === false) {
    return {
      success: false,
      errors: validationResult.error.issues.map((err) => err.message),
    };
  }

  const expense: Expense = {
    id: uuidv4(),
    name: validationResult.data.name,
    amount: validationResult.data.amount,
    createdAt: new Date(),
  };

  return { success: true, data: expense };
};

export const addExpenseToList = (
  expenses: readonly Expense[],
  newExpense: Expense
): readonly Expense[] => {
  return [...expenses, newExpense];
};
