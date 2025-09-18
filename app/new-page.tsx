"use client"
import React, { useState } from 'react'
import { AuthProvider, useAuth } from './components/auth/AuthProvider'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { NewCheckPage } from './components/checks/new-check/NewCheckPage'
import { ChecksList } from './components/checks/all-checks/ChecksList'
import { VendorsList } from './components/vendors/VendorsList'
import AuthComponentMain from './components/auth/AuthComponentMain'
import { BankAccountMain } from './components/accounts/BankAccountMain'

function AppContent() {
  const { user, loading } = useAuth()
  const [activeSection, setActiveSection] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthComponentMain />
  }

  const handleNewCheck = () => {
    setActiveSection('new-check')
  }

  const handleBackToChecks = () => {
    setActiveSection('all-checks')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard   />
      case 'new-check':
        return <NewCheckPage  />
      case 'all-checks':
        return <ChecksList  />
      case 'accounts':
        return <BankAccountMain />
      case 'vendors':
        return <VendorsList />
      case 'reports':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl text-muted-foreground">Reports Coming Soon</h2>
              <p className="text-muted-foreground">Check reports and analytics will be available here</p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl text-muted-foreground">Settings Coming Soon</h2>
              <p className="text-muted-foreground">Application settings and preferences will be available here</p>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-xl text-muted-foreground">Coming Soon</h2>
              <p className="text-muted-foreground">This section is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 flex-shrink-0">
        <Sidebar 
          
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
      
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}