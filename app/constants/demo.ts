import { BankAccount } from "../components/accounts/types/bank-account-types";
import { Check } from "../components/checks/types/check.types";
import { Vendor } from "../components/vendors/types/vendor.types";

// ✅ Demo Vendors
export const demoVendors: Vendor[] = [
  {
    id: "vendor-1",
    name: "Acme Supplies",
    address: "123 Market Street, Springfield",
    email: "contact@acme.com",
    default_memo: "Office supplies",
    user_id: "demo-user-1",
    created_at: new Date().toISOString(),
    update_at: new Date().toISOString(),
  },
  {
    id: "vendor-2",
    name: "Tech World Inc.",
    address: "456 Silicon Valley, CA",
    email: "sales@techworld.com",
    default_memo: "Electronics",
    user_id: "demo-user-1",
    created_at: new Date().toISOString(),
    update_at: new Date().toISOString(),
  },
];

// ✅ Demo Bank Accounts
export const demoBankAccounts: BankAccount[] = [
  {
    id: "bank-1",
    name: "Chase Business Checking",
    routing_number: "123456789",
    account_number: "987654321",
    address: "1 Chase Plaza, New York, NY",
    starting_check_no: 1001,
    next_check_no: 1005,
    user_id: "demo-user-1",
    created_at: new Date().toISOString(),
    update_at: new Date().toISOString(),
  },
  {
    id: "bank-2",
    name: "Wells Fargo Business Account",
    routing_number: "987654321",
    account_number: "123456789",
    address: "420 Market St, San Francisco, CA",
    starting_check_no: 2001,
    next_check_no: 2003,
    user_id: "demo-user-1",
    created_at: new Date().toISOString(),
    update_at: new Date().toISOString(),
  },
];

// ✅ Demo Checks
export const demoChecks: Check[] = [
  {
    id: "check-1",
    organization_id: "demo-org-1",
    bank_account_id: "bank-1",
    check_no: 1001,
    vendor_id: "vendor-1",
    payee: "Acme Supplies",
    amount: 250.5,
    amount_words: "Two hundred fifty dollars and fifty cents",
    date: new Date().toISOString(),
    memo: "Office supplies for March",
    status: "approved",
    prepared_by: "demo-user-1",
    approved_by: "demo-user-1",
    printed_by: "demo-user-1",
    emailed_to: "accounting@acme.com",
    attachments: [],
    user_id: "demo-user-1",
    next_check_no: 1002,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "check-2",
    organization_id: "demo-org-1",
    bank_account_id: "bank-2",
    check_no: 2001,
    vendor_id: "vendor-2",
    payee: "Tech World Inc.",
    amount: 999.99,
    amount_words: "Nine hundred ninety-nine dollars and ninety-nine cents",
    date: new Date().toISOString(),
    memo: "Laptop purchase",
    status: "pending",
    prepared_by: "demo-user-1",
    approved_by: "",
    printed_by: "",
    emailed_to: "",
    attachments: [],
    user_id: "demo-user-1",
    next_check_no: 2002,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
