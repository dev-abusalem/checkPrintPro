'use client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { AuthProvider } from './components/auth/AuthProvider'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Create a client
const queryClient = new QueryClient()

const ClientLayoutProviders = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ProtectedRoute>{children}</ProtectedRoute>
     </QueryClientProvider>
     </AuthProvider>
    </>
  )
}

export default ClientLayoutProviders