"use client"

import { useState  } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { CreateBankAccount } from "./CreateBankAccount"
import { UpdateBankAccount } from "./UpdateBankAccount"
import { BankAccountList } from "./BankAccountsList"
import { useGetBankAccounts } from "@/app/services/hooks/useBankAccount"
import {   BankAccount } from "./types/bank-account-types"

export function BankAccountMain() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
   const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
    const {data, isPending} = useGetBankAccounts()
 
 
  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account)
    setShowUpdateDialog(true)
  }

  const handleCloseUpdate = () => {
    setShowUpdateDialog(false)
    setEditingAccount(null)
  }

  const handleAddNew = () => {
    // This will be handled by the CreateBankAccount component's dialog trigger
  }

  return (
    <div className="space-y-6">
      <div className="lg:flex items-center justify-between">
        <div className=" mb-3 lg:mb-0">
          <h1 className="text-2xl font-semibold">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts for check printing</p>
        </div>
        <CreateBankAccount  />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Accounts
          </CardTitle>
          <CardDescription>
            {accounts.length} account{accounts.length !== 1 ? "s" : ""} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BankAccountList
            accounts={data || []}
            onEdit={handleEdit}
             onAddNew={handleAddNew}
             isPending={isPending}
          />
        </CardContent>
      </Card>

      <UpdateBankAccount
        account={editingAccount}
        isOpen={showUpdateDialog}
        onClose={handleCloseUpdate}
       />
    </div>
  )
}
