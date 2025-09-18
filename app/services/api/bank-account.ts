// import { supabase, UserRaceResult } from "../../lib/supabase";

import { BankAccountInput, BankAccount, BankAccountUpdateInput } from "@/app/components/accounts/types/bank-account-types";
import { supabase } from "../../lib/supabase";
import { getUserById } from "./user";

// Fetch race results for a specific user (can be current user or another athlete)
export const getBankAccounts = async (
  
): Promise<BankAccount[]> => {
    const user = await getUserById();
    const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id);

  console.log({data: data});
  if (error) {
    throw error;
  }
  return data || [];
};

// get a bank account
export const getBankAccount = async (id: string): Promise<BankAccount> => {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// Insert new race result (only for current user)
export const createBankAccount = async (
  bankAccountData: BankAccountInput
): Promise<BankAccount> => {
  const user = await getUserById();

  const { data, error } = await supabase
    .from("bank_accounts")
    .insert([
      {
        ...bankAccountData,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
};


// Delete race result (only your own)
export const deleteBankAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};

// Update race result (only your own)
export const updateBankAccount = async (
  id: string,
  updates: BankAccountUpdateInput
): Promise<BankAccount> => {
  const { data, error } = await supabase
    .from("bank_accounts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

