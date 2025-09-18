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
  Users,
  CircleOff
} from 'lucide-react'
import { formatCurrency, getStatusColor, formatCheckNumber } from '../../lib/utils'
import LoadingState from '@/app/shared/LoadingState'
import { useGetChecks } from '@/app/services/hooks/useCheck'
import { useRouter } from 'next/navigation'
 
 

export function Dashboard( ) {
  const {data:checks, isPending} = useGetChecks()
  const router = useRouter()
   // Calculate stats from real data
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthChecks = checks?.filter(check => {
    const checkDate = new Date(check?.date)
    return checkDate?.getMonth() === currentMonth && checkDate?.getFullYear() === currentYear
  })

  const stats = {
    checksThisMonth: thisMonthChecks?.length,
    totalAmount: thisMonthChecks?.reduce((sum, check) => sum + check.amount, 0),
    voidChecks: checks?.filter(check => check?.status === 'void').length,
    printedChecks: checks?.filter(check => check?.status === 'printed').length
  }

  const recentChecks = checks
    ?.sort((a, b) => new Date(b?.created_at).getTime() - new Date(a?.created_at).getTime())
    ?.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Overview of your check printing activity</p>
        </div>
        <Button onClick={() => router.push("/new-check")} className="bg-emerald-600 cursor-pointer hover:bg-emerald-700" >
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
            <div className="text-2xl">{isPending ? "Loading..." : stats.checksThisMonth}</div>
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
            <div className="text-2xl">{isPending ? "Loading..." :stats.printedChecks}</div>
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
            <div className="text-2xl">{isPending ? "Loading..." : formatCurrency(stats?.totalAmount!)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Void Checks</CardTitle>
            <CircleOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{isPending ? "Loading..." : stats.voidChecks}</div>
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
            {isPending ? (
              <div className="flex items-center justify-center h-32">
                <LoadingState />
              </div>
            ) : recentChecks?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No checks yet</h3>
                <p className="text-muted-foreground mb-4">Create your first check to get started</p>
                <Button  className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Check
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentChecks?.map((check) => (
                  <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">{check.payee}</p>
                        <p className="text-xs text-muted-foreground">Check #{formatCheckNumber(check?.check_no)}</p>
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
              <Button onClick={() => router.push('/all-checks')} variant="outline" className="w-full cursor-pointer">
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
              <Button onClick={() => router.push('/new-check')} variant="outline" className="h-20 flex-col cursor-pointer" >
                <Plus className="h-6 w-6 mb-2" />
                New Check
              </Button>
              <Button onClick={() => router.push('/all-checks')} variant="outline" className="h-20 flex-col cursor-pointer" >
                <FileText className="h-6 w-6 mb-2" />
                All Checks
              </Button>
              <Button onClick={() => router.push('/bank-accounts')} variant="outline" className="h-20 flex-col cursor-pointer" >
                <Building2 className="h-6 w-6 mb-2" />
                Bank Accounts
              </Button>
              <Button onClick={() => router.push('/vendors')} variant="outline" className="h-20 flex-col cursor-pointer" >
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