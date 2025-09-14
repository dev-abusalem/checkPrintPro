'use client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

const ClientLayoutProviders = ({children}:{children:React.ReactNode}) => {
  return (
    <>   
    <QueryClientProvider client={queryClient}>
       {children}
    </QueryClientProvider>
    </>
  )
}

export default ClientLayoutProviders