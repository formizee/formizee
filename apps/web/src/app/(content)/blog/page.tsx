import {type Post, getAllPosts} from '@/lib/markdown';
import {BlurFade} from '@/components/blur-fade';
import {PostCard} from './_components/card';

const RenderPosts = ({posts}: {posts: Post[]}) => {
  return posts.map(post => {
    return (
      <PostCard
        description={post.description}
        coverImage={post.coverImage}
        author={post.content}
        title={post.title}
        date={post.date}
        slug={post.slug}
        key={post.slug}
      />
    );
  });
};

export default function Page() {
  const posts = getAllPosts();

  return (
    <BlurFade className="flex flex-col flex-grow w-full items-center flex-col px-4 mt-32">
      <h1 className="font-bold text-2xl sm:text-4xl">Blog</h1>
      <h2 className="font-secondary text-sm mt-2">
        Cool stories, guides and fun facts about us
      </h2>
      <section
        className={`grid grid-cols-1 ${posts.length > 1 ? 'sm:grid-cols-[auto,auto]' : ''} place-items-center mt-16 w-full`}
      >
        {posts.length < 1 ? (
          <h3 className="font-secondary mt-8">
            There's nothing here right now...
          </h3>
        ) : (
          <RenderPosts posts={posts} />
        )}
      </section>
    </BlurFade>
  );
}
