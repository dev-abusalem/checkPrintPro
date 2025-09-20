"use client"
 import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useLoginUser } from '@/app/services/hooks/useUser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
   const { mutate:login , isPending} = useLoginUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()
    try {
      login({email, password}, {
        onSuccess: () => {
          router.push('/')
        }
      })
    } catch (error: any) {
      console.log(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-emerald-600 rounded"></div>
                    </div>
                  </div>
                  <CardTitle className="text-center">CheckPrint Pro</CardTitle>
                  <CardDescription className="text-center">
                    Sign in to your account to continue 
                  </CardDescription>
                </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or try demo</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => {router.push('/demo')}} disabled={isPending} className="w-full">
              Try Demo
            </Button>
            <div className="mt-4 text-center space-y-2">
                        <Link href="/register" 
                           className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          Don't have an account? Sign up
                        </Link>
                           <div>
                            <Button onClick={() => {router.push('/forgot-password')}} variant="link" className="text-sm text-muted-foreground">
                              Forgot your password?
                            </Button>
                          </div>
                       </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
