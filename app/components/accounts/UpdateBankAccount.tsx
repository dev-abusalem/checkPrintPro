"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { BankAccountInput, bankAccountInputSchema, BankAccount } from "./types/bank-account-types"
import { useUpdateBankAccount } from "@/app/services/hooks/useBankAccount"


interface UpdateBankAccountProps {
  account: BankAccount | null
  isOpen: boolean
  onClose: () => void
}

export function UpdateBankAccount({ account, isOpen, onClose,  }: UpdateBankAccountProps) {
    const {mutate:updateBankAccount, isPending}= useUpdateBankAccount()
  const form = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountInputSchema),
    defaultValues: {
      name: "",
      routing_number: "",
      account_number: "",
      address: "",
      starting_check_no: 1001,
    },
  })

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        routing_number: account.routing_number,
        account_number: account.account_number,
        address: account.address,
        starting_check_no: account.starting_check_no,
      })
    }
  }, [account, form])

  const onSubmit = async (data: BankAccountInput) => {
    if (!account?.id) {
      toast.error("Bank account not found")
      return
    }
       updateBankAccount({ id: account.id, data: data,  }, {
        onSuccess: () => {
            onClose()
            form.reset()
        },
        onError: () => {
          toast.error("Failed to update bank account")
        },
      })
     
     
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Bank Account</DialogTitle>
          <DialogDescription>Update the bank account information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Main Operating Account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routing_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="9-digit routing number" maxLength={9} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Account number" {...field} />
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
                  <FormLabel>Bank Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Bank name and address for check header" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="starting_check_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting Check Number</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1001" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={`${isPending ? "cursor-not-allowed bg-emerald-400 hover:bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
