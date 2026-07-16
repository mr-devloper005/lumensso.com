import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fbf5ec] text-[#241912]">
        <section className="mx-auto grid min-h-[calc(100vh-11rem)] max-w-[var(--editable-container)] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="editable-striped-panel rounded-[2.25rem] p-3 sm:p-5">
            <div className="rounded-[1.8rem] bg-[#fffaf4] px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d95b32]">Make it yours</p>
              <h1 className="editable-display mt-3 text-5xl leading-none">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-7 border-t border-[#ead9cb] pt-6 text-sm leading-6 text-[#715c50]">Already have an account? <Link href="/login" className="inline-flex items-center gap-1 font-bold text-[#bd4825] transition hover:text-[#241912]">{pagesContent.auth.signup.loginCta} <ArrowUpRight className="h-4 w-4" /></Link></p>
            </div>
          </div>

          <div className="px-3 py-8 sm:px-8 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d95b32]">{pagesContent.auth.signup.badge}</p>
            <h2 className="editable-display mt-6 max-w-lg text-6xl font-semibold leading-[0.9] sm:text-7xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[#715c50]">{pagesContent.auth.signup.description}</p>
            <div className="mt-10 grid gap-4 border-y border-[#e6d4c5] py-7 text-sm font-semibold text-[#4a3327]">
              {['Save drafts while ideas are fresh', 'Build a clear, polished presence', 'Return anytime to continue your work'].map((item) => (
                <p key={item} className="flex items-center gap-3"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f9d7c8] text-[#b94322]"><Check className="h-4 w-4" /></span>{item}</p>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
