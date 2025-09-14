import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Printer, Save, X } from 'lucide-react'
import { convertToWords } from '../../lib/utils'
import { api, type BankAccount, type Vendor } from '../../utils/api'
import { toast } from 'sonner'

interface CheckWindowProps {
  onClose: () => void
}

export function CheckWindow({ onClose }: CheckWindowProps) {
  const [formData, setFormData] = useState({
    bankAccount: '',
    payee: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    memo: '',
    vendorId: ''
  })
  
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [amountCents, setAmountCents] = useState(0)
  const [nextCheckNo, setNextCheckNo] = useState(1001)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [accountsRes, vendorsRes] = await Promise.all([
        api.getBankAccounts(),
        api.getVendors()
      ])
      
      setBankAccounts(accountsRes.accounts || [])
      setVendors(vendorsRes.vendors || [])
      
      // Set default account and next check number
      if (accountsRes.accounts && accountsRes.accounts.length > 0) {
        const defaultAccount = accountsRes.accounts[0]
        setFormData(prev => ({ ...prev, bankAccount: defaultAccount.id }))
        setNextCheckNo(defaultAccount.nextCheckNo || 1001)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    }
  }

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '')
    const parts = cleanValue.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    
    setFormData({ ...formData, amount: cleanValue })
    const numValue = parseFloat(cleanValue) || 0
    setAmountCents(Math.round(numValue * 100))
  }

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId)
    setFormData({
      ...formData,
      vendorId,
      payee: vendor?.name || '',
      memo: vendor?.defaultMemo || ''
    })
  }

  const handleSave = async () => {
    if (!formData.bankAccount || !formData.payee || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      await api.createCheck({
        bankAccount: formData.bankAccount,
        payee: formData.payee,
        amount: amountCents,
        amountWords: convertToWords(amountCents),
        date: formData.date,
        memo: formData.memo,
        checkNo: nextCheckNo
      })
      
      toast.success('Check saved successfully')
      onClose()
    } catch (error) {
      console.error('Error saving check:', error)
      toast.error('Failed to save check')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = async () => {
    if (!formData.bankAccount || !formData.payee || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // Save the check first
      await api.createCheck({
        bankAccount: formData.bankAccount,
        payee: formData.payee,
        amount: amountCents,
        amountWords: convertToWords(amountCents),
        date: formData.date,
        memo: formData.memo,
        checkNo: nextCheckNo,
        status: 'printed'
      })
      
      // Trigger print
      window.print()
      
      toast.success('Check printed successfully')
      onClose()
    } catch (error) {
      console.error('Error printing check:', error)
      toast.error('Failed to print check')
    } finally {
      setSaving(false)
    }
  }

  const selectedAccount = bankAccounts.find(a => a.id === formData.bankAccount)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg">New Check</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handlePrint} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Check Layout */}
        <div className="p-8 h-full overflow-auto">
          <Card className="w-full max-w-3xl mx-auto border-2" style={{ aspectRatio: '2.5/1' }}>
            <CardContent className="p-6 h-full relative">
              {/* Top Section */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  {selectedAccount && (
                    <>
                      <div className="text-sm">{selectedAccount.name}</div>
                      <div className="text-xs text-muted-foreground whitespace-pre-line">
                        {selectedAccount.address}
                      </div>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Check #</div>
                  <div className="text-lg">{nextCheckNo.toString().padStart(4, '0')}</div>
                </div>
              </div>

              {/* Date and Pay To Line */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-end space-x-4">
                  <span className="text-sm">Date</span>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-32 border-0 border-b border-black rounded-none text-center"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm">Pay to the order of</span>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Payee name"
                      value={formData.payee}
                      onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                      className="border-0 border-b border-black rounded-none flex-1"
                    />
                  </div>
                  <span className="text-sm">$</span>
                  <Input
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="w-24 border border-black text-center"
                  />
                </div>
              </div>

              {/* Amount in Words */}
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-1">Amount in words</div>
                <div className="border-b border-black pb-1 min-h-[24px]">
                  {amountCents > 0 ? convertToWords(amountCents) : ''}
                </div>
              </div>

              {/* Bank Account and Vendor Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs text-muted-foreground">Bank Account</label>
                  <Select value={formData.bankAccount} onValueChange={(value) => setFormData({ ...formData, bankAccount: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Vendor (Optional)</label>
                  <Select value={formData.vendorId} onValueChange={handleVendorChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Memo and Signature Line */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Memo</span>
                  <Input
                    placeholder="Optional memo"
                    value={formData.memo}
                    onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                    className="border-0 border-b border-black rounded-none flex-1"
                    maxLength={140}
                  />
                </div>

                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="border-b border-black pb-1 text-center h-8 flex items-end justify-center">
                      <span className="text-xs text-muted-foreground">Authorized Signature</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MICR Line (placeholder) */}
              <div className="absolute bottom-2 left-6 right-6">
                <div className="text-xs text-muted-foreground text-center border-t pt-2">
                  {selectedAccount && (
                    <span>⑈{selectedAccount.routingNumber}⑈ {selectedAccount.accountNumber}⑈ {nextCheckNo.toString().padStart(4, '0')}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}