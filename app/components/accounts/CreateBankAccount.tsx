"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { BankAccountInput, bankAccountInputSchema } from "./types/bank-account-types"
import { useCreateBankAccount } from "@/app/services/hooks/useBankAccount"



 

export function CreateBankAccount() {
  const [showForm, setShowForm] = useState(false)
    const {mutate:createBankAccount, isPending} = useCreateBankAccount()
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

  const handleSubmit = async (data: BankAccountInput) => {
    const bankdata = {
        ...data,
        next_check_no:form.getValues("starting_check_no")
      }
    createBankAccount({
     data:bankdata,
      onSuccess: () => {
        resetForm()
      },    
    })
  }

  const resetForm = () => {
    setShowForm(false)
    form.reset()
  }

  return (
    <Dialog open={showForm} onOpenChange={setShowForm}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
          <DialogDescription>Enter the bank account information below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    <Input type="number" placeholder="1001" min="1001" {...field} onChange={(e) => field.onChange(Number.parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className={`${isPending ? "cursor-not-allowed bg-emerald-400 hover:bg-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                {isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
