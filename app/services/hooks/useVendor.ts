
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Vendor, VendorApiResponse, VendorInput } from "@/app/components/vendors/types/vendor.types";
import { createVendor, deleteVendor, getVendors, updateVendor } from "../api/vendor";

// Hook for fetching race results for a specific user
export const VENDOR_KEYS = {
  all: ["vendors"] as const,
  detail: (id: string) => [...VENDOR_KEYS.all, id] as const,
};

 
export const useGetVendors= () => {
  return useQuery({
    queryKey: VENDOR_KEYS.all,
    queryFn:getVendors,
    select: (vendors) => vendors.filter((v) => v.created_at !== ""),
  });
}; 

// Hook for creating race result (only for current user)
interface CreateVendorParams {
  data: VendorInput;
  onSuccess?: () => void;
}

export function useCreateVendor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: CreateVendorParams) => createVendor(data),
    onSuccess: (created: Vendor, variables: CreateVendorParams) => {
      toast.success("Vendor created successfully.")
      qc.setQueryData<VendorApiResponse>(VENDOR_KEYS.all, (prev) => {
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
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.all })

      // Call optional onSuccess callback
      if (variables.onSuccess) variables.onSuccess()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error creating vendor.")
    },
  })
}
// Hook for deleting race result (only your own)
interface DeleteVendorParams {
  id: string;
  onSuccess?: () => void;
}
export const useDeleteVendor = () => {
   const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: DeleteVendorParams) => deleteVendor(id),
    onSuccess: (_: any, variables: DeleteVendorParams) => {
      toast.success("Vendor deleted successfully.");
      qc.invalidateQueries({ queryKey: VENDOR_KEYS.all });
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error deleting vendor.");
    },
  });
};

// Hook for updating race result (only your own)

interface VendorUpdateParams {
  id: string;
  data: VendorInput;
  onSuccess?: () => void;
}

export function useUpdateVendor() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: VendorUpdateParams) => updateVendor(id, data),
    onSuccess: (updated: Vendor, variables: VendorUpdateParams) => {
      qc.setQueryData<Vendor[]>(VENDOR_KEYS.all, (old) => {
        if (!old) return [updated];
        return old.map((v) => (v.id === updated.id ? updated : v));
      });
      qc.setQueryData(VENDOR_KEYS.detail(updated.id!), updated);
      toast.success("Vendor updated successfully.");
      if (variables.onSuccess) variables.onSuccess();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Error updating vendor.");
    },
  });
}
