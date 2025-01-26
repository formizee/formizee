import type {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/f/'
    },
    sitemap: 'https://formizee.com/sitemap.xml'
  };
}
