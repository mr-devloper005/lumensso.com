'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Mail, UserRound } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'

const USERS_KEY = 'slot4:local-auth-users'
const SESSION_KEY = 'slot4:local-auth-session'

type LocalUser = {
  name: string
  email: string
  password: string
  createdAt: string
}

const readUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveUsers = (users: LocalUser[]) => window.localStorage.setItem(USERS_KEY, JSON.stringify(users))

const saveSession = (user: Pick<LocalUser, 'name' | 'email'>) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, loggedInAt: new Date().toISOString() }))
  window.dispatchEvent(new Event('slot4-auth-change'))
}

const inputClass = 'h-12 w-full rounded-xl border border-[#e7d7ca] bg-white px-4 pl-11 text-sm font-semibold text-[#241912] outline-none transition placeholder:text-[#a68c7d] focus:border-[#d95b32] focus:ring-4 focus:ring-[#f9d7c8]'
const buttonClass = 'inline-flex h-12 w-full items-center justify-center rounded-full bg-[#241912] px-6 text-sm font-bold text-white transition hover:bg-[#d95b32] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'

function Field({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#715c50]">
      {label}
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-[#d95b32]">{icon}</span>
        {children}
      </span>
    </label>
  )
}

export function EditableLocalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    const user = readUsers().find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      setStatus('error')
      setMessage(pagesContent.auth.login.noAccount)
      return
    }
    saveSession(user)
    setStatus('success')
    setMessage(pagesContent.auth.login.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-7 grid gap-5" onSubmit={submit}>
      <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
        <input className={inputClass} type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </Field>
      <Field label="Password" icon={<LockKeyhole className="h-4 w-4" />}>
        <input className={inputClass} type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </Field>
      {message ? <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-[#fce4db] text-[#a94020]'}`}>{message}</p> : null}
      <button type="submit" className={buttonClass}>{pagesContent.auth.login.submitLabel}</button>
    </form>
  )
}

export function EditableLocalSignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (password.length < 4) {
      setStatus('error')
      setMessage(pagesContent.auth.signup.passwordShort)
      return
    }
    const users = readUsers()
    const nextUser: LocalUser = {
      name: normalizedName || normalizedEmail.split('@')[0] || 'Member',
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    }
    saveUsers([nextUser, ...users.filter((item) => item.email.toLowerCase() !== normalizedEmail)])
    saveSession(nextUser)
    setStatus('success')
    setMessage(pagesContent.auth.signup.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-7 grid gap-5" onSubmit={submit}>
      <Field label="Full name" icon={<UserRound className="h-4 w-4" />}>
        <input className={inputClass} placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} required />
      </Field>
      <Field label="Email address" icon={<Mail className="h-4 w-4" />}>
        <input className={inputClass} type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </Field>
      <Field label="Choose a password" icon={<LockKeyhole className="h-4 w-4" />}>
        <input className={inputClass} type="password" placeholder="At least 4 characters" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </Field>
      {message ? <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-[#fce4db] text-[#a94020]'}`}>{message}</p> : null}
      <button type="submit" className={buttonClass}>{pagesContent.auth.signup.submitLabel}</button>
    </form>
  )
}

export function useEditableLocalAuthSession() {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const load = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
        setSession(parsed && typeof parsed.email === 'string' ? parsed : null)
      } catch {
        setSession(null)
      }
    }
    load()
    window.addEventListener('slot4-auth-change', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('slot4-auth-change', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('slot4-auth-change'))
    setSession(null)
  }

  return { session, logout }
}
