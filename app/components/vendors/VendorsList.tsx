import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Users, Search, Loader2 } from 'lucide-react'
import { api, type Vendor } from '../../utils/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export function VendorsList() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    defaultMemo: ''
  })

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    try {
      setLoading(true)
      const response = await api.getVendors()
      setVendors(response.vendors || [])
    } catch (error) {
      console.error('Error loading vendors:', error)
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }
  // Create a new vendor
  const [createLoading, setCreateLoading] = useState(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast.error('Vendor name is required')
      return
    }

    try {
      setCreateLoading(true)
      await api.createVendor({
        name: formData.name,
        address: formData.address,
        email: formData.email,
        defaultMemo: formData.defaultMemo
      })
      
      toast.success('Vendor created successfully')
      setShowForm(false)
      setFormData({
        name: '',
        address: '',
        email: '',
        defaultMemo: ''
      })
      loadVendors()
    } catch (error) {
      console.error('Error creating vendor:', error)
      toast.error('Failed to create vendor')
    } finally{
      setCreateLoading(false)
    }
  }

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor.name,
      address: vendor.address,
      email: vendor.email,
      defaultMemo: vendor.defaultMemo
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingVendor(null)
    setFormData({
      name: '',
      address: '',
      email: '',
      defaultMemo: ''
    })
  }

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )



    // handle delete
    const [deleteItem, setDeleteItem] = useState<Vendor | null>(null)
    const handleDelete = async (account: Vendor) => {
      try {
        setDeleteItem(account)
        await api.deleteVendor(account.id)
        toast.success('Vendor deleted successfully')
        loadVendors()
      } catch (error) {
        console.error('Error deleting vendor:', error)
        toast.error('Failed to delete vendor')
      }finally{
        setDeleteItem(null)
      }
    }
  
    // handle update vendor 
    const [updateLoading, setUpdateLoading] = useState<boolean>(false)
    const handleUpdate = async (account: Vendor) => {
      if(!account) toast.error('Vendor not found')
      try {
        setUpdateLoading(true)
        await api.updateVendor(account.id, formData)
        toast.success('Vendor updated successfully')
        loadVendors()
        resetForm()
      } catch (error) {
        console.error('Error updating vendor:', error)
        toast.error('Failed to update vendor')
      } finally{
          setUpdateLoading(false)
      }
    }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <p className="text-muted-foreground">Manage vendor information for quick check creation</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingVendor ? 'Edit' : 'Add'} Vendor</DialogTitle>
              <DialogDescription>
                {editingVendor ? 'Update' : 'Enter'} the vendor information below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='space-y-2'>
                <Label htmlFor="name">Vendor Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., ABC Supply Company"
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Vendor mailing address"
                  rows={3}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vendor@example.com"
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="defaultMemo">Default Memo</Label>
                <Input
                  id="defaultMemo"
                  value={formData.defaultMemo}
                  onChange={(e) => setFormData({ ...formData, defaultMemo: e.target.value })}
                  placeholder="e.g., Office supplies, Services"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                {
                  editingVendor ? (
                    <Button type="button" disabled={updateLoading} className={`${updateLoading ? 'cursor-not-allowed bg-emerald-400 hover:bg-emerald-400':'bg-emerald-600 hover:bg-emerald-700'} `} onClick={() => handleUpdate(editingVendor)}>
                       {updateLoading ? "Updating..." : "Update" }
                    </Button>
                      ):
                      (
                        <Button disabled={createLoading} type="submit" className={`${createLoading ? 'cursor-not-allowed bg-emerald-400 hover:bg-emerald-400':'bg-emerald-600 hover:bg-emerald-700'} `} >
                          {createLoading ? "Creating..." :"Create Vendor"}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} 
                  {searchTerm && ` (filtered from ${vendors.length} total)`}
                </CardDescription>
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-8">
              {vendors.length === 0 ? (
                <>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vendors</h3>
                  <p className="text-muted-foreground mb-4">Add vendors to speed up check creation</p>
                  <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </>
              ) : (
                <>
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No vendors found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms</p>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Default Memo</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.name}</div>
                        {vendor.address && (
                          <div className="text-sm text-muted-foreground mt-1 max-w-xs">
                            {vendor.address.split('\n')[0]}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{vendor.email || '—'}</TableCell>
                    <TableCell className="max-w-40 truncate">{vendor.defaultMemo || '—'}</TableCell>
                    <TableCell>{new Date(vendor.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(vendor)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className={`${deleteItem && deleteItem.id === vendor.id ? 'cursor-not-allowed text-red-200 hover:text-red-200' : 'text-red-600 hover:text-red-700'} `}
                          disabled={deleteItem && deleteItem.id === vendor.id ? true :false}
                          onClick={() => handleDelete(vendor)}
                        >
                          {
                            deleteItem && deleteItem.id === vendor.id ? (
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