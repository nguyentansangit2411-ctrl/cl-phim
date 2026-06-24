'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    setError(null)
    // Email confirmation đã bị tắt trong Supabase Dashboard
    // nên không cần emailRedirectTo — user có thể đăng nhập ngay
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })
    setLoading(false)
    if (error) {
      setError(mapAuthError(error.message))
      return false
    }
    return true
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(mapAuthError(error.message))
      return false
    }
    router.push('/')
    router.refresh()
    return true
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return { signUp, signIn, signOut, loading, error }
}

function mapAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email hoặc mật khẩu không đúng'
  if (message.includes('Email not confirmed')) return 'Vui lòng xác nhận email của bạn'
  if (message.includes('User already registered')) return 'Email này đã được đăng ký'
  if (message.includes('Password should be')) return 'Mật khẩu phải có ít nhất 6 ký tự'
  return 'Đã có lỗi xảy ra. Vui lòng thử lại.'
}
