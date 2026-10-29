// =====================================================================
//  posts.js — Writing manifest
//  Single source of truth for all published articles and blog posts.
//
//  Fields:
//    slug      required  matches posts/<slug>.md
//    title     required  post title
//    date      required  'YYYY-MM-DD' (sorted newest first)
//    excerpt   required  concise summary description
//    tags      optional  array of topic tags
//    readMins  optional  estimated reading time in minutes
// =====================================================================

// Writing is paused for now. Future blog posts will be registered here.
const POSTS = [];

if (typeof window !== 'undefined') {
    window.POSTS = POSTS;
}
