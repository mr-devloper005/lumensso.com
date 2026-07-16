import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Premium image and profile discovery',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Ideas for brands, teams, and standout identities',
    primaryLinks: [
      { label: 'Discover', href: '/' },
      { label: 'Journal', href: '/articles' },
    ],
    utilityLinks: [
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Start a profile', href: '/create' },
      secondary: { label: 'Explore now', href: '/' },
    },
  },
  footer: {
    tagline: 'Curated visuals, profiles, and discoverable resources',
    description:
      'A refined discovery space for business owners looking for strong imagery, polished public presence, and useful content that feels current and approachable.',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Create', href: '/create' },
        ],
      },
    ],
    bottomNote: 'Designed for premium discovery, clear presentation, and easy browsing.',
  },
  commonLabels: {
    readMore: 'View details',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
