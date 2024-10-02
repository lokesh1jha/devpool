import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type AuthFormProps = {
  mode: 'login' | 'signup'
  userType: 'jobseeker' | 'employer'
}

export function AuthForm({ mode, userType }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.ok) {
        router.push(`/dashboard/${userType}`)
      }
    } else {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: userType }),
      })
      if (response.ok) {
        router.push('/login')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className='flex justify-between'>
      <Button type="submit">
        {mode === 'login' ? 'Log in' : 'Sign up'}
      </Button>
      <Button type="button" variant="outline" onClick={() => signIn('google')}>
        {mode === 'login' ? 'Log in' : 'Sign up'} with Google
      </Button>
      </div>
    </form>
  )
}