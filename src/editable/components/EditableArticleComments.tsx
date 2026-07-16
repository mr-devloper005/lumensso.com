'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const minutes = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return days < 30 ? `${days} ${days === 1 ? 'day' : 'days'} ago` : new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      // Storage can be unavailable in private browsing; retain the session view.
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const comment = text.trim()
    if (!comment) return
    persist([{ id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: name.trim() || 'Guest', comment, createdAt: new Date().toISOString() }, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 border-t border-[var(--tk-line)] pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">Conversation</p>
          <h2 className="editable-display mt-2 text-4xl leading-none">Notes from readers</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-4 py-2 text-sm font-bold text-[var(--tk-accent)]"><MessageCircle className="h-4 w-4" /> {all.length} replies</span>
      </div>

      <form onSubmit={submit} className="mt-7 rounded-[1.75rem] border border-[var(--tk-line)] bg-[#fffdf9] p-5 shadow-sm sm:p-7">
        <div className="grid gap-3 sm:grid-cols-[0.7fr_1.3fr]">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name (optional)" maxLength={60} className="h-12 rounded-xl border border-[var(--tk-line)] bg-white px-4 text-sm outline-none transition focus:border-[var(--tk-accent)]" />
          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Add a thoughtful note..." rows={3} maxLength={1500} className="min-h-28 resize-y rounded-xl border border-[var(--tk-line)] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--tk-accent)] sm:row-span-2" />
          <p className="text-sm leading-6 text-[var(--tk-muted)]">Keep it useful, kind, and relevant to the story.</p>
          <button type="submit" disabled={!text.trim()} className="inline-flex w-fit items-center gap-2 rounded-full bg-[#241912] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--tk-accent)] disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /> Share note</button>
        </div>
      </form>

      <div className="mt-7 grid gap-4">
        {all.map((comment) => (
          <article key={comment.id} className="rounded-[1.5rem] border border-[var(--tk-line)] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-sm font-bold text-[var(--tk-accent)]">{initial(comment.name)}</span>
              <div><p className="text-sm font-bold">{comment.name || 'Guest'}</p>{comment.createdAt ? <p className="mt-0.5 text-xs text-[var(--tk-muted)]">{timeAgo(comment.createdAt)}</p> : null}</div>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[var(--tk-text)]">{comment.comment}</p>
          </article>
        ))}
        {!all.length ? <div className="rounded-[1.5rem] border border-dashed border-[var(--tk-line)] bg-white/60 p-7 text-sm text-[var(--tk-muted)]">No notes yet. Start the conversation with a helpful perspective.</div> : null}
      </div>
    </section>
  )
}
