import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Premium image and profile discovery',
      description: 'Explore polished profiles, image-led stories, and discoverable content through a cleaner magazine-style experience.',
      openGraphTitle: 'Premium image and profile discovery',
      openGraphDescription: 'Discover image-led stories, profiles, and curated content through a warm editorial storefront experience.',
      keywords: ['image profiles', 'business owner inspiration', 'editorial storefront', 'visual discovery'],
    },
    hero: {
      badge: 'From portfolio to presence',
      title: ['Bring your best work', 'into sharper focus.'],
      description:
        'Browse image-led stories, public profiles, and practical inspiration arranged with the polish of a premium magazine and the clarity of a discovery platform.',
      primaryCta: { label: 'Browse Profiles', href: '/profiles' },
      secondaryCta: { label: 'Explore Images', href: '/images' },
      searchPlaceholder: 'Search profiles, photo sets, inspiration, and new posts',
      focusLabel: 'Spotlight',
      featureCardBadge: 'featured collection',
      featureCardTitle: 'Fresh visual stories and professional profiles, arranged like a curated storefront.',
      featureCardDescription: 'The homepage highlights the newest images and strongest identities first while keeping the rest of the site connected.',
    },
    intro: {
      badge: 'Why it works',
      title: 'A calmer way to explore visual content, business profiles, and useful ideas.',
      paragraphs: [
        'The experience blends image-forward browsing with clean editorial hierarchy, helping visitors move between profile pages, articles, and galleries without friction.',
        'Business owners can quickly scan featured stories, category-led collections, and detailed pages that feel polished on both desktop and mobile.',
        'Every section is designed to keep content discoverable, readable, and visually memorable.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Warm editorial styling with stronger visual merchandising.',
        'Image-first presentation for profiles, galleries, and featured content.',
        'Flexible layouts that keep cards from feeling repetitive.',
        'Clearer search, navigation, and detail-page rhythm.',
      ],
      primaryLink: { label: 'See profiles', href: '/profiles' },
      secondaryLink: { label: 'View images', href: '/images' },
    },
    cta: {
      badge: 'Ready to share',
      title: 'Put your next image set, profile, or story in front of the right audience.',
      description: 'Create a polished post and publish it into a browsing experience built to feel premium, warm, and easy to trust.',
      primaryCta: { label: 'Create a post', href: '/create' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'An image-led publishing experience with room for identity and detail.',
    description: `${slot4BrandConfig.siteName} is designed to help visitors discover profiles, visuals, and supporting content through a warmer editorial structure.`,
    paragraphs: [
      'Instead of presenting every post in the same generic feed, the site mixes featured moments, compact modules, and image-forward layouts to create a stronger browsing rhythm.',
      'That approach helps professional identities, portfolios, galleries, and supporting content feel easier to explore and easier to remember.',
    ],
    values: [
      {
        title: 'Visual clarity',
        description: 'Strong imagery and thoughtful spacing help key content stand out immediately.',
      },
      {
        title: 'Professional presence',
        description: 'Profile and detail layouts make people, brands, and offerings feel more polished and credible.',
      },
      {
        title: 'Natural discovery',
        description: 'Visitors can move between categories, posts, and related content without losing context.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Start a conversation about your next profile, visual story, or publishing need.',
    description: 'Share what you are planning and we will help route it to the right next step.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search profiles, images, topics, and content across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find visual stories, profiles, and ideas faster.',
      description: 'Use search to jump into galleries, public profiles, articles, and supporting resources from one place.',
      placeholder: 'Search by name, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create a new post.',
      description: 'Use your account to open the publishing workspace and prepare profile, image, or article content.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create polished content for every active section.',
      description: 'Choose a format, add your details, and prepare a post with imagery, summary, and supporting content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
