import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fbf5ec] text-[#241912]">
        <section className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-[var(--editable-container)] items-center gap-0 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="relative overflow-hidden rounded-t-[2.25rem] bg-[#241912] px-8 py-12 text-[#fff8f1] sm:px-12 lg:min-h-[39rem] lg:rounded-l-[2.25rem] lg:rounded-tr-none lg:py-16">
            <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full border-[34px] border-[#fb946f] opacity-90" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#ffae8d]"><Sparkles className="h-4 w-4" /> {pagesContent.auth.login.badge}</p>
                <h1 className="editable-display mt-7 max-w-md text-6xl font-semibold leading-[0.9] sm:text-7xl">{pagesContent.auth.login.title}</h1>
                <p className="mt-6 max-w-sm text-base leading-8 text-[#e6cfc0]">{pagesContent.auth.login.description}</p>
              </div>
              <div className="mt-14 border-t border-white/15 pt-6">
                <p className="text-sm font-semibold text-[#fff8f1]">A considered space for polished public work.</p>
                <p className="mt-2 text-sm leading-6 text-[#cdb3a4]">Pick up where you left off, refine a draft, or explore what is new.</p>
              </div>
            </div>
          </div>

          <div className="editable-striped-panel rounded-b-[2.25rem] p-3 lg:rounded-l-none lg:rounded-r-[2.25rem] lg:rounded-bl-none lg:p-5">
            <div className="h-full rounded-[1.8rem] bg-[#fffaf4] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d95b32]">Member access</p>
              <h2 className="editable-display mt-3 text-5xl leading-none">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-7 border-t border-[#ead9cb] pt-6 text-sm leading-6 text-[#715c50]">New here? <Link href="/signup" className="inline-flex items-center gap-1 font-bold text-[#bd4825] transition hover:text-[#241912]">{pagesContent.auth.login.createCta} <ArrowUpRight className="h-4 w-4" /></Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
