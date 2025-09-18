
const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY!
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-69821625`

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch((e) => ({ error: `Network error : ${e}` }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Check methods
  async getChecks() {
    return this.request('/checks')
  }

  async createCheck(checkData: any) {
    return this.request('/checks', {
      method: 'POST',
      body: JSON.stringify(checkData),
    })
  }

  async updateCheck(id: string, checkData: any) {
    return this.request(`/checks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(checkData),
    })
  }

  async deleteCheck(id: string) {
    return this.request(`/checks/${id}`, {
      method: 'DELETE',
    })
  }

  // Bank account methods
  async getBankAccounts() {
    return this.request('/bank-accounts')
  }

  async createBankAccount(accountData: any) {
    return this.request('/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    })
  }

  // delete bank account 
  async deleteBankAccount(id: string) {
    return this.request(`/bank-accounts/${id}`, {
      method: 'DELETE',
    })
  }

  // edit back account 
  async updateBankAccount(id: string, accountData: any) {
    return this.request(`/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    })
  }

  // Vendor methods
  async getVendors() {
    return this.request('/vendors')
  }

  async createVendor(vendorData: any) {
    return this.request('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    })
  }

  async deleteVendor(id: string) {
    return this.request(`/vendors/${id}`, {
      method: 'DELETE',
    })
  }

  async updateVendor(id: string, vendorData: any) {
    return this.request(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    })
  }
}

export const api = new ApiClient()

export interface Check {
  id: string
  checkNo: number
  date: string
  payee: string
  amount: number // in cents
  amountWords: string
  memo: string
  bankAccount: string
  status: 'created' | 'printed' | 'void'
  createdAt: string
  updatedAt: string
}

export interface BankAccount {
  id: string
  name: string
  routingNumber: string
  accountNumber: string
  address: string
  startingCheckNo: number
  nextCheckNo: number
  createdAt: string
}

export interface Vendor {
  id: string
  name: string
  address: string
  email: string
  defaultMemo: string
  createdAt: string
}