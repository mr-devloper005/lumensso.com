'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-xl border border-[#e7d7ca] bg-white px-4 py-3 text-sm font-semibold text-[#241912] outline-none transition placeholder:text-[#a68c7d] focus:border-[#d95b32] focus:ring-4 focus:ring-[#f9d7c8]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'image' && task.key !== 'profile'), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#fbf5ec] px-4 py-12 text-[#241912] sm:px-6 lg:px-8">
          <section className="editable-striped-panel mx-auto grid max-w-5xl gap-3 rounded-[2.5rem] p-3 md:grid-cols-[0.85fr_1.15fr] md:p-5">
            <div className="flex min-h-72 items-center justify-center rounded-[2rem] bg-[#241912] text-[#fff8f1]">
              <div className="text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#ffb18f]/40 bg-white/5"><Lock className="h-9 w-9" /></span><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#ffb18f]">Private workspace</p></div>
            </div>
            <div className="self-center rounded-[2rem] bg-[#fffaf4] p-8 sm:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d95b32]">{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-5 text-6xl font-semibold leading-[0.9] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#715c50]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#241912] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#d95b32]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[#d9c4b5] bg-white px-6 py-3 text-sm font-bold transition hover:border-[#d95b32]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fbf5ec] text-[#241912]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="editable-paper-grid grid gap-3 rounded-[2.5rem] bg-[#efdcd0] p-3 shadow-[0_30px_80px_rgba(66,37,23,0.1)] lg:grid-cols-[0.82fr_1.18fr] lg:p-5">
            <aside className="rounded-[2rem] bg-[#241912] p-7 text-[#fff8f1] sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffb18f]">{pagesContent.create.hero.badge}</p>
              <h1 className="editable-display mt-5 text-6xl font-semibold leading-[0.9] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#e7cfc1]">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`rounded-2xl border p-4 text-left transition ${active ? 'border-[#fb946f] bg-[#fb946f] text-[#241912]' : 'border-white/15 bg-white/5 text-[#fff8f1] hover:-translate-y-0.5 hover:bg-white/10'}`}>
                      <Icon className="h-5 w-5" />
                      <span className="mt-3 block text-sm font-black">{item.label}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-65">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[2rem] bg-[#fffaf4] p-6 sm:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d95b32]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="editable-display mt-2 text-5xl leading-none">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-[#f9dfd1] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#914125]">{session.name}</span>
              </div>

              <div className="mt-6 grid gap-4">
                <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
              </div>

              {created ? (
                <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                  <p className="flex items-center gap-2 text-sm font-bold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm font-semibold opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#241912] px-6 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-[#d95b32]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
