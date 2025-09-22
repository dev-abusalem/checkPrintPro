
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  createCheck, deleteCheck, getChecks, updateCheck } from "../api/check";
import { toast } from "sonner";
import { CheckInput ,Check, CheckApiResponse, CheckUpdateInput} from "@/app/components/checks/types/check.types";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { demoChecks } from "@/app/constants/demo";

// Hook for fetching race results for a specific user
export const CHECK_KEYS = {
  all: ["checks"] as const,
  detail: (id: string) => [...CHECK_KEYS.all, id] as const,
};

 
export const useGetChecks= () => {
  const { isDemo } = useAuth();
  return useQuery({
    queryKey: CHECK_KEYS.all,
    queryFn:()=>{
       if (isDemo) return demoChecks;
      return getChecks();
    },
    select: (accounts) => accounts.filter((v) => v.created_at !== ""),
  });
}; 

// Hook for creating race result (only for current user)
interface CreateCheckParams {
  data: CheckInput    ;
  accoutNextCheckNo: number
  onSuccess?: () => void;
}

export function useCreateCheck() {
  const { isDemo } = useAuth();
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data, accoutNextCheckNo}: CreateCheckParams) => {
      if (isDemo){
        throw new Error("Demo mode: Cannot create checks");
      }
      return createCheck(data,accoutNextCheckNo)
    },
    onSuccess: (created: Check, variables: CreateCheckParams) => {
      toast.success("Check created successfully.")
      qc.setQueryData<CheckApiResponse>(CHECK_KEYS.all, (prev) => {
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
      qc.invalidateQueries({ queryKey: CHECK_KEYS.all })

      // Call optional onSuccess callback
      if (variables.onSuccess) variables.onSuccess()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error creating check.")
    },
  })
}
// Hook for deleting race result (only your own)
interface DeleteCheckParams {
  id: string;
  onSuccess?: () => void;
}
export const useDeleteCheck = () => {
  const { isDemo } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: DeleteCheckParams) =>{
       if (isDemo) throw new Error("Demo mode: Cannot delete checks");
       return deleteCheck(id)
    },
    onSuccess: (_: any, variables: DeleteCheckParams) => {
      toast.success("Check deleted successfully.");
      qc.invalidateQueries({ queryKey: CHECK_KEYS.all });
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error deleting check.");
    },
  });
};

// Hook for updating race result (only your own)

interface CheckUpdateParams {
  id: string;
  data: CheckUpdateInput;
  onSuccess?: () => void;
}

export function useUpdateCheck() {
  const { isDemo } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: CheckUpdateParams) => {
      if (isDemo) throw new Error("Demo mode: Cannot update checks");
      return updateCheck(id, data);
    },
    onSuccess: (updated: Check, variables: CheckUpdateParams) => {
      qc.setQueryData<Check[]>(CHECK_KEYS.all, (old) => {
        if (!old) return [updated];
        return old.map((v) => (v.id === updated.id ? updated : v));
      });
      qc.setQueryData(CHECK_KEYS.detail(updated.id!), updated);
      toast.success("Check updated successfully.");
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error updating check.");
    },
  });
}
