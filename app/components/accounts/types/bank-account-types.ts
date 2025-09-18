import z from "zod"

export const bankAccountInputSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  routing_number: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits"),
  account_number: z.string().min(1, "Account number is required"),
  address: z.string().optional(),
  starting_check_no: z.number().min(1001, "Starting check number must be between 1001 and 9999").max(9999, "Starting check number must be between 1001 and 9999"),
  next_check_no: z.number().min(1001, "Next check number must be between 1001 and 9999").max(9999, "Next check number must be between 1001 and 9999").optional(),
  user_id: z.string().optional(),
  
})
export const bankAccountUpdateInputSchema = z.object({
  name: z.string().min(1, "Account name is required").optional(),
  routing_number: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits").optional(),
  account_number: z.string().min(1, "Account number is required").optional(),
  address: z.string().optional(),
  starting_check_no: z.number().min(1001, "Starting check number must be between 1001 and 9999").max(9999, "Starting check number must be between 1001 and 9999").optional(),
  next_check_no: z.number().min(1001, "Next check number must be between 1001 and 9999").max(9999, "Next check number must be between 1001 and 9999").optional(),
  user_id: z.string().optional(),
  
})

export const responseBankAccountSchema = bankAccountInputSchema.extend({
  id: z.string(),
  created_at: z.string(),
  update_at: z.string()
})


export type BankAccountInput = z.infer<typeof bankAccountInputSchema>
export type BankAccountUpdateInput = z.infer<typeof bankAccountUpdateInputSchema>
export type BankAccount = z.infer<typeof responseBankAccountSchema>
export type BankAccountApiResponse = {
  data: BankAccount[]
}
