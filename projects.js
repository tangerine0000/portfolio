// =====================================================================
//  projects.js — Work manifest
//  Single source of truth for all projects and engineering work.
//
//  Categories:
//    - 'professional' : Projects engineered in professional / production company environments
//    - 'personal'     : Personal, hobby, and open-source exploration projects
// =====================================================================

const PROJECTS = [
    // -----------------------------------------------------------------
    //  Professional & AI Systems
    // -----------------------------------------------------------------
    {
        slug: 'innomize-billing-platform',
        title: 'Enterprise Billing & Write-Off Platform',
        category: 'professional',
        categoryLabel: 'Professional Project',
        year: '2025 – Present',
        stack: ['React', 'NestJS', 'DynamoDB', 'OpenSearch', 'TypeScript'],
        summary: 'End-to-end Write-Off module and guarded state-machine approval workflow processing millions of invoices at Innomize, with DynamoDB-to-OpenSearch sync, template-driven PDF/Excel reporting, and a shared RBAC UI component library cutting frontend dev time by ~30%.',
        featured: true
    },
    {
        slug: 'serverless-resume-parser',
        title: 'Serverless Document & Resume Parsing Pipeline',
        category: 'professional',
        categoryLabel: 'AI Project',
        year: '2025 – 2026',
        stack: ['Python 3.12', 'PyMuPDF', 'ONNX Runtime', 'Tesseract OCR', 'Pydantic', 'AWS Lambda'],
        summary: 'Deterministic rule-based NLP and layout intelligence pipeline converting PDF/DOCX files into validated JSON schemas at 98.5%+ F1 accuracy across 7 benchmark datasets (1,300+ resumes) backed by 861 automated pytest cases.',
        featured: true
    },
    {
        slug: 'semantic-search-rag-engine',
        title: 'Semantic Search & RAG Retrieval Engine',
        category: 'professional',
        categoryLabel: 'AI Project',
        year: '2025',
        stack: ['Python', 'FAISS', 'HuggingFace', 'BeautifulSoup', 'Streamlit'],
        summary: 'Semantic retrieval pipeline utilizing FAISS vector indexing for dense text embeddings, document chunking, and similarity search paired with automated web scraping and local LLM inference for grounded Q&A.',
        link: 'https://huggingface.co/spaces/nttan/scrape-chatbot',
        repo: 'https://github.com/tangerine0000/ai-agents-playground',
        featured: false
    },

    // -----------------------------------------------------------------
    //  Open Source & Personal Projects
    // -----------------------------------------------------------------
    {
        slug: 'monopoly-mayhem',
        title: 'Monopoly Mayhem — Saigon Monopoly Multiplayer',
        category: 'personal',
        categoryLabel: 'Personal Project',
        year: '2026',
        stack: ['Rust', 'Axum', 'Tokio WebSockets', 'Leptos (WASM)', 'Docker'],
        summary: 'Full-stack Rust real-time multiplayer Saigon Monopoly ("Cờ Tỷ Phú Sài Gòn") architected as a 4-crate workspace with an I/O-free deterministic game engine compiling to native and WASM, authoritative per-room actor server with turn/auction timers and heuristic bot, bilingual Leptos SPA, and CI benchmarks.',
        link: 'https://monopoly.gicungco.dev',
        repo: 'https://github.com/tangerine0000/monopoly-mayhem',
        featured: true
    },
    {
        slug: 'ai-foundations',
        title: 'AI-Foundations — Multi-Provider LLM Orchestration Framework',
        category: 'personal',
        categoryLabel: 'Open-Source Project',
        year: '2026',
        stack: ['Python', 'AsyncIO', 'Pydantic', 'OpenAI API', 'Anthropic Claude API', 'OpenRouter'],
        summary: 'Asynchronous Python LLM orchestration layer decoupling OpenAI, Anthropic, and OpenRouter behind an abstract interface with automatic failover, strict Pydantic structured outputs, real-time token/cost telemetry, and concurrent A/B and Regex/NER/Hybrid extraction benchmarks.',
        featured: true
    },
    {
        slug: 'url-shortener',
        title: 'URL Shortener API',
        category: 'personal',
        categoryLabel: 'Personal Project',
        year: '2025',
        stack: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        summary: 'RESTful URL shortening service featuring analytics tracking, duplicate URL detection, and redirection latency metrics.',
        link: 'https://tanurl.netlify.app/',
        repo: 'https://github.com/tangerine0000/url-shortener-api',
        featured: false
    }
];

if (typeof window !== 'undefined') {
    window.PROJECTS = PROJECTS;
}
