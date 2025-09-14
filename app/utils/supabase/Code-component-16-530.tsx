import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseKey = publicAnonKey

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface User {
  id: string
  email: string
  name: string
  organization_id: string
  last_login_at?: string
}

export interface Organization {
  id: string
  name: string
  plan: string
  created_at: string
}

export interface BankAccount {
  id: string
  organization_id: string
  name: string
  routing_number: string // encrypted
  account_number: string // tokenized
  address: string
  default_layout_id?: string
  starting_check_no: number
  next_check_no: number
  micr_font: string
  created_by: string
  created_at: string
}

export interface Check {
  id: string
  organization_id: string
  bank_account_id: string
  check_no: number
  vendor_id?: string
  payee_name: string
  amount_cents: number
  amount_words: string
  date: string
  memo?: string
  status: 'draft' | 'pending' | 'approved' | 'printed' | 'emailed' | 'void'
  prepared_by: string
  approved_by?: string
  printed_by?: string
  emailed_to?: string
  attachments: string[]
  created_at: string
  updated_at: string
}

export interface Vendor {
  id: string
  organization_id: string
  name: string
  address: string
  email?: string
  default_memo?: string
  default_account_id?: string
  created_at: string
}