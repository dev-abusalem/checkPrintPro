'use client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Sidebar } from './components/layout/Sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useState } from 'react'
import { AuthProvider, useAuth } from './components/auth/AuthProvider'
import { LoginForm } from './components/auth/LoginForm'

// Create a client
const queryClient = new QueryClient()

const ClientLayout = ({children}:{children:React.ReactNode}) => {
  const { user, loading } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')
  

  return (
    <>   
    <AuthProvider>
    {
      loading ?  <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>:
      !user ? <LoginForm />
      :
      <QueryClientProvider client={queryClient}>
       
       <div className="flex h-screen bg-background">
      <div className="w-64 flex-shrink-0">
        <Sidebar
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
      <Toaster richColors   />
    </div>
    </QueryClientProvider>
    }
    </AuthProvider>
    </>
  )
}

 
const ClientLayoutProviders = ({children}:{children:React.ReactNode}) => {
  return (
        <AuthProvider>
         <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
  )
}

 export default ClientLayoutProviders