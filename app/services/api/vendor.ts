
import { Vendor, VendorInput } from "@/app/components/vendors/types/vendor.types";
import { supabase } from "../../lib/supabase";
import { getUserById } from "./user";

// Fetch race results for a specific user (can be current user or another athlete)
export const getVendors = async (
   
): Promise<Vendor[]> => {
    const user = await getUserById();
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      console.log(error);
      throw error;
    }
    return data || [];
};

// Insert new race result (only for current user)
export const createVendor = async (
  venderData: VendorInput
): Promise<Vendor> => {
  const user = await getUserById();
  const { data, error } = await supabase
    .from("vendors")
    .insert([{ ...venderData, user_id: user?.id }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Delete race result (only your own)
export const deleteVendor = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("vendors")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};

// Update race result (only your own)
export const updateVendor = async (
  id: string,
  updates:VendorInput
): Promise<Vendor> => {
  const { data, error } = await supabase
    .from("vendors")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

