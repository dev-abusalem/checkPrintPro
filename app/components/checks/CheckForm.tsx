import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, Save, Send, Building2 } from 'lucide-react'
import { formatCurrency, convertToWords } from '../../lib/utils'
import { toast } from 'sonner'

export function CheckForm() {
  const [formData, setFormData] = useState({
    bankAccount: '',
    payee: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    memo: '',
    vendorId: ''
  })

  const [amountCents, setAmountCents] = useState(0)

  // Mock data
  const bankAccounts = [
    { id: '1', name: 'Main Operating Account', number: '••••1234' },
    { id: '2', name: 'Payroll Account', number: '••••5678' }
  ]

  const vendors = [
    { id: '1', name: 'ABC Supply Co.', address: '123 Main St, City, ST 12345' },
    { id: '2', name: 'Office Depot', address: '456 Oak Ave, City, ST 12345' },
    { id: '3', name: 'John Smith Consulting', address: '789 Pine St, City, ST 12345' }
  ]

  const handleAmountChange = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '')
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.')
    if (parts.length > 2) return
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return
    
    setFormData({ ...formData, amount: cleanValue })
    
    // Convert to cents for internal storage
    const numValue = parseFloat(cleanValue) || 0
    setAmountCents(Math.round(numValue * 100))
  }

  const handleSaveDraft = () => {
    toast.success('Check saved as draft')
  }

  const handleSubmitForApproval = () => {
    if (!formData.bankAccount || !formData.payee || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Check submitted for approval')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>New Check</h1>
          <p className="text-muted-foreground">Create a new check for payment</p>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Draft
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Check Details</CardTitle>
              <CardDescription>Enter the payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bank Account */}
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account *</Label>
                <Select value={formData.bankAccount} onValueChange={(value) => setFormData({ ...formData, bankAccount: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span>{account.name}</span>
                          <span className="text-muted-foreground">({account.number})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payee */}
              <div className="space-y-2">
                <Label htmlFor="payee">Payee *</Label>
                <Input
                  id="payee"
                  placeholder="Enter payee name"
                  value={formData.payee}
                  onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                />
              </div>

              {/* Vendor (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor (Optional)</Label>
                <Select value={formData.vendorId} onValueChange={(value) => setFormData({ ...formData, vendorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div>
                          <div>{vendor.name}</div>
                          <div className="text-xs text-muted-foreground">{vendor.address}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {amountCents > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {convertToWords(amountCents)}
                  </p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Memo */}
              <div className="space-y-2">
                <Label htmlFor="memo">Memo</Label>
                <Textarea
                  id="memo"
                  placeholder="Enter memo (optional)"
                  value={formData.memo}
                  onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                  maxLength={140}
                />
                <p className="text-xs text-muted-foreground">{formData.memo.length}/140</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmitForApproval}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Approval
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Check Preview</CardTitle>
              <CardDescription>Live preview of your check</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 bg-muted/10">
                <div className="space-y-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Check #</p>
                    <p className="text-sm">1004</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm">{new Date(formData.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Pay to the order of</p>
                    <p className="text-sm border-b border-muted-foreground/25 pb-1">
                      {formData.payee || 'Payee Name'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm border border-muted-foreground/25 p-2 rounded">
                      {formData.amount ? formatCurrency(amountCents) : '$0.00'}
                    </p>
                  </div>
                  
                  {amountCents > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Amount in words</p>
                      <p className="text-xs border-b border-muted-foreground/25 pb-1">
                        {convertToWords(amountCents)}
                      </p>
                    </div>
                  )}
                  
                  {formData.memo && (
                    <div>
                      <p className="text-xs text-muted-foreground">Memo</p>
                      <p className="text-xs">{formData.memo}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-muted-foreground/25">
                    <p className="text-xs text-muted-foreground">Signature</p>
                    <div className="h-8 border-b border-muted-foreground/25"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}