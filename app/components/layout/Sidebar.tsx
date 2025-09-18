import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  
} from 'lucide-react'
import { cn } from '../../lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Sidebar() {

  const path = usePathname()
  const {logout, user} = useAuth()
  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard , href:"/" },
    { id: 'new-check', name: 'New Check', icon: Plus, href:"/new-check" },
    { id: 'all-checks', name: 'All Checks', icon: FileText , href:"/all-checks" },
    { id: 'accounts', name: 'Bank Accounts', icon: Building2 , href:"/bank-accounts" },
    { id: 'vendors', name: 'Vendors', icon: Users, href:"/vendors" },
    { id: 'reports', name: 'Reports', icon: BarChart3, href:"/reports" },
    { id: 'settings', name: 'Settings', icon: Settings, href:"/settings" },
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex flex-col h-full bg-white lg:border-r lg:border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-emerald-600 rounded"></div>
          </div>
          <div>
            <h2 className="text-sm">CheckPrint Pro</h2>
            <p className="text-xs text-muted-foreground">Secure Check Management</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div>
          <p className="text-sm truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.id}>
              <Link href={item.href}
                className={cn(
                  "w-full  flex justify-start items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 ease-in-out",
                  item.href === path && "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                )}
               >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Link>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}