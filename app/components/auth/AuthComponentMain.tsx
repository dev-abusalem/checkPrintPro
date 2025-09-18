import React, { useState } from 'react'
import { SignupForm } from './SignupForm'
import { LoginForm } from './LoginForm'

const AuthComponentMain = () => {
    const [isSignUp, setIsSignUp] = useState(false)
  return (
    <>
        {
            isSignUp ? <SignupForm  setIsSignUp={setIsSignUp} /> : <LoginForm setIsSignUp={setIsSignUp}/>
        }
    </>
  )
}

export default AuthComponentMain