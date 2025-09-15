import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from './AuthProvider'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const { login, signup, loginDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          toast.error('Please enter your name')
          return
        }
        await signup(email, password, name)
        toast.success('Account created! Please check your email to verify your account.')
        setIsSignUp(false) // Switch back to login form
      } else {
        await login(email, password)
        toast.success('Successfully signed in')
      }
    } catch (error : any) {
      if (error?.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and confirm your account before signing in')
      } else if (error.message?.includes('User already registered')) {
        toast.error('An account with this email already exists. Please sign in instead.')
        setIsSignUp(false)
      } else {
        toast.error(error.message || `Failed to ${isSignUp ? 'create account' : 'sign in'}`)
      }
    } finally {
      setLoading(false)
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
            {isSignUp ? 'Create your account to get started' : 'Sign in to your account to continue'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
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
                  placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={isSignUp ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
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
            
            <Button 
              variant="outline" 
              onClick={() => loginDemo()}
              className="w-full"
            >
              Try Demo
            </Button>
          </div>

          <div className="mt-4 text-center space-y-2">
            <Button 
              variant="link" 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
            {!isSignUp && (
              <div>
                <Button variant="link" className="text-sm text-muted-foreground">
                  Forgot your password?
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}