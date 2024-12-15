import {readFileSync} from 'node:fs';
import matter from 'gray-matter';
import {join} from 'node:path';

interface Post {
  slug: string;
  date: string;
  title: string;
  author: string;
  content: string;
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
