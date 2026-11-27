import { getAllPosts, type BlogPost } from '@/lib/blog';
import { BlogCard } from '@/components/BlogCard';
import { SectionLabel } from '@/components/SectionLabel';

// Picks up to `limit` other posts: same category first (newest first), then
// the newest posts from other categories. getAllPosts() is sorted newest first.
// Cards render without cover images: BlogCard's image uses alt="" (decorative),
// which would add an empty-alt crawl warning to every post page.
export function pickRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const others = getAllPosts().filter((p) => p.slug !== current.slug);
  const sameCategory = others.filter((p) => p.category && p.category === current.category);
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, limit);
}

export function RelatedPosts({ post }: { post: BlogPost }) {
  const related = pickRelatedPosts(post);
  if (related.length === 0) return null;

  return (
    <section className="pb-24" aria-labelledby="related-posts-heading">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel number="02" text="Keep Reading" />
        <h2
          id="related-posts-heading"
          className="mt-4 font-display font-semibold text-3xl md:text-4xl text-ice"
        >
          Related Articles
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {related.map((p, i) => (
            <BlogCard
              key={p.slug}
              slug={p.slug}
              title={p.title}
              excerpt={p.excerpt}
              date={p.date}
              category={p.category}
              authorName={p.authorName}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
