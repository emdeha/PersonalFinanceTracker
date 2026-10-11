export type Expense = { readonly name: string; readonly amount: string }

export type ParsedExpense =
  | { readonly ok: true; readonly expense: Expense }
  | { readonly ok: false; readonly error: string }

type ParseExpenseOptions = { readonly name: string; readonly amount: string }

const rejected = (error: string): ParsedExpense => ({ ok: false, error })

export const parseExpense = ({ name, amount }: ParseExpenseOptions): ParsedExpense => {
  const trimmedName = name.trim()
  const trimmedAmount = amount.trim()
  if (trimmedName === '') return rejected('Name is required')
  if (trimmedAmount === '') return rejected('Amount is required')
  if (Number.isNaN(Number(trimmedAmount))) return rejected('Amount must be a number')
  if (Number(trimmedAmount) <= 0) return rejected('Amount must be greater than 0')
  return { ok: true, expense: { name: trimmedName, amount: trimmedAmount } }
}
