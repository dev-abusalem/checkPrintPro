"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Printer, 
  MoreHorizontal,
  Plus,
  CircleOff,
  CircleOffIcon
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatCheckNumber } from '../../../lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import AppModal from '@/app/shared/AppModal'
import AppDeleteModal from '@/app/shared/AppDeleteModal'
import { exportToCSV } from '@/app/utils/exportCSV'
import { useDeleteCheck, useGetChecks, useUpdateCheck } from '@/app/services/hooks/useCheck'
import { Check } from '../types/check.types'
import EmptyState from '@/app/shared/EmptyState'
import LoadingState from '@/app/shared/LoadingState'
import { useRouter } from 'next/navigation'


export default function ChecksList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const {data, isPending} = useGetChecks()
  const filteredChecks = data?.filter(check => {
    const matchesSearch = check?.payee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check?.check_no.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const {mutate:updateCheck, isPending:updateLoading} = useUpdateCheck()
  const {mutate:deleteCheck, isPending:deleteLoading} = useDeleteCheck()
  const router = useRouter()
   const handlePrint = async (checkId: string) => {
    if(!checkId) return toast.error("Check not found")
     updateCheck({
        id: checkId,
        data: { status: 'printed' }
      })
    
  }

  const handleVoid = async (checkId: string) => {
    if(!checkId) return toast.error("Check not found")
     updateCheck({
        id: checkId,
        data: { status: 'void' }
      })
  }

  // handle delete check
  const handleDelete = async (checkId: string) => {
    if(!checkId) return toast.error('Check not found')
      deleteCheck({
        id: checkId,
      })
  }

  return (
    <>
     {
      isPending ? (
        <div className='h-screen flex items-center justify-center'>
          <LoadingState />
        </div>
      ):
      data && data?.length <1 ? 
      <div className='h-screen flex items-center justify-center'>
        <EmptyState
        Icon={CircleOffIcon}
        title="No checks found"
        description="Create a new check to get started"
        isAddButton
        buttonText='Create New Check'
        addNewUrl='/new-check'
      />
      </div>
      :
      <div className="space-y-6">
      <div className="lg:flex items-center justify-between">
        <div>
          <h1>All Checks</h1>
          <p className="text-muted-foreground">Manage and track all your checks</p>
        </div>
        <div className="flex space-x-2 mt-3 lg:mt-0">
          <Button   onClick={() => exportToCSV(filteredChecks! , "checks_export")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        
          <Button  className="bg-emerald-600 hover:bg-emerald-700" onClick={()=> router.push("/new-check")}>
            <Plus className="h-4 w-4 mr-2" />
            New Check
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="lg:flex items-center space-y-2 lg:space-y-0 justify-between">
            <div>
              <CardTitle>Checks</CardTitle>
              <CardDescription>{filteredChecks?.length} checks found</CardDescription>
            </div>
            <div className="lg:flex space-y-2 lg:space-y-0 items-center lg:space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search checks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full lg:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="printed">Printed</SelectItem>
                  <SelectItem value="emailed">Emailed</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payee</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Memo</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChecks?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No checks found. Create your first check to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChecks?.map((check) => (
                    <TableRow key={check?.id}>
                      <TableCell className="font-mono">{formatCheckNumber(check.check_no)}</TableCell>
                      <TableCell>{new Date(check.date).toLocaleDateString()}</TableCell>
                      <TableCell>{check?.payee}</TableCell>
                      <TableCell>{formatCurrency(check.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">{check.memo || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                           <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='w-48'>
                              
                              <AppModal component={<ViewDetails data={check} />}>
                                  <div className='flex justify-start items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-gray-100 w-full '>
                                      <Eye className="h-4 w-4 mr-2 text-gray-500" />
                                      <span>View Details</span>
                                  </div>
                               </AppModal>
                              {check.status !== 'void' && (
                                <DropdownMenuItem onClick={() => handleVoid(check.id)}  >
                                  <CircleOff className="h-4 w-4 mr-2" />
                                  Void
                                </DropdownMenuItem>
                              )}
                               {check.status === 'pending' && (
                                <DropdownMenuItem onClick={() => handlePrint(check.id)}  >
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print
                                </DropdownMenuItem>
                              )}
                               <AppDeleteModal loading={deleteLoading} text='Are you sure you want to delete this check ?' onClick={()=>handleDelete(check.id)} >
                                  <button className='flex justify-start cursor-pointer items-center gap-2 text-sm  px-2 py-1.5 rounded-md hover:bg-gray-100 w-full '>
                                      <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                                      <span>Delete</span>
                                  </button>
                               </AppDeleteModal>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
     }
    </>
  )
}


 
interface CheckViewModalProps {
   
  data: Check | null
}
const ViewDetails = ({
  data,
}: CheckViewModalProps)=>{
    if (!data) return null
  function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="  text-gray-600">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  )
}

  return(
    <>
      <h1 className='text-2xl font-semibold text-black text-center underline'>Details of a check</h1>
      <div className="space-y-1 mt-4">
          <Item label="Check No" value={data.check_no} />
          <Item label="Date" value={data.date} />
          <Item label="Payee" value={data.payee} />
          <Item label="Memo" value={data.memo} />
          <Item label="Amount (Cents)" value={`$${data.amount}`} />
          <Item label="Amount (words)" value={data.amount_words} />
          <Item label="Status" value={data.status} />
          <Item label="Bank Account" value={data.bank_account_id} />
          <Item
            label="Created At"
            value={new Date(data.created_at).toLocaleString()}
          />
          <Item
            label="Updated At"
            value={new Date(data.updated_at).toLocaleString()}
          />
          <Item label="Check ID" value={data.id} />
        </div>
    </>
  )
}


 