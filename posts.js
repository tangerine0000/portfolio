// =====================================================================
//  posts.js — Writing manifest
//  Single source of truth for every essay, note, and reflection.
//
//  Fields:
//    slug      required  matches posts/<slug>.md
//    title     required  post title
//    date      required  'YYYY-MM-DD' (sorted newest first)
//    kind      required  'note' | 'essay' | 'personal'
//    lede      required  opening pull-quote / hook displayed in fork & previews
//    excerpt   required  concise summary description
//    tags      optional  array of topic tags
//    readMins  optional  estimated reading time in minutes
// =====================================================================

const POSTS = [
    {
        slug: 'simplicity-in-web-tooling',
        title: 'The Value of Boring Static Web Architectures',
        date: '2026-08-22',
        kind: 'essay',
        lede: 'Every framework you do not install is a dependency you never have to patch, debug, or migrate.',
        excerpt: 'Reflections on moving away from heavy bundlers toward pure vanilla web standards, CSS variables, and lightweight client manifests.',
        tags: ['Architecture', 'Web'],
        readMins: 5
    },
    {
        slug: 'notes-on-local-llms',
        title: 'Running Local Models with Ollama and LangChain',
        date: '2026-07-14',
        kind: 'note',
        lede: 'You do not need a cluster of enterprise GPUs to build intelligent agent workflows that respect user privacy.',
        excerpt: 'Quick observations on latency, memory footprints, and practical context management when wiring local models into interactive tools.',
        tags: ['AI', 'Python'],
        readMins: 4
    },
    {
        slug: 'welcome',
        title: "Why I'm Starting This Blog",
        date: '2026-06-05',
        kind: 'personal',
        lede: 'The best way to learn is to teach; the second best is to write it down where someone might read it.',
        excerpt: "Notes from an AI grad turning full-stack developer — what I'm learning, what I'm building, and why I'm writing it down in public.",
        tags: ['Meta'],
        readMins: 3
    }
];

if (typeof window !== 'undefined') {
    window.POSTS = POSTS;
}
