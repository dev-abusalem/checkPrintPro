
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {   createBankAccount, deleteBankAccount, getBankAccount, getBankAccounts, updateBankAccount } from "../api/bank-account";
import { BankAccountApiResponse, BankAccountInput, BankAccount } from "@/app/components/accounts/types/bank-account-types";
import { toast } from "sonner";
import { demoBankAccounts } from "@/app/constants/demo";
import { useAuth } from "@/app/components/auth/AuthProvider";
 

export const BANK_ACCOUNT_KEYS = {
  all: ["bank_accounts"] as const,
  detail: (id: string) => [...BANK_ACCOUNT_KEYS.all, id] as const,
};
// Hook for fetching race results for a specific user
export const useGetBankAccounts = () => {
    const { isDemo } = useAuth();
  return useQuery({
    queryKey: BANK_ACCOUNT_KEYS.all,
   queryFn: async () => {
      if (isDemo) return demoBankAccounts;
      return getBankAccounts();    
    },
    select: (accounts) => accounts.filter((v) => v.created_at !== ""),
  });
}; 

// hook for a single bank account get 
export const useGetBankAccount = (id: string) => {
  return useQuery({
    queryKey: BANK_ACCOUNT_KEYS.detail(id),
    queryFn: () => getBankAccount(id),
  });
};

// Hook for creating race result (only for current user)

interface CreateBankAccountParams {
  data: BankAccountInput    ;
  onSuccess?: () => void;
}

export function useCreateBankAccount() {
  const { isDemo } = useAuth();
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: CreateBankAccountParams) =>{
      if (isDemo){
        throw new Error("Demo mode: Cannot create bank accounts");
      }
      return  createBankAccount(data)
    },
    onSuccess: (created: BankAccount, variables: CreateBankAccountParams) => {
      toast.success("Bank account created successfully.")
      qc.setQueryData<BankAccountApiResponse>(BANK_ACCOUNT_KEYS.all, (prev) => {
        if (!prev) {
          return {
            data: [created],
          }
        }

        return {
          ...prev,
          data: [created, ...(prev?.data || [])],
        }
      })
      qc.invalidateQueries({ queryKey: BANK_ACCOUNT_KEYS.all })

      // Call optional onSuccess callback
      if (variables.onSuccess) variables.onSuccess()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error creating driver.")
    },
  })
}
// Hook for deleting race result (only your own)
interface DeleteBankAccountParams {
  id: string;
  onSuccess?: () => void;
}
export const useDeleteBankAccount = () => {
  const { isDemo } = useAuth();
   const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: DeleteBankAccountParams) => {
      if(isDemo) throw new Error("Demo mode: Cannot delete bank accounts");
      return deleteBankAccount(id);
    },
    onSuccess: (_: any, variables: DeleteBankAccountParams) => {
      toast.success("Bank account deleted successfully.");
      qc.invalidateQueries({ queryKey: BANK_ACCOUNT_KEYS.all });
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error deleting driver.");
    },
  });
};

// Hook for updating race result (only your own)

interface BankAccountUpdateParams {
  id: string;
  data: BankAccountInput;
  onSuccess?: () => void;
}

export function useUpdateBankAccount() {
  const { isDemo } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: BankAccountUpdateParams) => {
      if(isDemo) throw new Error("Demo mode: Cannot delete bank accounts");
      return updateBankAccount(id, data);
    },
    onSuccess: (updated: BankAccount, variables: BankAccountUpdateParams) => {
      qc.setQueryData<BankAccount[]>(BANK_ACCOUNT_KEYS.all, (old) => {
        if (!old) return [updated];
        return old.map((v) => (v.id === updated.id ? updated : v));
      });
      qc.setQueryData(BANK_ACCOUNT_KEYS.detail(updated.id!), updated);
      toast.success("Bank account updated successfully.");
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error updating bank account.");
    },
  });
}
