'use server';

import {unstable_cache as cache} from 'next/cache';
import {env} from '@/lib/environment';

export const getProductHuntVotes = cache(
  async () => {
    const query = `
  query GetVotes($slug: String!) {
    post(slug: $slug) {
      id
      name
      votesCount
    }
  }
`;

    const response = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env().PRODUCTHUNT_TOKEN}`
      },
      body: JSON.stringify({
        query,
        variables: {
          slug: 'formizee'
        }
      })
    });

    const content = await response.json();

    return formatNumber(content.data.post.votesCount ?? 0);
  },
  ['product-hunt'],
  {
    revalidate: 300
  }
);

function formatNumber(value: number) {
  if (value >= 1000) {
    // Convert to shorthand (e.g., 1.2K, 3.5M)
    const units = ['', 'K', 'M', 'B', 'T'];
    let unitIndex = 0;

    while (value >= 1000 && unitIndex < units.length - 1) {
      // biome-ignore lint/style/noParameterAssign: <explanation>
      value /= 1000;
      unitIndex++;
    }

    return `${Number.parseFloat(value.toFixed(1))}${units[unitIndex]}`;
  }

  return value.toString(); // Return as-is if less than 1000
}
