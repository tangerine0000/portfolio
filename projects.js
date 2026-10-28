// =====================================================================
//  projects.js — Work manifest
//  Single source of truth for all projects and engineering work.
// =====================================================================

const PROJECTS = [
    {
        slug: 'ai-chatbot',
        title: 'AI Chatbot',
        year: '2025',
        stack: ['Python', 'LangChain', 'FastAPI', 'Streamlit', 'Ollama'],
        summary: 'Conversational assistant with contextual vector search, local model integration, and interactive session memory.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: true
    },
    {
        slug: 'ai-web-scraper',
        title: 'AI Web Scraper',
        year: '2025',
        stack: ['Python', 'Streamlit', 'LangChain'],
        summary: 'Intelligent content extraction and summarization pipeline pulling structured insights from any target URL using AI.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: true
    },
    {
        slug: 'faiss-search',
        title: 'FAISS Semantic Search',
        year: '2025',
        stack: ['Python', 'FAISS', 'Vector DB', 'LangChain'],
        summary: 'Vector database search engine enabling fast semantic similarity matching and interactive Q&A over scraped web content.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: false
    },
    {
        slug: 'url-shortener',
        title: 'URL Shortener API',
        year: '2025',
        stack: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        summary: 'RESTful URL shortener service with analytics tracking, duplicate URL prevention, and redirection metrics.',
        link: 'https://tanurl.netlify.app/',
        repo: 'https://github.com/tangerine0000/url-shortener-api',
        featured: false
    },
    {
        slug: 'task-manager-cli',
        title: 'Task Manager CLI',
        year: '2025',
        stack: ['Node.js', 'SQLite', 'CLI'],
        summary: 'Command-line task management utility featuring priority flags, due dates, task filtering, and persistent local SQLite storage.',
        repo: 'https://github.com/tangerine0000/task-manager-cli',
        featured: false
    }
];

if (typeof window !== 'undefined') {
    window.PROJECTS = PROJECTS;
}

