import Link from 'next/link'
import { ArrowRight, Camera, ChevronRight, MapPin, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function moneyLabel(post: SitePost, fallback: string) {
  const content = post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const price =
    (typeof content.price === 'string' && content.price) ||
    (typeof content.amount === 'string' && content.amount) ||
    (typeof content.budget === 'string' && content.budget) ||
    ''
  return price || fallback
}

function latestPool(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function FeaturedHeroCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-[rgba(92,60,42,0.14)] bg-[#f8efde] lg:grid-cols-[0.75fr_1.45fr] editable-soft-shadow">
      <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-14">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#29405c]">{pagesContent.home.hero.badge}</p>
        <h2 className="editable-display mt-5 text-5xl font-semibold leading-[0.95] text-[#1f1711] sm:text-6xl">
          {post?.title || pagesContent.home.hero.title.join(' ')}
        </h2>
        <p className="mt-5 max-w-lg text-base leading-8 text-[#5c473a]">
          {getEditableExcerpt(post, 180) || pagesContent.home.hero.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-full bg-[#261b14] px-6 py-3 text-sm font-bold text-white">
            Browse collection
          </span>
          <span className="inline-flex items-center rounded-full bg-[#261b14] px-6 py-3 text-sm font-bold text-white">
            Explore profiles
          </span>
        </div>
      </div>
      <div className="editable-striped-panel p-5 sm:p-7">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white">
          <img
            src={getEditablePostImage(post)}
            alt={post.title}
            className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute right-5 top-5 flex h-28 w-28 items-center justify-center rounded-full bg-[#df5a1c] p-5 text-center text-sm font-semibold leading-tight text-white sm:h-36 sm:w-36 sm:text-base">
            New visual spotlight
          </div>
        </div>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.8rem] bg-white editable-card-shadow transition duration-300 hover:-translate-y-1">
      <div className="overflow-hidden rounded-[1.8rem] bg-[#f7efe4]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="px-4 py-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#e1663a]">New</p>
        <h3 className="mt-2 text-xl font-semibold text-[#241912]">{post.title}</h3>
        <p className="mt-3 text-sm font-semibold text-[#5d4638]">{moneyLabel(post, 'From curated collections')}</p>
      </div>
    </Link>
  )
}

function CompactCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.5rem] border border-[rgba(92,60,42,0.1)] bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-[#ef8b68]">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[1rem] bg-[#faf2e8]">
          <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e1663a]">{getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight text-[#221712]">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[1.8rem] border border-[rgba(92,60,42,0.1)] bg-white editable-card-shadow transition duration-300 hover:-translate-y-1 sm:grid-cols-[1.1fr_0.9fr]">
      <div className="p-6 sm:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#e1663a]">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-4 text-4xl font-semibold leading-[0.95] text-[#241912]">{post.title}</h3>
        <p className="mt-4 text-base leading-7 text-[#664f40]">{getEditableExcerpt(post, 160)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#241912]">
          Explore now <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="overflow-hidden bg-[#f7efe4]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="grid gap-4 border-b border-[rgba(92,60,42,0.12)] py-5 transition hover:text-[#e1663a] sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[1.2rem] bg-[#f7efe4]">
        <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#e1663a]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-semibold leading-tight text-[#241912]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#644f42]">{getEditableExcerpt(post, 120)}</p>
      </div>
    </Link>
  )
}

function ProductMatrixCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group text-center">
      <div className="mx-auto flex h-52 items-center justify-center overflow-hidden rounded-[1.6rem] bg-white editable-card-shadow">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-[#241912]">{post.title}</h3>
      <p className="mt-3 text-sm font-bold text-[#402b1f]">{moneyLabel(post, 'From featured collections')}</p>
    </Link>
  )
}

function splitPools(posts: SitePost[], timeSections: HomeTimeSection[]) {
  const pool = latestPool(posts, timeSections)
  return {
    hero: pool[0],
    category: pool.slice(0, 10),
    newNow: pool.slice(1, 7),
    trio: pool.slice(7, 10),
    matrix: pool.slice(10, 20),
    editorial: pool.slice(20, 26),
  }
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = splitPools(posts, timeSections)
  const heroPost = pool.hero || posts[0]

  return (
    <section className="bg-[#fffdf8] pb-8">
      <div className={container}>
        {heroPost ? <FeaturedHeroCard post={heroPost} href={postHref(primaryTask, heroPost, primaryRoute)} /> : null}
      </div>
    </section>
  )
}

export function EditableStoryRail(_props: HomeSectionProps) {
  return (
    <section className="bg-[#fffdf8] pb-10 pt-4 sm:pb-14 sm:pt-8">
      <div className={container}>
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f2433]">Just arrived</p>
          <h2 className="editable-display mt-4 text-5xl font-semibold text-[#221712] sm:text-6xl">What's new, right now.</h2>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = splitPools(posts, timeSections)
  if (!pool.newNow.length) return null

  return (
    <section className="bg-[#fffdf8] pb-16">
      <div className={container}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-6">
          {pool.newNow.map((post) => (
            <ImageFirstCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f2433]">Souvenirs of the season</p>
          <h2 className="editable-display mt-4 text-5xl font-semibold text-[#221712] sm:text-6xl">
            Keep your best impressions close at hand.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {pool.trio.map((post) => (
            <div key={post.id || post.slug} className="text-center">
              <Link href={postHref(primaryTask, post, primaryRoute)} className="group block overflow-hidden rounded-[1.5rem] bg-white editable-card-shadow">
                <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/4] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              </Link>
              <h3 className="editable-display mt-5 text-3xl font-semibold text-[#241912]">{post.title}</h3>
              <Link href={postHref(primaryTask, post, primaryRoute)} className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#241912]">
                Explore <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = splitPools(posts, timeSections)

  return (
    <>
      <section className="bg-[#fffdf8] py-16">
        <div className={container}>
          <div className="text-center">
            <h2 className="editable-display text-5xl font-semibold text-[#221712] sm:text-6xl">
              Create something polished and memorable.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pool.editorial.slice(0, 3).map((post) => (
              <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] bg-[#f6ead8] p-6 sm:p-8">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#1f2433]">Editorial picks</p>
              <div className="mt-5">
                {pool.editorial.slice(3).map((post) => (
                  <EditorialListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {pool.matrix.slice(0, 4).map((post) => (
                <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffdf8] pb-20">
        <div className={container}>
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#1f2433]">Featured collection</p>
            <h2 className="editable-display mt-4 text-5xl font-semibold text-[#221712] sm:text-6xl">
              Browse standout visuals, profiles, and presentation-ready posts.
            </h2>
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {pool.matrix.slice(4).map((post) => (
              <ProductMatrixCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link href={primaryRoute} className="inline-flex items-center gap-2 rounded-full border border-[#dfc6b4] bg-white px-7 py-3 text-sm font-bold text-[#2a1b14] transition hover:border-[#f08c67] hover:text-[#d45d2f]">
              See more from {taskLabel(primaryTask)} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[#fb946f]">
      <div className={`${container} py-16 text-center sm:py-20`}>
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-[#fff7f1] px-8 py-12 editable-soft-shadow">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#e1663a]">Ready to share</p>
          <h2 className="editable-display mt-4 text-5xl font-semibold text-[#221712] sm:text-6xl">
            Put your next profile, image story, or article in front of the right audience.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#654f41]">
            Publish into a warm, polished browsing experience built for visual confidence and clear discovery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[#261b14] px-7 py-3 text-sm font-bold text-white">
              Create a post
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-[#d9bea9] px-7 py-3 text-sm font-bold text-[#2a1b14]">
              Contact us
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#5e4739]">
            <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4 text-[#e1663a]" /> Image-first storytelling</span>
            <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4 text-[#e1663a]" /> Profile-ready layouts</span>
            <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#e1663a]" /> Easy discovery</span>
          </div>
        </div>
      </div>
    </section>
  )
}
