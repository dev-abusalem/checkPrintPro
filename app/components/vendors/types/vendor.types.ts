import z from "zod"

// Zod schema for Vendor
export const vendorSchema = z.object({
  name: z.string().min(2, "Vendor name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  email: z.string().email(),
  default_memo: z.string().optional(),
  user_id: z.string().optional(),
})

// TypeScript type inferred from the schema
export const responseVendorSchema = vendorSchema.extend({
  id: z.string(),
  created_at: z.string(),
  update_at: z.string(),
})

export type VendorInput = z.infer<typeof vendorSchema>
export type Vendor = z.infer<typeof responseVendorSchema>
export type VendorApiResponse = {
  data: Vendor[]
}
