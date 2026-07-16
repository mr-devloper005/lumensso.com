'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto border-t border-[rgba(92,60,42,0.14)] bg-[#241912] text-[#f8efe7]">
      <div className="bg-[#f38a67] px-4 py-4 text-center text-sm font-bold text-[#241912] sm:px-6">
        Explore fresh visual stories, business profiles, and image-first inspiration updated for Thursday, July 16, 2026.
      </div>

      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.9fr] lg:px-8">
        <div>
          <Link href="/" className="editable-display text-4xl font-semibold text-[#ff8d5a]">
            {SITE_CONFIG.name}
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#d9c5b8]">{globalContent.footer.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {taskLinks.slice(0, 5).map((task) => (
              <Link
                key={task.key}
                href={task.route}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f7e7dc] transition hover:border-[#ff8d5a]/40 hover:text-[#ffb18f]"
              >
                {task.label}
              </Link>
            ))}
          </div>
        </div>

        {globalContent.footer.columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#ffb18f]">{column.title}</h3>
            <div className="mt-4 grid gap-3">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">
                  {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#ffb18f]">Account</h3>
          <div className="mt-4 grid gap-3">
            {session ? (
              <>
                <Link href="/create" className="text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">Create</Link>
                <button type="button" onClick={logout} className="text-left text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">Login</Link>
                <Link href="/signup" className="text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">Sign up</Link>
              </>
            )}
            <Link href="/contact" className="text-sm font-medium text-[#e8d8ce] transition hover:text-[#ffb18f]">Support</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col gap-3 px-4 py-5 text-sm text-[#c8b1a3] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{globalContent.footer.bottomNote}</p>
          <p>
            Copyright {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
