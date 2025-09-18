
"use client"
import React, { useState,  useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Printer, Save,  Eye, Grid3x3, Edit, Edit2  } from 'lucide-react'
import { convertToWords } from '../../../lib/utils'
import { toast } from 'sonner'
import Signature from "@uiw/react-signature"
import { useReactToPrint } from "react-to-print";
import { useGetBankAccounts } from '@/app/services/hooks/useBankAccount'
import { CheckInput } from '../types/check.types'
import { useGetVendors } from '@/app/services/hooks/useVendor'
import { useCreateCheck } from '@/app/services/hooks/useCheck'

export default function  NewCheckPage() {
  const {
    data: bankAccountsData 
   } = useGetBankAccounts()
  const {data: vendorsData  } = useGetVendors()
  const {mutate:createCheck, isPending} = useCreateCheck()

  const [formData, setFormData] = useState<CheckInput>({
    bank_account_id: '',
    payee: '',
    check_no: 1001,
    amount: 0,
    amount_words: '',
    date: new Date().toISOString().split('T')[0],
    memo: '',
    vendor_id: '',
    status: 'draft',
    
  })
  
  const [amountCents, setAmountCents] = useState(0)
  const [nextCheckNo, setNextCheckNo] = useState(1001)
  const [saving, setSaving] = useState(false)
  const [printPreview, setPrintPreview] = useState(false)
  const [checkPosition, setCheckPosition] = useState<'top' | 'middle' | 'bottom'>('top')
  const [showGrid, setShowGrid] = useState(false)
  const [accoutNextCheckNo, setAccoutNextCheckNo] = useState(1001)
  const [editNextCheckNo, setEditNextCheckNo] = useState(true)
 // handle print 
  const contentRef = useRef<HTMLDivElement>(null)
  const reactToPrintFn = useReactToPrint({
  contentRef,
   
  pageStyle: `
    @page {
      size: 8.5in 3.5in;
      margin: 0;
    }
    @media print {
      body { margin: 0; }
      .print-check-only {
        width: 8.5in !important;
        height: 3.5in !important;
        padding: 0.25in !important;
        box-sizing: border-box;
        background: white;
      }
      .font-micrenc-font {
        font-family: 'micrenc', monospace !important;
        font-weight: normal !important;
        font-style: normal !important;
        color: #000000 !important;
        font-size: 24px !important;
        line-height: 1.2 !important;
        letter-spacing: 0.15em !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `,
});


  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, '')
    const parts = cleanValue.split('.')
    if (parts.length > 2) return
    if (parts[1] && parts[1].length > 2) return
    
    setFormData({ ...formData, amount:Number(cleanValue) })
    const numValue = parseFloat(cleanValue) || 0
    setAmountCents(Math.round(numValue * 100))
  }

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendorsData?.find(v => v.id === vendorId)
    setFormData({
      ...formData,
      vendor_id: vendorId,
      payee: vendor?.name || '',
      memo: vendor?.default_memo || ''
    })
  }

  const handleBankAccountChange = (accountId: string) => {
    const account = bankAccountsData?.find(a => a.id === accountId)
    setFormData({ ...formData, bank_account_id: accountId })
    if (account?.next_check_no) {
      setNextCheckNo(account.next_check_no || 1001)
      setAccoutNextCheckNo(account.next_check_no || 1001)
    }
  }

  const handleSave = async () => {
    if (!formData.bank_account_id || !formData.payee || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }
    if(nextCheckNo > 99999){
      return toast.error("Next check number is greater than 5 digits")
    }
    setSaving(true)
    try {
      createCheck({
        data:{
          bank_account_id: formData.bank_account_id,
          payee: formData.payee,
          amount: amountCents,
          amount_words: convertToWords(amountCents),
          date: formData.date,
          memo: formData.memo,
          check_no: nextCheckNo,
          vendor_id: formData.vendor_id,
          status:"draft",
        },
        accoutNextCheckNo: accoutNextCheckNo,
        onSuccess: () => {
          window?.location.reload()
        }

      })
     } catch (error) {
      console.error('Error saving check:', error)
      toast.error('Failed to save check')
    } finally {
      setSaving(false)
    }
  }


  const handlePrint = async () => {
    if (!formData.bank_account_id || !formData.payee || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }
    if(nextCheckNo > 99999){
      return toast.error("Next check number is greater than 5 digits")
    }

    setSaving(true)
    try {
       
      createCheck({
        data:{
          bank_account_id: formData.bank_account_id,
          payee: formData.payee,
          amount: amountCents,
          amount_words: convertToWords(amountCents),
          date: formData.date,
          memo: formData.memo,
          check_no: nextCheckNo,
          vendor_id: formData.vendor_id,
          status:"printed",
        },
        accoutNextCheckNo: accoutNextCheckNo,
        onSuccess: () => {
          window?.location.reload()
        }
      })
      
      // Trigger print
      reactToPrintFn()

      } catch (error) {
      console.error('Error printing check:', error)
      toast.error('Failed to print check')
    } finally {
      setSaving(false)
    }
  }

  const selectedAccount = bankAccountsData && bankAccountsData?.find(a => a.id === formData.bank_account_id)

  // add signature function for upload image in supabase storage and clear function
    const signatureRef = useRef<any>(null)

  const handleSignatureEnd = () => {
    if (signatureRef.current) {
      const isEmpty = signatureRef.current.isEmpty()
      if (!isEmpty) {
       signatureRef.current.toDataURL("image/png")
      }
    }
  }

 

  const renderCheckContent = () => (
    <div  ref={contentRef} className="pt-4 w-3xl lg:w-full h-full overflow-auto  relative">
      {/* Header Section */}
      <div className="flex justify-between items-center px-4">
        <div>
          {selectedAccount && (
            <>
              <h2 className="text-lg font-bold leading-tight text-black tracking-wide">
                {selectedAccount.name}
              </h2>
              <div className="text-xs black leading-tight max-w-64 font-medium">
                {selectedAccount.address || "No address"}
              </div>
            </>
          )}
        </div>
          <p className='font-semibold '>Wells Fargo</p>
        {/* Check Number */}
          <p className="text-3xl font-bold text-blue-900 font-bruno-ace-font">
            {nextCheckNo.toString().padStart(4, '0')}
          </p>

       
      </div>

      <div className="flex justify-end items-center px-4">
          {/* Memo */}
          <div className="w-52 flex items-center gap-2">
               <label className="  font-rozha-font tracking-wide">Date</label>
             <input
              placeholder="Optional memo"
              value={formData.date}
              type='date'
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full h-8 border-0 border-b border-gray-600 rounded-none bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
      </div>

      {/* Main Check Body */}
      <div className="p-4 relative">
        {/* Pay To Section */}
        <div>
           
          <div className="flex items-center">
            <label className="text-xs font-bold font-bruno-ace-font max-w-28 w-full  uppercase tracking-wide">Pay to the Order of</label>
            <input
              value={formData.payee}
              onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
              className="flex-1 h-8 px-4 text-lg border-0 border-b border-gray-600 rounded-none bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-times-new-roman font-semibold"
            />
            <div className="ml-4 flex items-center font-times-new-roman">
              <span className="text-2xl font-bold text-gray-700 mr-3 ">$</span>
              <input
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-36 h-8  text-2xl text-center border-b  rounded-none border-x-0 border-t-0 shadow-none border-b-gray-600 outline-none leading-0   text-gray-900 font-bold "
              />
            </div>
          </div>
        </div>

        {/* Amount in Words */}
          <div className=" mb-1 flex items-center ">
            {amountCents > 0 ? (
              <div className='flex items-end  gap-x-5  w-full justify-between'>
                <div className="text-lg border-b w-full font-times-new-roman px-4  border-gray-600 min-h-[36px] text-gray-900 leading-tight flex items-center gap-x-2 font-semibold  italic uppercase">
                <p className='w-[calc(100%-80px)] '>{convertToWords(amountCents)}</p>
                 <p className='-mb-[8px]'>{
                    // Array.from({ length: (92 - convertToWords(amountCents).length) }).map((_, index) => '*')
                  Array.from({ length: (55 - convertToWords(amountCents).length) }).map((_) => '*')
                  }</p>
                  
              </div>
              <p className='font-bruno-ace-font w-20 text-left'>Dollar</p>
              </div>
            ) : (
              <div className="text-lg flex items-center border-b w-full px-4 border-gray-600 font-times-new-roman  min-h-[36px] text-gray-700 italic leading-tight justify-center">
                <span>Amount in words will appear here</span>
              </div>
            )}
          </div>
           
               <p className=' absolute top-1/2 mt-3 left-1/6 z-10 font-michroma-font text-xs  font-bold text-gray-900'>{formData.payee}</p>
         {/* Bottom Row - Memo and Signature */}
        <div className="grid grid-cols-5 justify-between items-end">
          {/* Memo */}
          <div className="col-span-2 flex items-center gap-x-3">
               <label className="font-michroma-font text-xs  text-gray-900">Memo</label>
             <input
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              className="w-full h-6 border-0 border-b border-gray-600 rounded-none bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
              maxLength={140}
            />
          </div>
            <div></div>
          {/* Signature Line */}
            <div className="col-span-2 relative">
            <Signature
              ref={signatureRef}
               
              style={{
                width: "100%",
                height: "80px",
                borderBottom: "1px solid rgb(75 85 99)",
              }}
              onEnded={handleSignatureEnd}
            />
             
          </div>
        </div>
      </div>

      {/* MICR Line - Bottom Section */}
      <div className=" pb-8">
        {selectedAccount && (
          <div className="flex items-center justify-center h-full">
            <div 
              className=" font-micrenc-font text-2xl tracking-[0.3em] text-black font-normal"
              style={{ 
                 letterSpacing: '0.15em'
              }}
            >
              ⑆{selectedAccount.routing_number}⑆ {selectedAccount.account_number}⑈ {nextCheckNo.toString().padStart(4, '0')}
            </div>
          </div>
        )}
      </div>

      {/* Grid Guidelines (when enabled) */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
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
            {/* Safe margin */}
            <rect 
              x="18" 
              y="18" 
              width="calc(100% - 36px)" 
              height="calc(100% - 36px)" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="8,4"
            />
          </svg>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6 print-hide">
      {/* Header */}
      <div className="lg:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">New Check</h1>
            <p className="text-muted-foreground">Create and print a new check per U.S. Check 21 standards</p>
         </div>
        <div className="flex flex-wrap lg:flex-nowrap space-y-2 lg:space-y-0 mt-2 lg:mt-0 items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setShowGrid(!showGrid)}
            className={showGrid ? "bg-red-50 border-red-200 cursor-pointer" : "cursor-pointer"}
          >
            <Grid3x3 className="h-4 w-4 mr-2" />
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setPrintPreview(!printPreview)}
            className={printPreview ? "bg-blue-50 border-blue-200 cursor-pointer" : "cursor-pointer"}
          >
            <Eye className="h-4 w-4 mr-2" />
            {printPreview ? 'Exit Preview' : 'Print Preview'}
          </Button>
          <Button  variant="outline" onClick={handleSave} disabled={isPending} className='cursor-pointer'>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={handlePrint} disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
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
              <Select value={formData.bank_account_id} onValueChange={handleBankAccountChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccountsData?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Vendor (Optional)</label>
              <Select value={formData.vendor_id} onValueChange={handleVendorChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorsData?.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Check Position</label>
              <Select value={checkPosition} onValueChange={(value: 'top' | 'middle' | 'bottom') => setCheckPosition(value)}>
                <SelectTrigger className='w-full'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top of Page</SelectItem>
                  <SelectItem value="middle">Middle of Page</SelectItem>
                  <SelectItem value="bottom">Bottom of Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='relative'>
              <label className="text-sm font-medium mb-2 block">Check Number</label>
              <Input
                value={nextCheckNo}
                disabled={editNextCheckNo}
                className="bg-muted"
                onChange={(e) => setNextCheckNo(Number(e.target.value))}
              />
              <Edit onClick={() => setEditNextCheckNo(!editNextCheckNo)} className="w-5 h-5 mt-1 absolute right-2 top-1/2 cursor-pointer" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check Preview - Standard US Check Size (8.5" x 3.5" = 2.43:1 ratio) */}
      <div className="flex justify-center">
        {printPreview ? (
          /* Full Page Preview - 8.5" x 11" simulation */
          <div 
            className="bg-white border-2 border-gray-300 shadow-lg relative"
            style={{ 
              width: '680px', 
              height: '880px', 
              aspectRatio: '8.5 / 11'
            }}
          >
            <div className="text-xs text-gray-400 absolute top-2 left-2">8.5&quot; × 11&quot; Page Preview</div>
            <div 
              className="absolute check-professional"
              style={{ 
                width: '680px',
                height: '280px',
                aspectRatio: '2.43 / 1',
                top: checkPosition === 'top' ? '40px' : checkPosition === 'middle' ? '300px' : '560px',
                left: '0px'
              }}
            >
              {renderCheckContent()}
            </div>
          </div>
        ) : (
          /* Standard Check Preview */
          <div 
            className="check-container check-professional w-full max-w-5xl relative print:max-w-none"
             
          >
            {renderCheckContent()}
          </div>
        )}
      </div>

      {/* Redline Specifications & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Redline Specifications:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Canvas: 8.5&quot; × 3.5&quot; (standard business check)</li>
                <li>Safe margin: 0.25&quot; on all sides</li>
                <li>Grid: 8-pt alignment system</li>
                <li>Font: Inter Sans Serif family</li>
                <li>MICR: E-13B font, ±0.015&quot; tolerance</li>
                <li>Borders: 1pt stroke, black (#000000)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Typography Standards:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Bank name: Inter 12pt Bold</li>
                <li>Labels: Inter 9pt Regular, Gray #555555</li>
                <li>Fields: Inter 11pt Regular, Black</li>
                <li>Check number: Inter 11pt Bold</li>
                <li>MICR line: MICR E-13B 12pt Regular</li>
                <li>Placeholders: #AAAAAA, italic</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Print Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Print at 300-600 DPI resolution</li>
                <li>Use laser printer with magnetic toner</li>
                <li>Set to &quot;Actual Size&quot; (100% scaling)</li>
                <li>Test alignment with grid guidelines</li>
                <li>Verify MICR positioning tolerance</li>
                <li>Check 21 compliant formatting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redline Calibration & Measurement Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground mb-4">
            <p className="font-medium">Redline Calibration Grid:</p>
            <p>8-pt grid system with precise field measurements. Red guidelines show safe zones and MICR tolerance.</p>
          </div>
          <div className="relative bg-gray-50 p-4 rounded border-2 border-dashed">
            <svg 
              width="100%" 
              height="240" 
              viewBox="0 0 612 252" 
              className="border"
              style={{ maxWidth: '612px' }}
            >
              {/* 8-pt grid lines - matches redline spec */}
              {Array.from({ length: 77 }, (_, i) => (
                <line
                  key={`grid-v-${i}`}
                  x1={i * 8}
                  y1={0}
                  x2={i * 8}
                  y2={252}
                  stroke="#e5e7eb"
                  strokeWidth="0.25"
                />
              ))}
              {Array.from({ length: 32 }, (_, i) => (
                <line
                  key={`grid-h-${i}`}
                  x1={0}
                  y1={i * 8}
                  x2={612}
                  y2={i * 8}
                  stroke="#e5e7eb"
                  strokeWidth="0.25"
                />
              ))}
              
              {/* Field positioning markers per redline spec */}
              {/* Check number position */}
              <rect x="594" y="18" width="18" height="16" fill="#ff0000" opacity="0.3"/>
              <text x="550" y="15" fontSize="6" fill="#ff0000">Check No: 0.25&quot; from top/right</text>
              
              {/* Date position */}
              <rect x="558" y="18" width="28" height="16" fill="#0066ff" opacity="0.3"/>
              <text x="490" y="30" fontSize="6" fill="#0066ff">Date: 0.5&quot; left of check no.</text>
              
              {/* Payee line */}
              <rect x="72" y="86.4" width="396" height="16" fill="#00cc00" opacity="0.3"/>
              <text x="72" y="82" fontSize="6" fill="#00cc00">Payee: 1.0&quot; from left, 1.2&quot; from top, 5.5&quot; width</text>
              
              {/* Amount box */}
              <rect x="526" y="86.4" width="86.4" height="16" fill="#ff6600" opacity="0.3"/>
              <text x="460" y="115" fontSize="6" fill="#ff6600">Amount: 0.25&quot; from right, 1.2&quot; width</text>
              
              {/* MICR line */}
              <rect x="0" y="207" width="612" height="16" fill="#cc00cc" opacity="0.3"/>
              <text x="250" y="240" fontSize="6" fill="#cc00cc">MICR: 0.625&quot; from bottom (±0.015&quot; tolerance)</text>
              
              {/* Safe margin zone */}
              <rect x="18" y="18" width="576" height="216" fill="none" stroke="#ff0000" strokeWidth="1" strokeDasharray="2,2" opacity="0.7"/>
              <text x="20" y="240" fontSize="6" fill="#ff0000">0.25&quot; Safe Margin</text>
              
              {/* Overall dimensions */}
              <rect x="0" y="0" width="612" height="252" fill="none" stroke="#000000" strokeWidth="2"/>
              <text x="270" y="10" fontSize="8" fill="#000000" fontWeight="bold">8.5&quot; × 3.5&quot; Check Template</text>
            </svg>
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <div>• Red dashed line: 0.25&quot; safe margin per redline spec</div>
              <div>• Colored rectangles: Exact field positions and dimensions</div>
              <div>• 8-pt grid ensures proper alignment for all elements</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}