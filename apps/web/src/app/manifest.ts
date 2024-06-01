import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Formizee | The open source Formspree alternative',
    short_name: 'Formizee.',
    description: 'The Forms Backend platform, built for developers.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000',
    theme_color: '#000',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}
