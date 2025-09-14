import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

export function convertToWords(amount: number): string {
  if (amount === 0) return "Zero dollars and 00/100"
  
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
  const scales = ["", "thousand", "million", "billion"]

  function convertHundreds(n: number): string {
    let result = ""
    
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " hundred "
      n %= 100
    }
    
    if (n >= 20) {
      result += tens[Math.floor(n / 10)]
      if (n % 10 > 0) result += "-" + ones[n % 10]
    } else if (n > 0) {
      result += ones[n]
    }
    
    return result.trim()
  }

  const dollars = Math.floor(amount / 100)
  const cents = amount % 100
  
  let result = ""
  let scale = 0
  let remaining = dollars

  while (remaining > 0) {
    const chunk = remaining % 1000
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk)
      if (scale > 0) {
        result = chunkWords + " " + scales[scale] + " " + result
      } else {
        result = chunkWords
      }
    }
    remaining = Math.floor(remaining / 1000)
    scale++
  }

  if (!result) result = "zero"
  
  return result.charAt(0).toUpperCase() + result.slice(1) + " dollars and " + cents.toString().padStart(2, '0') + "/100"
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber
  return "••••" + accountNumber.slice(-4)
}

export function formatCheckNumber(checkNo: number): string {
  return checkNo.toString().padStart(4, '0')
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'approved': return 'bg-green-100 text-green-800'
    case 'printed': return 'bg-blue-100 text-blue-800'
    case 'emailed': return 'bg-purple-100 text-purple-800'
    case 'void': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}