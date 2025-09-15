import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Building2, Loader2 } from 'lucide-react'
import { api, type BankAccount } from '../../utils/api'
import { toast } from 'sonner'

export function BankAccountsList() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    routingNumber: '',
    accountNumber: '',
    address: '',
    startingCheckNo: '1001'
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const response = await api.getBankAccounts()
      setAccounts(response.accounts || [])
    } catch (error) {
      console.error('Error loading bank accounts:', error)
      toast.error('Failed to load bank accounts')
    } finally {
      setLoading(false)
    }
  }

  // Create a new bank account
  const [createLoading, setCreateLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.routingNumber || !formData.accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setCreateLoading(true)
      await api.createBankAccount({
        name: formData.name,
        routingNumber: formData.routingNumber,
        accountNumber: formData.accountNumber,
        address: formData.address,
        startingCheckNo: parseInt(formData.startingCheckNo) || 1001
      })
      
      toast.success('Bank account created successfully')
      setShowForm(false)
      setFormData({
        name: '',
        routingNumber: '',
        accountNumber: '',
        address: '',
        startingCheckNo: '1001'
      })
      loadAccounts()
    } catch (error) {
      console.error('Error creating bank account:', error)
      toast.error('Failed to create bank account')
    } finally{
      setCreateLoading(false)
    }
  }

  const handleEdit = (account: BankAccount) => {
    setEditingAccount(account)
    setFormData({
      name: account.name,
      routingNumber: account.routingNumber,
      accountNumber: account.accountNumber,
      address: account.address,
      startingCheckNo: account.startingCheckNo.toString()
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingAccount(null)
    setFormData({
      name: '',
      routingNumber: '',
      accountNumber: '',
      address: '',
      startingCheckNo: '1001'
    })
  }

  // handle delete
  const [deleteItem, setDeleteItem] = useState<BankAccount | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const handleDelete = async (account: BankAccount) => {
    try {
      setDeleteItem(account)
      await api.deleteBankAccount(account.id)
      toast.success('Bank account deleted successfully')
      loadAccounts()
    } catch (error) {
      console.error('Error deleting bank account:', error)
      toast.error('Failed to delete bank account')
    }finally{
      setDeleteItem(null)
    }
  }

  // handle update bank account 
  const [updateLoading, setUpdateLoading] = useState<boolean>(false)
  const handleUpdate = async (account: BankAccount) => {
    if(!account) toast.error('Bank account not found')
    try {
      setUpdateLoading(true)
      console.log(formData)
      await api.updateBankAccount(account.id, formData)
      toast.success('Bank account updated successfully')
      loadAccounts()
      resetForm()
    } catch (error) {
      console.error('Error updating bank account:', error)
      toast.error('Failed to update bank account')
    } finally{
        setUpdateLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your bank accounts for check printing</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Bank Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit' : 'Add'} Bank Account</DialogTitle>
              <DialogDescription>
                {editingAccount ? 'Update' : 'Enter'} the bank account information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='space-y-2'>
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Operating Account"
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="routingNumber">Routing Number *</Label>
                <Input
                  id="routingNumber"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  placeholder="9-digit routing number"
                  maxLength={9}
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="Account number"
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="address">Bank Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Bank name and address for check header"
                  rows={3}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="startingCheckNo">Starting Check Number</Label>
                <Input
                  id="startingCheckNo"
                  type="number"
                  value={formData.startingCheckNo}
                  onChange={(e) => setFormData({ ...formData, startingCheckNo: e.target.value })}
                  placeholder="1001"
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                {
                  editingAccount ? (
                    <Button type="button" disabled={updateLoading} className={`${updateLoading ? 'cursor-not-allowed bg-emerald-400 hover:bg-emerald-400':'bg-emerald-600 hover:bg-emerald-700'} `} onClick={() => handleUpdate(editingAccount)}>
                      {updateLoading ? "Updating..." : "Update" }
                    </Button>
                  ):
                  (
                    <Button disabled={createLoading} type="submit" className={`${createLoading ? 'cursor-not-allowed bg-emerald-400 hover:bg-emerald-400':'bg-emerald-600 hover:bg-emerald-700'} `} >
                      {createLoading ? "Creating..." :"Create Account"}
                    </Button>
                  )
                }
                 
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Bank Accounts
          </CardTitle>
          <CardDescription>
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bank accounts</h3>
              <p className="text-muted-foreground mb-4">Add your first bank account to start creating checks</p>
              <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Bank Account
              </Button>
            </div>
          ) : (
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
                {accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell className="font-mono">{account.routingNumber}</TableCell>
                    <TableCell className="font-mono">
                      ****{account.accountNumber.slice(-4)}
                    </TableCell>
                    <TableCell>{account.nextCheckNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(account)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${deleteItem && deleteItem.id === account.id ? 'cursor-not-allowed text-red-200 hover:text-red-200' : 'text-red-600 hover:text-red-700'} `}
                          disabled={deleteItem && deleteItem.id === account.id ? true :false}
                          onClick={() => handleDelete(account)}
                        >
                          {
                            deleteItem && deleteItem.id === account.id ? (
                              <Loader2 className="animate-spin h-3 w-3" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )
                          }
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}