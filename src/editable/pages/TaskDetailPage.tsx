import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Download,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, toPlainText } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const lead = toPlainText(summaryText(post))
  const body = toPlainText(getBody(post))
  return lead && lead !== body ? lead : ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroWrap({
  task,
  post,
  badge,
  actions,
  children,
}: {
  task: TaskKey
  post: SitePost
  badge: string
  actions?: ReactNode
  children?: ReactNode
}) {
  const image = getImages(post)[0] || getEditablePostImage(post)
  return (
    <section className="border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,#fff9f1_0%,#fbf5ec_100%)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-12 lg:px-8">
        <BackLink task={task} />
        <div className="mt-8 rounded-[2rem] bg-[#fb946f] px-6 py-5 text-[#241912] sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold uppercase tracking-[0.16em]">{badge}</p>
            <p className="text-sm font-semibold">Fresh discovery layout for Thursday, July 16, 2026</p>
          </div>
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{getEditableCategory(post)}</p>
            <h1 className="editable-display mt-5 text-5xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
              {post.title}
            </h1>
            {leadText(post) ? <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
            {children}
          </div>
          <div className="editable-striped-panel rounded-[2rem] p-5 sm:p-7">
            <div className="overflow-hidden rounded-[1.5rem] bg-white editable-card-shadow">
              <img src={image} alt={post.title} className="aspect-[16/11] w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DetailBody({ post }: { post: SitePost }) {
  return (
    <div
      className="article-content max-w-none text-[1.04rem] leading-8 text-[var(--tk-text)]"
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoTiles({ items }: { items: Array<{ label: string; value: string; icon: ReactNode }> }) {
  const visible = items.filter((item) => item.value)
  if (!visible.length) return null
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {visible.map((item) => (
        <div key={item.label} className="rounded-[1.5rem] border border-[var(--tk-line)] bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
            {item.icon} {item.label}
          </div>
          <p className="mt-3 break-words text-sm font-semibold leading-7 text-[var(--tk-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function GalleryStrip({ images, label, tall = false }: { images: string[]; label: string; tall?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{label}</p>
      <div className={`mt-4 grid gap-4 ${tall ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.map((image, index) => (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.5rem] bg-white editable-card-shadow">
            <img src={image} alt="" className={`w-full object-cover ${tall ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
          </div>
        ))}
      </div>
    </section>
  )
}

function QuickActions({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 editable-card-shadow">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-bold text-[var(--tk-on-accent)]">
            Website <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        {phone ? (
          <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-bold text-[var(--tk-text)]">
            <Phone className="h-4 w-4" /> Call
          </a>
        ) : null}
        {email ? (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-bold text-[var(--tk-text)]">
            <Mail className="h-4 w-4" /> Email
          </a>
        ) : null}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[#fffaf4]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="editable-display text-4xl font-semibold tracking-[-0.03em]">More to explore</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link
              key={item.id || item.slug}
              href={`${getTaskConfig(task)?.route || `/${task}`}/${item.slug}`}
              className="group overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white editable-card-shadow transition duration-300 hover:-translate-y-1"
            >
              <img src={getEditablePostImage(item)} alt={item.title} className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{getEditableCategory(item)}</p>
                <h3 className="mt-3 line-clamp-2 text-2xl font-semibold leading-tight text-[var(--tk-text)]">{item.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(item, 100)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <>
      <HeroWrap task="article" post={post} badge="Editorial feature" />
      <article className="mx-auto max-w-4xl px-6 py-14">
        <DetailBody post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <>
      <HeroWrap
        task="listing"
        post={post}
        badge="Business spotlight"
        actions={
          <>
            {website ? <Link href={website} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)]">Visit website</Link> : null}
            {phone ? <a href={`tel:${phone}`} className="rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-bold text-[var(--tk-text)]">Call now</a> : null}
          </>
        }
      />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-6 py-14 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <article className="space-y-10">
          <InfoTiles
            items={[
              { label: 'Location', value: address, icon: <MapPin className="h-4 w-4" /> },
              { label: 'Phone', value: phone, icon: <Phone className="h-4 w-4" /> },
              { label: 'Email', value: email, icon: <Mail className="h-4 w-4" /> },
              { label: 'Website', value: website, icon: <Globe2 className="h-4 w-4" /> },
            ]}
          />
          <DetailBody post={post} />
          <GalleryStrip images={images.slice(1, 5)} label="Business gallery" />
        </article>
        <aside className="space-y-6">
          <QuickActions website={website} phone={phone} email={email} />
        </aside>
      </section>
      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <>
      <HeroWrap
        task="classified"
        post={post}
        badge={price}
        actions={
          <>
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)]">Call seller</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-bold text-[var(--tk-text)]">Send email</a> : null}
          </>
        }
      >
        <div className="mt-6 flex flex-wrap gap-2">
          {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-4 py-2 text-sm font-bold text-[var(--tk-accent)]">{condition}</span> : null}
          {location ? <span className="rounded-full border border-[var(--tk-line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--tk-text)]">{location}</span> : null}
        </div>
      </HeroWrap>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-6 py-14 lg:grid-cols-[1fr_0.8fr] lg:px-8">
        <article className="space-y-10">
          <DetailBody post={post} />
        </article>
        <aside className="space-y-6">
          <QuickActions website={website} phone={phone} email={email} />
        </aside>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : [getEditablePostImage(post)]
  return (
    <>
      <HeroWrap task="image" post={post} badge="Image showcase" />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8">
        <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[1.8rem] bg-white editable-card-shadow">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <DetailBody post={post} />
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <HeroWrap
        task="sbm"
        post={post}
        badge="Saved resource"
        actions={
          website ? (
            <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)]">
              Open resource <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null
        }
      />
      <article className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <DetailBody post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <HeroWrap
        task="pdf"
        post={post}
        badge="Document library"
        actions={
          fileUrl ? (
            <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)]">
              Download <Download className="h-4 w-4" />
            </Link>
          ) : null
        }
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <article className="space-y-10">
            <DetailBody post={post} />
          </article>
          <aside>
            {fileUrl ? (
              <div className="overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white editable-card-shadow">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] px-5 py-4">
                  <span className="text-sm font-bold text-[var(--tk-text)]">Document preview</span>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-bold text-[var(--tk-on-accent)]">
                    Download <Download className="h-4 w-4" />
                  </Link>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[70vh] w-full bg-[var(--tk-raised)]" />
              </div>
            ) : (
              <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 text-sm leading-7 text-[var(--tk-muted)]">
                Document preview is not available for this item yet.
              </div>
            )}
          </aside>
        </div>
      </section>
      <RelatedStrip task="pdf" related={related} />
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])

  return (
    <>
      <HeroWrap
        task="profile"
        post={post}
        badge={role || 'Featured profile'}
        actions={
          <>
            {website ? <Link href={website} target="_blank" rel="noreferrer" className="rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)]">Visit site</Link> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-[var(--tk-line)] px-6 py-3 text-sm font-bold text-[var(--tk-text)]">Send email</a> : null}
          </>
        }
      />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-6 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <aside className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-7 text-center editable-card-shadow">
          <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
            {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-12 w-12 text-[var(--tk-muted)]" />}
          </div>
          <h2 className="editable-display mt-6 text-4xl font-semibold tracking-[-0.03em]">{post.title}</h2>
          {role ? <p className="mt-3 text-sm font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
          <div className="mt-6">
            <QuickActions website={website} email={email} />
          </div>
        </aside>
        <article className="space-y-10">
          <DetailBody post={post} />
          <GalleryStrip images={images.slice(1, 5)} label="Profile gallery" tall />
        </article>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}
