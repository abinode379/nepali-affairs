const env = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Nepali Affairs',
  siteDescription:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    'Submit an anonymous confession and share your story safely.',
  heroCta: process.env.NEXT_PUBLIC_HERO_CTA ?? 'Submit your anonymous confession',
  tiktokUrl: process.env.NEXT_PUBLIC_TIKTOK_URL ?? 'https://www.tiktok.com'
} as const;

export default env;
