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

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const { user, logout } = useAuth()

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-check', name: 'New Check', icon: Plus },
    { id: 'all-checks', name: 'All Checks', icon: FileText },
    { id: 'accounts', name: 'Bank Accounts', icon: Building2 },
    { id: 'vendors', name: 'Vendors', icon: Users },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]



  return (
    <div className="flex flex-col h-full bg-white border-r border-border">
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
              <Button
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start",
                  activeSection === item.id && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.name}
              </Button>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}