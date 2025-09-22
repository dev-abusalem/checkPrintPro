"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Vendor, VendorInput, vendorSchema } from "./types/vendor.types";
import { useUpdateVendor } from "@/app/services/hooks/useVendor";

export function UpdateVendor({
  vendor,
  onSuccess,
  onCancel,
}: {
  vendor: Vendor;
  onSuccess: () => void;
  onCancel: () => void;
}) {
    const {mutate:updateVendor, isPending} = useUpdateVendor()
  const form = useForm<VendorInput>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: vendor.name,
      address: vendor.address,
      email: vendor.email,
      default_memo: vendor.default_memo,
    },
  });

  const onSubmit = async (values: VendorInput) => {
    updateVendor({id: vendor.id!, data: values, onSuccess(){
      onSuccess()
      form.reset()
    }})
  };

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vendor Name *</FormLabel>
              <FormControl>
                <Input placeholder="John doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         
         <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main Street, Anytown" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
           <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@me.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="default_memo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Memo</FormLabel>
              <FormControl>
                <Textarea placeholder="This is default memo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isPending ? "Updating..." : "Update Vendor"}
        </Button>
      </div>
    </form>
    </Form>
  );
}
