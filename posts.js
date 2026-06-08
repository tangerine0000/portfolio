// =====================================================================
//  Blog manifest — the single source of truth for every post.
//
//  TO ADD A POST:
//    1. Create  posts/<slug>.md   and write it in Markdown.
//    2. Add ONE entry to the array below.
//  That's it — the blog list, sorting (newest first), and the post
//  page are generated automatically from this manifest.
//
//  Fields:
//    slug      required  matches the filename: posts/<slug>.md
//    title     required  shown on the card and at the top of the post
//    date      required  'YYYY-MM-DD' (used to sort, newest first)
//    excerpt   required  one-line summary on the blog card
//    tags      optional  array of short labels -> chips
//    readMins  optional  number -> "· N min read"
// =====================================================================
const POSTS = [
    {
        slug: 'welcome',
        title: "Why I'm Starting This Blog",
        date: '2026-06-05',
        tags: ['Meta'],
        readMins: 3,
        excerpt: "Notes from an AI grad turning full-stack developer — what I'm learning, what I'm building, and why I'm writing it down in public."
    },
];
