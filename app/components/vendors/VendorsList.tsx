"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Users, Search, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UpdateVendor } from './UpdateVendor'
import { CreateVendor } from './CreateVendor'
import { useDeleteVendor, useGetVendors } from '@/app/services/hooks/useVendor'
import { Vendor } from './types/vendor.types'
import AppDeleteModal from '@/app/shared/AppDeleteModal'

export function VendorsList() {
  const { data: vendors = [], isPending } = useGetVendors();
  const { mutate: deleteVendor, isPending: isDeleting } = useDeleteVendor();
  const [showForm, setShowForm] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    default_memo: ''
  })

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setFormData({
      name: vendor?.name,
      address: vendor?.address,
      email: vendor?.email,
      default_memo: vendor?.default_memo || ""
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
      default_memo: ''
    })
  }

  const filteredVendors = vendors && vendors?.filter(vendor =>
    vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

    // handle delete
    const [deleteItem, setDeleteItem] = useState<Vendor | null>(null)
    const handleDelete = async (account: Vendor) => {
      setDeleteItem(account)
      deleteVendor({
        id: account.id,
        onSuccess: () => {
          setDeleteItem(null)
        }
      })
    }
  
     

  return (
    <div className="space-y-6">
      <div className="lg:flex items-center justify-between">
        <div className='mb-2'>
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
            {
              editingVendor?  <UpdateVendor vendor={editingVendor}
                onCancel={() => setShowForm(false)}
                onSuccess={() => setShowForm(false)}
              /> : <CreateVendor 
               onCancel={() => setShowForm(false)}
                onSuccess={() => setShowForm(false)}
              />
            }
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="lg:flex space-y-2 lg:space-y-0 items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>
                  {filteredVendors?.length} vendor{filteredVendors?.length !== 1 ? 's' : ''} 
                  {searchTerm && ` (filtered from ${vendors?.length} total)`}
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
          {isPending ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : filteredVendors?.length === 0 ? (
            <div className="text-center py-8">
              {vendors?.length === 0 ? (
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
                {filteredVendors?.map((vendor) => (
                  <TableRow key={vendor?.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor?.name}</div>
                        {vendor?.address && (
                          <div className="text-sm text-muted-foreground mt-1 max-w-xs">
                            {vendor?.address?.split('\n')[0]}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{vendor?.email || '—'}</TableCell>
                    <TableCell className="max-w-40 truncate">{vendor?.default_memo || '—'}</TableCell>
                    <TableCell>{new Date(vendor?.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                                                    className={`w-9 h-9  cursor-pointer`}

                          onClick={() => handleEdit(vendor)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <AppDeleteModal
                          onClick={() => handleDelete(vendor)}
                          loading={isDeleting}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}