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
  Plus
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatCheckNumber } from '../../lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { api, type Check } from '../../utils/api'
import { toast } from 'sonner'
import AppModal from '@/app/shared/AppModal'
import AppDeleteModal from '@/app/shared/AppDeleteModal'
import { exportToCSV } from '@/app/utils/exportCSV'
interface ChecksListProps {
  onNewCheck?: () => void
}

export function ChecksList({ onNewCheck }: ChecksListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChecks()
  }, [])

  const loadChecks = async () => {
    try {
      setLoading(true)
      const response = await api.getChecks()
      setChecks(response.checks || [])
    } catch (error) {
      console.error('Error loading checks:', error)
      toast.error('Failed to load checks')
    } finally {
      setLoading(false)
    }
  }

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.checkNo.toString().includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || check.status === statusFilter
    return matchesSearch && matchesStatus
  })
  console.log(filteredChecks)
  const handlePrint = async (checkId: string) => {
    try {
      await api.updateCheck(checkId, { status: 'printed' })
      toast.success('Check printed successfully')
      loadChecks()
    } catch (error) {
      console.error('Error printing check:', error)
      toast.error('Failed to print check')
    }
  }

  const handleVoid = async (checkId: string) => {
    try {
      await api.updateCheck(checkId, { status: 'void' })
      toast.success('Check voided')
      loadChecks()
    } catch (error) {
      console.error('Error voiding check:', error)
      toast.error('Failed to void check')
    }
  }

  const handleDelete = async (checkId: string) => {
    try {
      await api.deleteCheck(checkId)
      toast.success('Check deleted')
      loadChecks()
    } catch (error) {
      console.error('Error deleting check:', error)
      toast.error('Failed to delete check')
    }
  }

  const getActionButtons = (check: Check) => {
    if (check.status === 'created') {
      return (
        <div className="flex space-x-1">
          <Button size="sm" variant="outline" onClick={() => handlePrint(check.id)}>
            <Printer className="h-3 w-3" />
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>All Checks</h1>
          <p className="text-muted-foreground">Manage and track all your checks</p>
        </div>
        <div className="flex space-x-2">
          <Button   onClick={() => exportToCSV(filteredChecks , "checks_export")} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onNewCheck}>
            <Plus className="h-4 w-4 mr-2" />
            New Check
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Checks</CardTitle>
              <CardDescription>{filteredChecks.length} checks found</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search checks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
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
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
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
                {filteredChecks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No checks found. Create your first check to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-mono">{formatCheckNumber(check.checkNo)}</TableCell>
                      <TableCell>{new Date(check.date).toLocaleDateString()}</TableCell>
                      <TableCell>{check.payee}</TableCell>
                      <TableCell>{formatCurrency(check.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getStatusColor(check.status)}>
                          {check.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-32 truncate">{check.memo || '—'}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getActionButtons(check)}
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
                                <DropdownMenuItem onClick={() => handleVoid(check.id)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Void
                                </DropdownMenuItem>
                              )}
                              <AppModal component={<AppDeleteModal text='Are you sure you want to delete this check ?' onClick={()=>handleDelete(check.id)} />}>
                                  <div className='flex justify-start items-center gap-2 text-sm hover:text-red-600 px-2 py-1.5 rounded-md hover:bg-gray-100 w-full '>
                                      <Trash2 className="h-4 w-4 mr-2 text-gray-500" />
                                      <span>Delete</span>
                                  </div>
                               </AppModal>
                              
                              
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


interface CheckData {
  id: string
  date: string
  memo: string
  payee: string
  amount: number
  status: string
  checkNo: number
  createdAt: string
  updatedAt: string
  amountWords: string
  bankAccount: string
}

interface CheckViewModalProps {
   
  data: CheckData | null
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
      <h1 className='text-2xl font-semibold text-black text-center underline'>Details view of a check</h1>
      <div className="space-y-1 mt-4">
          <Item label="Check No" value={data.checkNo} />
          <Item label="Date" value={data.date} />
          <Item label="Payee" value={data.payee} />
          <Item label="Memo" value={data.memo} />
          <Item label="Amount" value={`$${data.amount.toLocaleString()}`} />
          <Item label="Amount (words)" value={data.amountWords} />
          <Item label="Status" value={data.status} />
          <Item label="Bank Account" value={data.bankAccount} />
          <Item
            label="Created At"
            value={new Date(data.createdAt).toLocaleString()}
          />
          <Item
            label="Updated At"
            value={new Date(data.updatedAt).toLocaleString()}
          />
          <Item label="Check ID" value={data.id} />
        </div>
    </>
  )
}


 