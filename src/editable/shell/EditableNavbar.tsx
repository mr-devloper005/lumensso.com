'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile').map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-[#d97050] bg-[#fb946f] text-[#241912] shadow-[0_8px_22px_rgba(77,36,23,0.12)]">
      <nav className="mx-auto max-w-[var(--editable-container)] px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="shrink-0">
            <span className="editable-display block text-[2rem] font-semibold leading-none text-[#241912]">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <div className="hidden items-center gap-4 xl:flex">
            {navItems.slice(0, 4).map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href} className={`text-xs font-bold uppercase tracking-[0.12em] transition ${active ? 'text-white' : 'text-[#513324] hover:text-white'}`}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          <form action="/search" className="hidden min-w-0 flex-1 md:block">
            <label className="flex h-11 items-center gap-3 rounded-xl border border-[#e9a083] bg-[#fffaf4] px-4 shadow-sm">
              <Search className="h-4 w-4 shrink-0 text-[#6f5546]" />
              <input
                name="q"
                type="search"
                placeholder="Search profiles, image sets, and ideas"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#251812] outline-none placeholder:text-[#9b7d6c]"
              />
            </label>
          </form>

          <div className="ml-auto hidden items-center gap-4 lg:flex">
            {globalContent.nav.utilityLinks.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
                    active ? 'text-white' : 'text-[#513324] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            {session ? (
              <>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-full bg-[#241912] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#241912]"
                >
                  <PlusCircle className="h-4 w-4" /> Create
                </Link>
                <button type="button" onClick={logout} className="text-sm font-semibold text-[#513324] transition hover:text-white">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#513324] transition hover:text-white">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-[#241912] bg-[#fffaf4] px-5 py-2.5 text-sm font-bold text-[#241912] transition hover:bg-[#241912] hover:text-white"
                >
                  <UserPlus className="h-4 w-4" /> Sign up
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#b95638] bg-[#fffaf4] text-[#241912] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <form action="/search" className="mt-4 md:hidden">
          <label className="flex h-11 items-center gap-3 rounded-xl border border-[#e9a083] bg-[#fffaf4] px-4">
            <Search className="h-4 w-4 shrink-0 text-[#6f5546]" />
            <input
              name="q"
              type="search"
              placeholder="Search profiles and ideas"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#251812] outline-none placeholder:text-[#9b7d6c]"
            />
          </label>
        </form>
      </nav>

      {open ? (
        <div className="border-t border-[#d97050] bg-[#fb946f] px-4 py-5 lg:hidden">
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? 'bg-[#241912] text-white' : 'bg-[#fffaf4] text-[#3c2a20] hover:bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[#241912] px-4 py-3 text-sm font-bold text-white"
                >
                  Create
                </Link>
                <button type="button" onClick={logout} className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-[#3c2a20]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#3c2a20]">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl bg-[#241912] px-4 py-3 text-sm font-bold text-white">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
