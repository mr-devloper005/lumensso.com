import Link from 'next/link'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  FileText,
  Globe,
  MapPin,
  Phone,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <section className="border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,#fff9f1_0%,#fbf5ec_100%)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-6 py-12 lg:px-8">
            <div className="rounded-[2rem] bg-[#fb946f] px-6 py-5 text-[#241912] sm:px-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.16em]">{theme.kicker}</p>
                <p className="text-sm font-semibold">Curated browsing for Thursday, July 16, 2026</p>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--tk-accent)]">{voice.eyebrow}</p>
                <h1 className="editable-display mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
                  {voice.headline}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--tk-muted)]">{voice.description}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-sm font-semibold text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 editable-soft-shadow">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">
                  <Search className="h-4 w-4" /> Filter archive
                </div>
                <p className="mt-4 text-sm leading-7 text-[var(--tk-muted)]">
                  <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span> posts showing in {categoryLabel.toLowerCase()}.
                </p>
                <form action={basePath} className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-12 w-full appearance-none rounded-full border border-[var(--tk-line)] bg-[#fff8f1] pl-4 pr-10 text-sm font-semibold text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--tk-accent)] px-6 text-sm font-bold text-[var(--tk-on-accent)] transition hover:brightness-95">
                    Apply
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8">
          {posts.length ? (
            <div className="grid gap-5 lg:grid-cols-12">
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug || `${index}`} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Try another category or return after new content is published.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-semibold transition hover:border-[var(--tk-accent)]">
                  Previous
                </Link>
              ) : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[#fff8f1] px-5 py-2.5 font-semibold text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-2.5 font-semibold transition hover:border-[var(--tk-accent)]">
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function cardSpan(task: TaskKey, index: number) {
  if (task === 'image') return 'lg:col-span-4'
  if (task === 'listing') return index % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
  if (task === 'profile') return index % 4 === 0 ? 'lg:col-span-6' : 'lg:col-span-3'
  return index % 5 === 0 ? 'lg:col-span-7' : index % 2 === 0 ? 'lg:col-span-5' : 'lg:col-span-4'
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} index={index} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} index={index} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} index={index} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--tk-accent)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${cardSpan('article', index)} overflow-hidden rounded-[2rem] border border-[var(--tk-line)] bg-white editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className={index % 3 === 0 ? 'grid sm:grid-cols-[0.9fr_1.1fr]' : ''}>
        <div className="overflow-hidden bg-[var(--tk-raised)]">
          <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
            {getEditableCategory(post)} | No. {String(index + 1).padStart(2, '0')}
          </p>
          <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1] tracking-[-0.03em] text-[var(--tk-text)]">
            {post.title}
          </h2>
          <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 180)}</p>
          <CardArrow label="Read article" />
        </div>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const logo = getEditablePostImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`group ${cardSpan('listing', index)} grid gap-5 rounded-[2rem] border border-[var(--tk-line)] bg-white p-6 editable-card-shadow transition duration-300 hover:-translate-y-1 sm:grid-cols-[116px_minmax(0,1fr)]`}>
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.4rem] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-8 w-8 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">Featured listing</p>
        <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 150)}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const price = getField(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`group ${cardSpan('classified', index)} rounded-[2rem] border border-[var(--tk-line)] bg-white p-6 editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-4xl font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">{price}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 180)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-sm text-[var(--tk-muted)]">
        <span>{location || 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)]" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${cardSpan('image', index)} block overflow-hidden rounded-[2rem] border border-[var(--tk-line)] bg-white editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className="relative overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className={`w-full object-cover transition duration-700 group-hover:scale-[1.04] ${index % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">{getEditableCategory(post)}</p>
          <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`group ${cardSpan('sbm', index)} rounded-[2rem] border border-[var(--tk-line)] bg-white p-6 editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">Saved resource</p>
      <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 170)}</p>
      {website ? <p className="mt-5 text-sm font-semibold text-[var(--tk-text)]">{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${cardSpan('pdf', index)} rounded-[2rem] border border-[var(--tk-line)] bg-white p-6 editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <Download className="h-5 w-5 text-[var(--tk-muted)]" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{getEditableCategory(post)}</p>
      <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 170)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const avatar = getEditablePostImage(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`group ${cardSpan('profile', index)} rounded-[2rem] border border-[var(--tk-line)] bg-white p-7 text-center editable-card-shadow transition duration-300 hover:-translate-y-1`}>
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role || 'Featured profile'}</p>
      <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getEditableExcerpt(post, 150)}</p>
    </Link>
  )
}
