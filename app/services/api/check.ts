
import { CheckInput,Check, CheckUpdateInput } from "@/app/components/checks/types/check.types";
import { supabase } from "../../lib/supabase";
import { getUserById } from "./user";
import { updateBankAccount } from "./bank-account";

// Fetch race results for a specific user (can be current user or another athlete)
export const getChecks = async (
   
): Promise<Check[]> => {
    const user = await getUserById();
    const { data, error } = await supabase
      .from("checks")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      console.log(error);
      throw error;
    }
    return data || [];
};

// Insert new race result (only for current user)
export const createCheck = async (
  checkData: CheckInput,
  accoutNextCheckNo: number
): Promise<Check> => {
  const user = await getUserById();
  const { data, error } = await supabase
    .from("checks")
    .insert([{ ...checkData, user_id: user?.id }])
    .select()
    .single();

    if (error) {
      throw error;
    }
    await updateBankAccount(checkData.bank_account_id, {
      next_check_no: accoutNextCheckNo + 1,
    });
    
    return data;
};

// Delete race result (only your own)
export const deleteCheck = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("checks")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};

// Update race result (only your own)
export const updateCheck = async (
  id: string,
  updates:CheckUpdateInput
): Promise<Check> => {
  const { data, error } = await supabase
    .from("checks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

