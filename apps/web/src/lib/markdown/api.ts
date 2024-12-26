import {readFileSync, readdirSync} from 'node:fs';
import matter from 'gray-matter';
import {join} from 'node:path';

export interface Post {
  slug: string;
  date: string;
  title: string;
  author: string;
  content: string;
  coverImage: string;
  description: string;
}

export function getPostSlugs(postsDirectory = 'src/app/blog/_posts') {
  return readdirSync(postsDirectory);
}

export function getBySlug(
  slug: string,
  postsDirectory = 'src/app/blog/_posts'
) {
  const realSlug = slug.replace(/\.md$/, '');

  const contentDirectory = join(process.cwd(), postsDirectory);

  const fullPath = join(contentDirectory, `${realSlug}.md`);
  const fileContents = readFileSync(fullPath, 'utf8');
  const {data, content} = matter(fileContents);

  return {...data, slug: realSlug, content} as Post;
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs
    .map(slug => getBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
