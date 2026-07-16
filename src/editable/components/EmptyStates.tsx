import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('editable-striped-panel rounded-[2rem] p-3', className)}>
      <div className="rounded-[1.55rem] border border-[#e9d9cc] bg-[#fffaf4] px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fce1d4] text-[#d94f26]">
        <SearchX className="h-6 w-6" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#d94f26]">A quiet corner</p>
      <h2 className="editable-display mt-3 text-4xl leading-none tracking-[-0.03em] text-[#241912]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6f6259]">{description}</p>
      <Link href={actionHref} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#241912] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d94f26]">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
      </div>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`New ${taskLabel} will appear here as soon as they are published. Check back soon for fresh ideas and useful discoveries.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
