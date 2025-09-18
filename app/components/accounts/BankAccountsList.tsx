"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Building2, Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import { useDeleteBankAccount } from "@/app/services/hooks/useBankAccount"
import { BankAccount } from "./types/bank-account-types"
import AppDeleteModal from "@/app/shared/AppDeleteModal"
import LoadingState from "@/app/shared/LoadingState"

interface BankAccountListProps {
  accounts: BankAccount[]
  onEdit: (account: BankAccount) => void
  onAddNew: () => void
  isPending?: boolean
}

export function BankAccountList({ accounts, onEdit, onAddNew ,isPending}: BankAccountListProps) {
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null)
  const { mutate: deleteBankAccount, isPending: deletePending } = useDeleteBankAccount()
  const handleDelete = async (account: BankAccount) => {
    if (!account) return toast.error("Bank account not selected !")
    deleteBankAccount({
      id: account.id,
    })
  }

    if(isPending){
    return (
      <div className="text-center py-8 flex justify-center items-center w-full mx-auto">
        <LoadingState />
      </div>
    )
  }

  if (!accounts || !Array.isArray(accounts)) {
    return (
      <div className="text-center py-8">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Invalid data format</h3>
        <p className="text-muted-foreground mb-4">The accounts data is not in the expected format</p>
        <Button onClick={onAddNew} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No bank accounts</h3>
        <p className="text-muted-foreground mb-4">Add your first bank account to start creating checks</p>
        <Button onClick={onAddNew} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      </div>
    )
  }


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account Name</TableHead>
          <TableHead>Routing Number</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>Next Check #</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts &&
          accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-medium">{account.name}</TableCell>
              <TableCell className="font-mono">{account.routing_number}</TableCell>
              <TableCell className="font-mono">****{account.account_number.slice(-4)}</TableCell>
              <TableCell>{account.next_check_no}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button className={`w-9 h-9 cursor-pointer`}
                    size="sm" variant="outline" onClick={() => onEdit(account)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  
                    <AppDeleteModal
                          onClick={() => handleDelete(account)}
                          loading={deletePending}
                        >
                          <Button 
                          size="sm" 
                          variant="destructive"
                          className={`w-9 h-9 cursor-pointer`}
                         >
                           <Trash2 className="h-3 w-3" />
                         </Button>
                    </AppDeleteModal>
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
