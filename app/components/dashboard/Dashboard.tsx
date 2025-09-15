"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp,
  Plus,
  Eye,
  Building2,
  Users
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatCheckNumber } from '../../lib/utils'
import { api, type Check } from '../../utils/api'
import { toast } from 'sonner'

interface DashboardProps {
  onNewCheck?: () => void
  setActiveSection: React.Dispatch<React.SetStateAction<string>>
}

export function Dashboard({ onNewCheck,setActiveSection }: DashboardProps) {
  const [checks, setChecks] = useState<Check[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChecks()
  }, [])

  const loadChecks = async () => {
    try {
      const response = await api.getChecks()
      setChecks(response.checks || [])
    } catch (error) {
      console.error('Error loading checks:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthChecks = checks.filter(check => {
    const checkDate = new Date(check.date)
    return checkDate.getMonth() === currentMonth && checkDate.getFullYear() === currentYear
  })

  const stats = {
    checksThisMonth: thisMonthChecks.length,
    totalAmount: thisMonthChecks.reduce((sum, check) => sum + check.amount, 0),
    voidChecks: checks.filter(check => check.status === 'void').length,
    printedChecks: checks.filter(check => check.status === 'printed').length
  }

  const recentChecks = checks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Overview of your check printing activity</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onNewCheck}>
          <Plus className="h-4 w-4 mr-2" />
          New Check
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Checks This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.checksThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Printed Checks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.printedChecks}</div>
            <p className="text-xs text-muted-foreground">
              Total printed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Void Checks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.voidChecks}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Checks</CardTitle>
            <CardDescription>Latest check activity in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : recentChecks.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No checks yet</h3>
                <p className="text-muted-foreground mb-4">Create your first check to get started</p>
                <Button onClick={onNewCheck} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Check
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentChecks.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">{check.payee}</p>
                        <p className="text-xs text-muted-foreground">Check #{formatCheckNumber(check.checkNo)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatCurrency(check.amount)}</p>
                      <Badge variant="secondary" className={getStatusColor(check.status)}>
                        {check.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Button onClick={()=>setActiveSection('all-checks')} variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Checks
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col" onClick={onNewCheck}>
                <Plus className="h-6 w-6 mb-2" />
                New Check
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                All Checks
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Building2 className="h-6 w-6 mb-2" />
                Bank Accounts
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Vendors
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}