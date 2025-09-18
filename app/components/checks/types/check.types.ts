 import z from "zod"
 
// Zod schema for Check
export const checkSchema = z.object({
  organization_id: z.string().optional(),
  bank_account_id: z.string(),
  check_no: z.number(),
  vendor_id: z.string().optional(),
  payee: z.string(),
  amount: z.number().min(1, "Amount must be greater than 0"),
  amount_words: z.string(),
  date: z.string(), 
  memo: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'printed', 'emailed', 'void']),
  prepared_by: z.string().optional(),
  approved_by: z.string().optional(),
  printed_by: z.string().optional(),
  emailed_to: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  user_id: z.string().optional(),
  next_check_no: z.number().optional(),
});
export const checkUpdateSchema = z.object({
  organization_id: z.string().optional(),
  bank_account_id: z.string().optional(),
  check_no: z.number().optional(),
  vendor_id: z.string().optional(),
  payee: z.string().optional(),
  amount: z.number().optional(),
  amount_words: z.string().optional(), 
  date: z.string().optional(), 
  memo: z.string().optional(),
  status: z.enum(['draft', 'pending', 'approved', 'printed', 'emailed', 'void']),
  prepared_by: z.string().optional(),
  approved_by: z.string().optional(),
  printed_by: z.string().optional(),
  emailed_to: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  user_id: z.string().optional(),
  next_check_no: z.number().optional(),
});


// TypeScript type inferred from the schema

 export const responseCheckSchema = checkSchema.extend({
   id: z.string(),
   created_at: z.string(),
   updated_at: z.string()
 })
 
 
 export type CheckInput = z.infer<typeof checkSchema>
 export type CheckUpdateInput = z.infer<typeof checkUpdateSchema>
 export type Check = z.infer<typeof responseCheckSchema>
 export type CheckApiResponse = {
   data: Check[]
 }
 