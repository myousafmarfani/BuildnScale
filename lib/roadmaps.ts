import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export type RoadmapMeta = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  lastUpdated: string;
  tags: string[];
  badge: string;
  featured: boolean;
  status: 'published' | 'draft';
  ogImage: string;
  prerequisites: string[];
  outcomes: string[];
  relatedPosts?: string[];
};

const ROADMAPS_DIR = path.join(process.cwd(), 'content/roadmaps');

function toSlug(fileName: string): string {
  return fileName.replace(/\.mdx$/, '');
}

function isDifficulty(value: unknown): value is RoadmapMeta['difficulty'] {
  return value === 'Beginner' || value === 'Intermediate' || value === 'Advanced';
}

function isStatus(value: unknown): value is RoadmapMeta['status'] {
  return value === 'published' || value === 'draft';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const REQUIRED_FIELD_KEYS = [
  'title',
  'headline',
  'description',
  'category',
  'difficulty',
  'duration',
  'modules',
  'lastUpdated',
  'tags',
  'badge',
  'featured',
  'status',
  'ogImage',
  'prerequisites',
  'outcomes',
] as const;

function getMissingRequiredFields(data: Record<string, unknown>): string[] {
  const missing: string[] = [];

  for (const key of REQUIRED_FIELD_KEYS) {
    const value = data[key];

    if (value === undefined || value === null) {
      missing.push(key);
      continue;
    }

    if (typeof value === 'string' && value.trim() === '') {
      missing.push(key);
      continue;
    }

    if (Array.isArray(value) && value.length === 0) {
      missing.push(key);
    }
  }

  return missing;
}

function parseRoadmapMeta(slug: string, data: Record<string, unknown>): RoadmapMeta | null {
  const missingFields = getMissingRequiredFields(data);

  if (missingFields.length > 0) {
    console.warn(
      `[roadmaps] Skipping ${slug}.mdx: missing required fields: ${missingFields.join(', ')}`
    );
    return null;
  }

  if (!isDifficulty(data.difficulty)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: invalid difficulty value.`);
    return null;
  }

  if (typeof data.modules !== 'number' || Number.isNaN(data.modules)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: invalid modules value.`);
    return null;
  }

  if (!isStringArray(data.tags)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: tags must be a string array.`);
    return null;
  }

  if (typeof data.featured !== 'boolean') {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: featured must be a boolean.`);
    return null;
  }

  if (!isStatus(data.status)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: invalid status value.`);
    return null;
  }

  if (!isStringArray(data.prerequisites)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: prerequisites must be a string array.`);
    return null;
  }

  if (!isStringArray(data.outcomes)) {
    console.warn(`[roadmaps] Skipping ${slug}.mdx: outcomes must be a string array.`);
    return null;
  }

  const relatedPosts = isStringArray(data.relatedPosts) ? data.relatedPosts : undefined;

  return {
    slug,
    title: String(data.title),
    headline: String(data.headline),
    description: String(data.description),
    category: String(data.category),
    difficulty: data.difficulty,
    duration: String(data.duration),
    modules: data.modules,
    lastUpdated: String(data.lastUpdated),
    tags: data.tags,
    badge: String(data.badge),
    featured: data.featured,
    status: data.status,
    ogImage: String(data.ogImage),
    prerequisites: data.prerequisites,
    outcomes: data.outcomes,
    relatedPosts,
  };
}

async function readRoadmapFile(
  fileName: string
): Promise<{ meta: RoadmapMeta; content: string } | null> {
  const slug = toSlug(fileName);
  const fullPath = path.join(ROADMAPS_DIR, fileName);
  const fileContents = await fs.readFile(fullPath, 'utf8');

  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(fileContents);
  } catch {
    console.warn(`[roadmaps] Skipping ${fileName}: malformed frontmatter.`);
    return null;
  }

  const meta = parseRoadmapMeta(slug, parsed.data as Record<string, unknown>);
  if (!meta) {
    return null;
  }

  return {
    meta,
    content: parsed.content,
  };
}

export async function getAllRoadmaps(): Promise<RoadmapMeta[]> {
  try {
    const directoryEntries = await fs.readdir(ROADMAPS_DIR, { withFileTypes: true });
    const mdxFiles = directoryEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
      .map((entry) => entry.name);

    const roadmapFiles = await Promise.all(mdxFiles.map((fileName) => readRoadmapFile(fileName)));

    return roadmapFiles
      .filter((item): item is { meta: RoadmapMeta; content: string } => item !== null)
      .map((item) => item.meta)
      .filter((meta) => meta.status === 'published')
      .sort((a, b) => {
        if (a.featured !== b.featured) {
          return a.featured ? -1 : 1;
        }

        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.warn(`[roadmaps] Missing directory: ${ROADMAPS_DIR}. Returning empty list.`);
      return [];
    }
    throw error;
  }
}

export async function getRoadmapBySlug(
  slug: string
): Promise<{ meta: RoadmapMeta; content: string } | null> {
  try {
    const fullPath = path.join(ROADMAPS_DIR, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(fileContents);
    } catch {
      console.warn(`[roadmaps] Skipping ${slug}.mdx: malformed frontmatter.`);
      return null;
    }

    const meta = parseRoadmapMeta(slug, parsed.data as Record<string, unknown>);
    if (!meta) {
      return null;
    }

    if (meta.status !== 'published') {
      return null;
    }

    return { meta, content: parsed.content };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function getRoadmapSlugs(): Promise<string[]> {
  const roadmaps = await getAllRoadmaps();
  return roadmaps.map((roadmap) => roadmap.slug);
}

export async function getRoadmapsByCategory(category: string): Promise<RoadmapMeta[]> {
  const roadmaps = await getAllRoadmaps();
  return roadmaps.filter(
    (roadmap) => roadmap.category.toLowerCase() === category.trim().toLowerCase()
  );
}

export async function getBestRoadmapForTags(tags: string[]): Promise<RoadmapMeta | null> {
  if (!tags.length) {
    return null;
  }

  const normalized = new Set(tags.map((tag) => tag.toLowerCase()));
  const roadmaps = await getAllRoadmaps();

  let bestMatch: { roadmap: RoadmapMeta; score: number } | null = null;

  for (const roadmap of roadmaps) {
    const score = roadmap.tags.reduce((total, tag) => {
      return normalized.has(tag.toLowerCase()) ? total + 1 : total;
    }, 0);

    if (score === 0) {
      continue;
    }

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { roadmap, score };
    }
  }

  return bestMatch?.roadmap ?? null;
}
