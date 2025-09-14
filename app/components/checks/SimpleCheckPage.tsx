import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Printer, Save, ArrowLeft, Eye, Grid3x3 } from 'lucide-react'
import { convertToWords } from '../../lib/utils'
import { api, type BankAccount, type Vendor } from '../../utils/api'
import { toast } from 'sonner'

interface SimpleCheckPageProps {
  onBack: () => void
}

export function SimpleCheckPage({ onBack }: SimpleCheckPageProps) {
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
  const [printPreview, setPrintPreview] = useState(false)
  const [checkPosition, setCheckPosition] = useState<'top' | 'middle' | 'bottom'>('top')
  const [showGrid, setShowGrid] = useState(false)

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
      
      if (accountsRes.accounts && accountsRes.accounts.length > 0) {
        setFormData(prev => ({ ...prev, bankAccount: accountsRes.accounts[0].id }))
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load accounts and vendors')
    }
  }

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0
    setAmountCents(Math.round(numericValue * 100))
    setFormData({ ...formData, amount: value })
  }

  const handleBankAccountChange = (accountId: string) => {
    setFormData({ ...formData, bankAccount: accountId })
  }

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId)
    if (vendor) {
      setFormData({ 
        ...formData, 
        vendorId,
        payee: vendor.name 
      })
    } else {
      setFormData({ ...formData, vendorId: '' })
    }
  }

  const handleSave = async () => {
    if (!formData.bankAccount || !formData.payee || amountCents <= 0) {
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
        checkNo: nextCheckNo,
        status: 'draft'
      })
      
      toast.success('Check saved as draft')
    } catch (error) {
      console.error('Error saving check:', error)
      toast.error('Failed to save check')
    } finally {
      setSaving(false)
    }
  }

  const handlePrint = async () => {
    if (!formData.bankAccount || !formData.payee || amountCents <= 0) {
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
        checkNo: nextCheckNo,
        status: 'printed'
      })
      
      window.print()
      
      toast.success('Check printed successfully')
      onBack()
    } catch (error) {
      console.error('Error printing check:', error)
      toast.error('Failed to print check')
    } finally {
      setSaving(false)
    }
  }

  const selectedAccount = bankAccounts.find(a => a.id === formData.bankAccount)

  const renderSimpleCheck = () => (
    <div className="w-full h-full bg-white relative print:border-0 border border-black">
      {/* Company Name and Address - Top Left */}
      <div className="absolute top-3 left-6">
        {selectedAccount && (
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-black leading-tight text-center">
              {selectedAccount.name}
            </div>
            <div className="text-xs text-black leading-tight text-center max-w-48">
              {selectedAccount.address}
            </div>
          </div>
        )}
      </div>

      {/* Bank Name - Top Center/Right */}
      <div className="absolute top-3 right-32">
        <div className="text-sm font-medium text-black">
          Wells Fargo
        </div>
      </div>

      {/* Check Number - Top Right */}
      <div className="absolute top-3 right-6">
        <div className="text-lg font-bold text-black">
          {nextCheckNo.toString().padStart(4, '0')}
        </div>
      </div>

      {/* Date - Upper Right */}
      <div className="absolute top-8 right-6">
        <div className="flex items-center">
          <span className="text-xs text-black mr-2">Date</span>
          <div className="border-b border-black pb-0.5 w-20">
            <span className="text-xs text-black font-mono">
              {new Date(formData.date).toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Pay to the Order of */}
      <div className="absolute top-16 left-6 right-32">
        <div className="mb-1">
          <span className="text-xs text-black">Pay to the</span>
        </div>
        <div className="mb-1">
          <span className="text-xs text-black">Order of</span>
        </div>
        <div className="border-b border-black pb-0.5">
          <span className="text-sm text-black">
            {formData.payee || ' '}
          </span>
        </div>
      </div>

      {/* Dollar Amount Box */}
      <div className="absolute top-16 right-6">
        <div className="flex items-center">
          <span className="text-sm text-black mr-1">$</span>
          <div className="border border-black px-1 py-0.5 bg-white min-w-[70px]">
            <span className="text-sm text-black font-mono text-right block">
              {formData.amount ? `***${formData.amount}` : ' '}
            </span>
          </div>
        </div>
      </div>

      {/* Amount in Words */}
      <div className="absolute top-24 left-6 right-6">
        <div className="border-b border-black pb-0.5 min-h-[20px] flex items-end">
          {amountCents > 0 ? (
            <span className="text-sm text-black leading-tight uppercase">
              {convertToWords(amountCents)}
            </span>
          ) : (
            <span className="text-sm text-transparent leading-tight">
              &nbsp;
            </span>
          )}
        </div>
        <div className="text-right mt-0.5">
          <span className="text-xs text-black">Dollars</span>
        </div>
      </div>

      {/* Second payee line */}
      <div className="absolute top-32 left-6 right-6">
        <div className="border-b border-black pb-0.5 h-5">
          <span className="text-sm text-black">
            {formData.payee}
          </span>
        </div>
      </div>

      {/* Memo */}
      <div className="absolute bottom-6 left-6">
        <div className="flex items-center">
          <span className="text-xs text-black mr-3">Memo</span>
          <div className="border-b border-black pb-0.5 w-40">
            <span className="text-xs text-black">
              {formData.memo || ' '}
            </span>
          </div>
        </div>
      </div>

      {/* Signature Line */}
      <div className="absolute bottom-8 right-6">
        <div className="w-52">
          <div className="border-b border-black h-6"></div>
        </div>
      </div>

      {/* MICR Line */}
      <div className="absolute bottom-1 left-0 right-0">
        {selectedAccount && (
          <div className="text-center">
            <div 
              className="micr-line text-black"
              style={{ 
                fontFamily: '"MICR E-13B", "OCR A Extended", "OCR A", "OCR B", "Courier New", monospace',
                fontSize: '12pt',
                letterSpacing: '0.2em',
                fontWeight: 'normal'
              }}
            >
              ⑈{selectedAccount.routingNumber}⑈ {selectedAccount.accountNumber}⑈ {nextCheckNo.toString().padStart(4, '0')}
            </div>
          </div>
        )}
      </div>

      {/* Grid Guidelines (when enabled) */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none opacity-20 print:hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Quarter-inch grid lines */}
            {Array.from({ length: 35 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 18}
                y1={0}
                x2={i * 18}
                y2="100%"
                stroke="#ef4444"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 15 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * 18}
                x2="100%"
                y2={i * 18}
                stroke="#ef4444"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 print:hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Checks
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">New Check</h1>
            <p className="text-muted-foreground">Create and print a new check</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? "bg-red-50 border-red-200" : ""}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setPrintPreview(!printPreview)}
            className={printPreview ? "bg-blue-50 border-blue-200" : ""}
          >
            <Eye className="h-4 w-4 mr-2" />
            {printPreview ? 'Exit Preview' : 'Print Preview'}
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePrint} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700">
            <Printer className="h-4 w-4 mr-2" />
            Print Check
          </Button>
        </div>
      </div>

      {/* Setup Fields */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Bank Account *</label>
              <Select value={formData.bankAccount} onValueChange={handleBankAccountChange}>
                <SelectTrigger>
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
              <label className="text-sm font-medium mb-2 block">Vendor (Optional)</label>
              <Select value={formData.vendorId} onValueChange={handleVendorChange}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium mb-2 block">Payee *</label>
              <Input
                placeholder="Payee name"
                value={formData.payee}
                onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Amount *</label>
              <Input
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Memo</label>
              <Input
                placeholder="Optional memo"
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                maxLength={140}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Check Number</label>
              <Input
                value={nextCheckNo.toString().padStart(4, '0')}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check Preview */}
      <div className="flex justify-center">
        {printPreview ? (
          /* Full Page Preview */
          <div 
            className="bg-white border border-gray-300 shadow-lg relative"
            style={{ 
              width: '680px', 
              height: '880px', 
              aspectRatio: '8.5 / 11'
            }}
          >
            <div className="text-xs text-gray-400 absolute top-2 left-2">8.5&quot; × 11&quot; Page Preview</div>
            <div 
              className="absolute bg-white border border-gray-500"
              style={{ 
                width: '680px',
                height: '280px',
                aspectRatio: '2.43 / 1',
                top: checkPosition === 'top' ? '40px' : checkPosition === 'middle' ? '300px' : '560px',
                left: '0px'
              }}
            >
              {renderSimpleCheck()}
            </div>
          </div>
        ) : (
          /* Standard Check Preview */
          <div 
            className="check-container w-full max-w-4xl bg-white border border-gray-400 shadow-xl print:shadow-none print:border-black relative"
            style={{ 
              aspectRatio: '2.43 / 1', 
              minHeight: '300px'
            }}
          >
            {renderSimpleCheck()}
          </div>
        )}
      </div>

      {/* Print styles for this specific check */}
      <style jsx>{`
        @media print {
          @page {
            size: 8.5in 3.5in;
            margin: 0;
          }
          
          .check-container {
            width: 8.5in !important;
            height: 3.5in !important;
            max-width: none !important;
            box-shadow: none !important;
            border: 0 !important;
            background: white !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}