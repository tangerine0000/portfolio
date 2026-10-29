// =====================================================================
//  projects.js — Work manifest
//  Single source of truth for all projects and engineering work.
//
//  Categories:
//    - 'working'  : Projects done for working / production environments
//    - 'personal' : Personal, hobby, and open-source exploration projects
// =====================================================================

const PROJECTS = [
    // -----------------------------------------------------------------
    //  Working Projects (Professional & Production Work)
    // -----------------------------------------------------------------
    {
        slug: 'ai-web-scraper',
        title: 'AI Web Scraper & Extraction Pipeline',
        category: 'working',
        categoryLabel: 'Working Project',
        year: '2025',
        stack: ['Python', 'Streamlit', 'LangChain', 'Playwright'],
        summary: 'Production content extraction and summarization pipeline pulling domain-specific intelligence and structured insights from target web pages using LLM agents.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: true
    },
    {
        slug: 'faiss-search',
        title: 'FAISS Semantic Search & Retrieval Engine',
        category: 'working',
        categoryLabel: 'Working Project',
        year: '2025',
        stack: ['Python', 'FAISS', 'Vector DB', 'LangChain'],
        summary: 'Vector retrieval engine enabling fast semantic similarity matching and interactive Q&A over unstructured scraped web content with embedding storage.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: false
    },
    {
        slug: 'ai-chatbot',
        title: 'Contextual AI Chatbot & Memory Service',
        category: 'working',
        categoryLabel: 'Working Project',
        year: '2025',
        stack: ['Python', 'FastAPI', 'LangChain', 'Streamlit', 'Ollama'],
        summary: 'Conversational assistant featuring contextual vector search, local model deployment with Ollama, and multi-turn session memory.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: true
    },

    // -----------------------------------------------------------------
    //  Personal Projects (Hobby, Tools & Experiments)
    // -----------------------------------------------------------------
    {
        slug: 'url-shortener',
        title: 'URL Shortener API',
        category: 'personal',
        categoryLabel: 'Personal Project',
        year: '2025',
        stack: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        summary: 'Personal RESTful URL shortening service featuring analytics tracking, duplicate URL detection, and redirection latency metrics.',
        link: 'https://tanurl.netlify.app/',
        repo: 'https://github.com/tangerine0000/url-shortener-api',
        featured: true
    },
    {
        slug: 'task-manager-cli',
        title: 'Task Manager CLI',
        category: 'personal',
        categoryLabel: 'Personal Project',
        year: '2025',
        stack: ['Node.js', 'SQLite', 'CLI'],
        summary: 'Command-line hobby utility for personal task management featuring priority flags, due dates, custom filters, and persistent local SQLite storage.',
        repo: 'https://github.com/tangerine0000/task-manager-cli',
        featured: false
    },
    {
        slug: 'ai-agents-playground',
        title: 'AI Agents Playground',
        category: 'personal',
        categoryLabel: 'Personal Project',
        year: '2025',
        stack: ['Python', 'LangChain', 'Streamlit', 'Ollama'],
        summary: 'Personal experimental sandbox exploring multi-agent coordination, prompt chain evaluation, and lightweight local model tooling.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: false
    }
];

if (typeof window !== 'undefined') {
    window.PROJECTS = PROJECTS;
}
