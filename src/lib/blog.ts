import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Blog posts are committed markdown in content/posts/*.md (the same files the
// Tina admin edits). Reading them directly at build time makes the blog
// independent of TinaCloud availability / per-branch indexing, which was
// leaving the deployed blog empty.

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO string
  category: string;
  authorName?: string;
  coverImage?: string;
  body: string; // raw markdown
};

function parsePost(filename: string): BlogPost {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  const date =
    data.date instanceof Date ? data.date.toISOString() : String(data.date ?? '');
  return {
    slug: filename.replace(/\.md$/, ''),
    title: String(data.title ?? ''),
    excerpt: String(data.excerpt ?? ''),
    date,
    category: String(data.category ?? ''),
    authorName: data.author?.name ? String(data.author.name) : undefined,
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    body: content,
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(parsePost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parsePost(`${slug}.md`);
}
