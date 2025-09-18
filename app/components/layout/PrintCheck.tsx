import React, { useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { convertToWords } from '@/lib/utils';
import Signature from "@uiw/react-signature"
import { CheckInput } from '../checks/types/check.types';
interface PrintCheckProps {
    formData: CheckInput
    selectedAccount:any 
    amountCents: number
}
const PrintCheck = ({formData,selectedAccount,amountCents}:PrintCheckProps) => {
      const [nextCheckNo, setNextCheckNo] = useState(1001)
    const [isSignatureEmpty, setIsSignatureEmpty] = useState(true)
    const [signatureDataURL, setSignatureDataURL] = useState("")
    const signatureRef = useRef<any>(null)
     const handleSignatureEnd = () => {
    if (signatureRef.current) {
      const isEmpty = signatureRef.current.isEmpty()
      setIsSignatureEmpty(isEmpty)

      if (!isEmpty) {
        const dataURL = signatureRef.current.toDataURL("image/png")
        setSignatureDataURL(dataURL)
      }
    }
  }

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
  return (
     <div  ref={contentRef} className="pt-4  w-full h-full  relative">

      {/* Header Section */}
      <div className="flex justify-between items-center px-4">
        {/* Bank Information */}
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
              className="flex-1 h-8 px-4 text-lg border-0 border-b border-gray-600 rounded-none bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-times-new-roman font-semibold"
            />
            <div className="ml-4 flex items-center font-times-new-roman">
              <span className="text-2xl font-bold text-gray-700 mr-3 ">$</span>
              <input
                placeholder="0.00"
                value={formData.amount}
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
              ⑆{selectedAccount.routingNumber}⑆ {selectedAccount.accountNumber}⑈ {nextCheckNo.toString().padStart(4, '0')}
            </div>
          </div>
        )}
      </div>

      
    </div>
  )
}

export default PrintCheck