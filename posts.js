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

// Blog / Writing stream is temporarily paused.
const POSTS = [];

if (typeof window !== 'undefined') {
    window.POSTS = POSTS;
}
