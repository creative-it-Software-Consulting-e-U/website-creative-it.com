// ============================================================================
// Site Configuration — Edit this file to update ALL site content
// ============================================================================

export const siteConfig = {
  // ── Global ────────────────────────────────────────────────────────────────
  name: "creative-it",
  tagline: "Build. Grow. Matter.",
  description:
    "We build software, AI agents, teams, processes, and trust. Growth emerges — and with it, lasting impact.",

  // ── Contact ───────────────────────────────────────────────────────────────
  contact: {
    email: "info@creative-it.com",
    phone: "+43-660-4943737",
    address: "Am Gassl 25, A-3482 Gösing am Wagram, Austria",
  },

  // ── Social Links ──────────────────────────────────────────────────────────
  social: {
    linkedin: "https://www.linkedin.com/company/35435836",
    twitter: "https://x.com/creative_it_at",
    github: "https://github.com/orgs/creative-it-Software-Consulting-e-U/",
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  navigation: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "AI Playground", href: "/ai-playground" },
    { name: "Tech Advisor", href: "/tech-advisor" },
    { name: "AI Agents", href: "/ai-agents" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact", href: "/contact" },
  ],

  // ── Services ──────────────────────────────────────────────────────────────
  services: [
    {
      title: "Agentic Coding",
      description:
        "Bring the benefits of agentic coding to your team. Increase productivity massively.",
      icon: "brain",
      features: [
        "Model selection",
        "Workflows",
        "Team setup",
      ],
    },
    {
      title: "AI-based Applications",
      description:
        "Customized AI agents and models to make your product more intelligent.",
      icon: "robot",
      features: [
        "Agent development",
        "Model optimization",
        "GDPR compliance",
      ],
    },
    {
      title: "App Development",
      description: "Custom mobile apps for your business. We build native apps for iOS and Android.",
      icon: "mobile",
      features: [
        "iOS & Android development",
        "Backend solutions",
        "Native app design, same features",
      ],
    },
    {
      title: "Software Development",
      description:
        "Custom solutions built with precision and purpose. We transform complex requirements into elegant, scalable software.",
      icon: "code",
      features: [
        "Full-stack development",
        "API design & integration",
        "Serverless Technologies",
      ],
    },
    {
      title: "Cloud Architecture",
      description:
        "Secure, scalable infrastructure designed for growth. We architect cloud solutions that perform under pressure.",
      icon: "cloud",
      features: [
        "Cloud migration",
        "Infrastructure as code",
        "NoOps",
      ],
    },
    {
      title: "Technical Consulting",
      description:
        "Strategic guidance for technology decisions that matter. We help you navigate complexity with confidence.",
      icon: "ruler",
      features: [
        "Architecture review",
        "Technology strategy",
        "Team augmentation",
      ],
    }
  ],

  // ── About ─────────────────────────────────────────────────────────────────
  about: {
    mission:
      "To empower businesses through technology that transforms, teams that thrive, and partnerships that last.",
    story:
      "Creative IT was founded on a simple belief: technology should enable growth, not constrain it. We've built our company around the philosophy of Build. Grow. Matter. — building software, building teams, building trust. From this foundation, we help our clients grow their capabilities, their reach, and their impact. Because ultimately, we believe that what we create together should matter — to your business, to your customers, and to the future you're building.",
    values: [
      {
        title: "Build",
        description:
          "We construct with purpose — software, teams, processes, and lasting relationships.",
      },
      {
        title: "Grow",
        description:
          "We foster continuous improvement for our clients, our team, and ourselves.",
      },
      {
        title: "Matter",
        description:
          "We deliver work that creates real impact and meaningful change.",
      },
    ],
    stats: [
      { value: "150+", label: "Projects Delivered" },
      { value: "30+", label: "Years Experience" },
      { value: "100%", label: "Satisfaction Rate" },
      { value: "0%", label: "Lack of Confidence" },
    ],
    whyChooseUs: {
      headline: "Partnership, Not Just Service",
      description:
        "We don't just deliver projects — we build relationships. When you work with creative-it, you gain a technology partner invested in your long-term success.",
      benefits: [
        {
          title: "Deep Expertise",
          description:
            "Decades of experience across diverse industries and technologies.",
        },
        {
          title: "Transparent Communication",
          description:
            "Clear, honest dialogue throughout every engagement.",
        },
        {
          title: "Long-term Vision",
          description: "Solutions designed to grow with your business.",
        },
      ],
      highlights: [
        {
          title: "Fast & Efficient",
          description: "Agile delivery without compromise",
        },
        {
          title: "Expert Team",
          description: "Seasoned professionals at every level",
        },
        {
          title: "Reliable Support",
          description: "We're with you for the long haul",
        },
      ],
    },
  },

  // ── Apps ─────────────────────────────────────────────────────────────────
  apps: [
    {
      title: "GeoHook",
      description:
        "Trigger webhooks automatically when you enter or exit locations. Connect your geofences to Home Assistant, IFTTT, n8n, or any custom API.",
      icon: "/apps/geohook-icon.svg",
      link: "https://geohook.creative-it.com",
      status: "live" as const,
    },
    {
      title: "AInvoiceMate",
      description:
        "AI-powered invoice processing for your accounting workflow. Scan invoices, extract data automatically, and export to sevDesk, DATEV, Google Sheets, and more.",
      icon: "/apps/ainvoicemate-icon.png",
      link: null,
      status: "coming-soon" as const,
    },
    {
      title: "FlowAgent",
      description:
        "Automated bookkeeping and financial management built for Austrian tax law. AI-powered invoice processing, transaction tracking, and cash flow forecasting.",
      icon: "/apps/flowagent-icon.png",
      link: null,
      status: "coming-soon" as const,
    },
  ],

  // ── Process Steps ─────────────────────────────────────────────────────────
  process: [
    {
      step: "01",
      title: "Discover",
      description:
        "We dive deep into your challenges, goals, and vision to understand the full picture.",
    },
    {
      step: "02",
      title: "Design",
      description:
        "We architect solutions that align with your objectives and scale with your growth.",
    },
    {
      step: "03",
      title: "Develop",
      description:
        "We build with precision, keeping you informed and involved every step of the way.",
    },
    {
      step: "04",
      title: "Deliver",
      description:
        "We deploy, optimize, and support—ensuring lasting success beyond launch.",
    },
  ],

  // ── FAQ ───────────────────────────────────────────────────────────────────
  faq: [
    {
      question: "What types of projects do you work on?",
      answer:
        "We work on a wide range of technology projects including custom software development, cloud architecture, digital transformation initiatives, and IT consulting. From startups to enterprises, we tailor our approach to meet your specific needs.",
    },
    {
      question: "How do you handle project communication?",
      answer:
        "We believe in transparent, consistent communication. You'll have a dedicated point of contact, regular status updates, and access to project management tools. We adapt our communication style to what works best for your team.",
    },
    {
      question: "What's your typical project timeline?",
      answer:
        "Timelines vary based on project scope and complexity. During our initial consultation, we'll provide a detailed timeline estimate. We focus on delivering quality work efficiently, keeping you informed of progress throughout.",
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer:
        "Absolutely. We offer various support and maintenance packages to ensure your solutions continue to perform optimally. We're committed to your long-term success, not just project delivery.",
    },
  ],

  // ── Page-Specific Content ─────────────────────────────────────────────────
  // Headline format: text before gradient | gradient text | text after gradient
  // Use null for empty parts. Templates handle the styling.

  pages: {
    home: {
      chip: "AI · Software · Teams · Trust",
      // Headline parts: "Build. " + gradient("Grow.") + " Matter."
      headline: { before: "Build. ", gradient: "Grow.", after: " Matter." },
      ctaPrimary: "Get a Free Consultation",
      ctaSecondary: "Explore Services",

      animation: {
        build: [
          "Apps", "Agents", "Skills", "Knowledge", "Tools", "Services",
          "Products", "Solutions", "Platforms", "Ecosystems", "Communities",
          "Partnerships", "Collaborations", "Innovations", "Experiments",
          "Prototypes", "MVPs", "Proof of Concepts",
        ],
        grow: [
          "Community", "Mindsets", "Trust", "Influence", "Culture", "Values",
          "Vision", "Mission", "Purpose", "Goals", "Objectives", "Strategies",
          "Tactics", "Plans", "Roadmaps", "Milestones", "KPIs",
        ],
      },

      servicesSection: {
        chip: "What We Do",
        headline: { before: "Technology Solutions That ", gradient: "Drive Growth", after: "" },
        description:
          "From custom software to cloud architecture, we deliver solutions that scale with your ambitions.",
        linkText: "Learn more",
      },

      appsSection: {
        chip: "Our Apps",
        headline: { before: "Products We ", gradient: "Built", after: "" },
        description:
          "Focused tools and applications that solve real problems with clean design and thoughtful engineering.",
        linkText: "View all apps",
        linkUrl: "https://apps.creative.it.com",
      },

      philosophySection: {
        chip: "Our Philosophy",
        headline: { before: "Three Words.", gradient: "Infinite Possibility.", after: "" },
        linkText: "About Our Journey",
      },

      cta: {
        headline: "Ready to Build\nSomething That Matters?",
        description:
          "Let's discuss how we can help you achieve your technology goals and create lasting impact.",
        button: "Schedule a Consultation",
      },
    },

    about: {
      meta: {
        title: "About",
        description: "Learn more about creative-it and our Build. Grow. Matter. philosophy",
      },
      hero: {
        chip: "About Us",
        headline: { before: "We Build With ", gradient: "Purpose", after: "" },
      },
      storySection: {
        chip: "Our Story",
        headline: "The Philosophy Behind Everything We Do",
      },
      valuesSection: {
        chip: "Our Values",
        headline: { before: "Build. ", gradient: "Grow.", after: " Matter." },
      },
      whySection: {
        chip: "Why Choose Us",
      },
      cta: {
        headline: "Let's Build Together",
        description:
          "Ready to partner with a team that's invested in your success? Let's start a conversation.",
        button: "Get in Touch",
      },
    },

    services: {
      meta: {
        title: "Services",
        description: "Comprehensive technology solutions to power your business forward",
      },
      hero: {
        chip: "Our Services",
        headline: { before: "Technology That ", gradient: "Drives Growth", after: "" },
        description:
          "From concept to deployment, we deliver end-to-end solutions that transform your business capabilities and accelerate your success.",
      },
      serviceButton: "Discuss Your Project",
      processSection: {
        chip: "Our Process",
        headline: "How We Work",
        description: "A proven methodology that delivers results, every time.",
      },
      cta: {
        headline: "Let's Build Something Great",
        description:
          "Ready to transform your ideas into reality? We're here to help you every step of the way.",
        button: "Start Your Project",
      },
    },

    agenticCoding: {
      meta: {
        title: "Agentic Coding",
        description: "How creative-it uses AI coding agents to ship faster, with higher quality and unprecedented productivity gains.",
      },
      hero: {
        chip: "Agentic Coding",
        headline: { before: "Code at the Speed of ", gradient: "Thought", after: "" },
        description:
          "We deploy teams of AI coding agents that work alongside our engineers — writing, reviewing, and shipping production code around the clock.",
      },
      whatSection: {
        chip: "What Is It",
        headline: "AI Agents That Write Real Code",
        description:
          "Agentic coding goes beyond autocomplete. Autonomous AI agents understand your codebase, plan implementations, write tests, and submit pull requests — just like a human developer. They handle the routine so our engineers focus on architecture, design, and the problems that matter.",
        points: [
          { title: "Autonomous Execution", description: "Agents independently plan, implement, and verify multi-file changes across entire repositories." },
          { title: "Context-Aware", description: "They understand your project structure, coding conventions, and business logic — not just syntax." },
          { title: "Human-in-the-Loop", description: "Every change is reviewed by senior engineers. Agents accelerate delivery; humans ensure quality." },
        ],
      },
      howSection: {
        chip: "Our Approach",
        headline: "How creative-it Uses Agentic Coding",
        description:
          "We integrate AI agents directly into our development workflow. They're not a gimmick — they're full team members with assigned tasks, code review standards, and accountability.",
        steps: [
          { step: "01", title: "Task Assignment", description: "Agents receive well-scoped tasks from our project management system, just like any developer." },
          { step: "02", title: "Implementation", description: "Agents write code, create tests, and open pull requests with full context and documentation." },
          { step: "03", title: "Review & Merge", description: "Senior engineers review every PR for quality, security, and alignment with project goals." },
          { step: "04", title: "Continuous Learning", description: "Agents improve over time as they absorb project conventions and feedback patterns." },
        ],
      },
      benefitsSection: {
        chip: "Productivity Gains",
        headline: { before: "Results That ", gradient: "Speak", after: "" },
        description:
          "The numbers from our live GitHub activity tell the story. Agentic coding isn't theoretical — it's shipping production code every day.",
        benefits: [
          { value: "5–10x", label: "Faster Feature Delivery", description: "What used to take a week ships in a day. Agents handle boilerplate, tests, and repetitive refactors at machine speed." },
          { value: "24/7", label: "Development Velocity", description: "Agents don't sleep. They process tasks overnight so engineers wake up to completed pull requests." },
          { value: "Higher", label: "Code Quality", description: "Every change comes with tests and documentation. Agents are thorough by default — no shortcuts, no tech debt." },
          { value: "More", label: "Focus for Engineers", description: "With routine work handled, engineers spend their time on architecture, user experience, and creative problem-solving." },
        ],
      },
      storySection: {
        chip: "AI Narrative",
        headline: "What We Built Today",
        description: "This story is generated live by AI based on our actual GitHub activity — a different narrative every time.",
        refreshButton: "New Story",
        loadingText: "AI is writing today's story...",
        fallback: "Our agents have been busy shipping code. Check the stats above to see the numbers.",
      },
      cta: {
        headline: "Ready to Ship Faster?",
        description:
          "Bring the power of agentic coding to your next project. Let's talk about how AI-assisted development can accelerate your roadmap.",
        button: "Start a Conversation",
      },
    },

    aiPlayground: {
      meta: {
        title: "AI Playground",
        description: "Describe a UI component in plain English and watch AI build it live — powered by creative-it",
      },
      hero: {
        chip: "AI Playground",
        headline: { before: "Describe It. ", gradient: "Watch It Build.", after: "" },
        description:
          "Type a description of any UI component and watch AI generate it in real time. Powered by Claude and AWS Bedrock.",
      },
      inputSection: {
        promptLabel: "Describe your component",
        promptPlaceholder: "A pricing card with three tiers: Starter, Pro, and Enterprise...",
        generateButton: "Generate",
        generatingButton: "Generating...",
        charLimit: 2000,
      },
      exampleCategories: [
        {
          label: "Marketing",
          examples: [
            "A hero section with a gradient headline, subtitle, and two CTA buttons",
            "A testimonial carousel card with avatar, quote, name, and role",
            "A pricing table with three tiers: Free, Pro, and Enterprise",
            "A feature comparison table with checkmarks and crosses for three plans",
            "A newsletter signup banner with email input and a bold headline",
            "A team member profile card with photo placeholder, name, role, and social links",
          ],
        },
        {
          label: "Dashboard",
          examples: [
            "A dashboard stats grid with 4 metric cards showing icons and trends",
            "A notification feed panel with timestamps, icons, and read/unread states",
            "A user profile sidebar with avatar, stats, and a list of recent activity",
            "A progress tracker with 5 steps, current step highlighted, and completion percentage",
            "A data table with sortable column headers, striped rows, and pagination",
          ],
        },
        {
          label: "E-Commerce",
          examples: [
            "A product card with image placeholder, title, price, rating stars, and add-to-cart button",
            "A shopping cart summary with item list, quantities, subtotal, and checkout button",
            "A product review section with star rating breakdown and individual review cards",
            "A category filter sidebar with checkboxes, price range slider, and apply button",
          ],
        },
        {
          label: "Forms",
          examples: [
            "A login form with email, password, social sign-in buttons, and a remember-me checkbox",
            "A multi-step registration wizard with progress indicator and form fields",
            "A contact form with name, email, subject dropdown, message area, and file upload",
            "A settings page with toggle switches, radio groups, and a save button",
          ],
        },
        {
          label: "Navigation",
          examples: [
            "A responsive navbar with logo, menu links, search bar, and a user avatar dropdown",
            "A sidebar navigation with collapsible sections, icons, and an active state indicator",
            "A breadcrumb bar with current page highlighted and a back button",
            "A tab bar with icons and labels for a mobile app bottom navigation",
          ],
        },
      ],
      previewSection: {
        previewTab: "Preview",
        codeTab: "Code",
        copyButton: "Copy Code",
        copiedButton: "Copied!",
        clearButton: "Clear",
        emptyState: "Your generated component will appear here",
        desktopLabel: "Desktop",
        tabletLabel: "Tablet",
        mobileLabel: "Mobile",
      },
      conversation: {
        newComponentButton: "New Component",
        refiningLabel: "Refining",
        refiningPlaceholder: "Describe what to change or refine...",
      },
      cta: {
        headline: "Want Custom AI Solutions?",
        description:
          "This is just a taste of what AI can do. Let's build intelligent features tailored to your product.",
        button: "Start a Conversation",
      },
    },

    techAdvisor: {
      meta: {
        title: "Tech Stack Advisor",
        description: "Describe your project and get AI-powered architecture recommendations with reasoning",
      },
      hero: {
        chip: "AI Tech Advisor",
        headline: { before: "Describe Your Project. ", gradient: "Get Your Stack.", after: "" },
        description:
          "Tell us about your project requirements and our AI will recommend a complete tech stack with architecture diagrams and reasoning.",
      },
      inputSection: {
        promptLabel: "Describe your project",
        promptPlaceholder: "We need a real-time dashboard for monitoring IoT sensor data from 500 devices...",
        generateButton: "Analyze",
        generatingButton: "Analyzing...",
        charLimit: 2000,
      },
      examples: [
        "E-commerce platform for 10k daily users with payments and inventory",
        "Real-time dashboard for IoT sensor data from 500 devices",
        "Mobile app with offline sync and push notifications",
        "AI-powered document processor with OCR and classification",
      ],
      previewSection: {
        resultsTab: "Recommendations",
        diagramTab: "Architecture",
        emptyState: "Describe your project to get AI-powered architecture recommendations",
      },
      conversation: {
        newAnalysisButton: "New Analysis",
        refiningLabel: "Follow-up",
        refiningPlaceholder: "Ask a follow-up question about the recommendations...",
      },
      cta: {
        headline: "Want Us to Build This?",
        description:
          "Our team can turn these recommendations into reality. Let's discuss your project.",
        button: "Start a Conversation",
      },
    },

    aiAgents: {
      meta: {
        title: "AI Agents",
        description: "Watch AI agents solve real tasks step-by-step with live visualization",
      },
      hero: {
        chip: "AI Agents",
        headline: { before: "Watch AI ", gradient: "Think.", after: "" },
        description:
          "See how AI agents break down complex problems, plan solutions, and execute tasks step-by-step — powered by real Bedrock calls.",
      },
      scenarios: [
        { id: "code-review", title: "Code Review", description: "Agent reviews code for bugs and improvements", icon: "code" },
        { id: "data-analysis", title: "Data Analysis", description: "Agent analyzes data and extracts insights", icon: "chart" },
        { id: "deployment", title: "Deployment Pipeline", description: "Agent plans and executes a deployment", icon: "rocket" },
        { id: "bug-fix", title: "Bug Investigation", description: "Agent investigates and fixes a bug", icon: "bug" },
      ],
      runButton: "Run Scenario",
      runAgainButton: "Run Again",
      steps: { think: "Thinking", plan: "Planning", execute: "Executing", verify: "Verifying", result: "Result" },
      cta: {
        headline: "Bring AI Agents to Your Project",
        description:
          "Let our team build intelligent agents tailored to your workflows and business processes.",
        button: "Start a Conversation",
      },
    },

    howItWorks: {
      meta: {
        title: "How It Works",
        description: "Behind the scenes of creative-it's AI-powered features — architecture, AWS services, and technical flows",
      },
      hero: {
        chip: "Behind the Scenes",
        headline: { before: "How Our AI ", gradient: "Actually Works", after: "" },
        description:
          "Every AI feature on this site is powered by real AWS infrastructure. Explore the architecture, services, and technical flows behind each one.",
      },
      features: [
        {
          id: "ai-playground",
          title: "AI Playground",
          subtitle: "Describe it. Watch it build.",
          icon: "lightning",
          link: "/ai-playground",
          whatItDoes:
            "Type a plain-English description of any UI component and watch AI generate production-ready HTML + Tailwind CSS in real time. Supports multi-turn conversations to refine and iterate on your component.",
          howItWorks:
            "Your prompt is sent to an API Gateway endpoint backed by a Lambda function. The Lambda calls Amazon Bedrock with Claude, streaming tokens back through a chunked HTTP response. The frontend renders each chunk into a live preview iframe as it arrives.",
          techFlow: [
            "User types a component description in the browser",
            "Request hits API Gateway with rate limiting (10/day per IP)",
            "Lambda constructs a system prompt optimized for HTML/Tailwind generation",
            "Amazon Bedrock streams Claude's response token-by-token",
            "Frontend renders each chunk into a sandboxed iframe in real time",
            "Conversation history is maintained client-side for multi-turn refinement",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "LLM inference with Claude" },
            { name: "AWS Lambda", role: "Serverless request handler" },
            { name: "API Gateway", role: "REST endpoint with throttling" },
            { name: "CloudWatch", role: "Logging and monitoring" },
          ],
        },
        {
          id: "tech-advisor",
          title: "Tech Stack Advisor",
          subtitle: "Describe your project. Get your stack.",
          icon: "beaker",
          link: "/tech-advisor",
          whatItDoes:
            "Describe your project requirements and get AI-powered architecture recommendations with a complete tech stack, reasoning, and a Mermaid architecture diagram. Follow up with questions to refine the recommendations.",
          howItWorks:
            "The Lambda function sends your project description to Claude via Bedrock with a specialized system prompt that instructs the model to analyze requirements, recommend technologies, and generate a Mermaid diagram. Responses stream back with a special marker format for the diagram section.",
          techFlow: [
            "User describes their project requirements",
            "Lambda sends the prompt to Bedrock with architecture-focused system instructions",
            "Claude analyzes requirements and generates structured recommendations",
            "Response includes a Mermaid diagram between ---DIAGRAM--- markers",
            "Frontend renders markdown recommendations and loads Mermaid.js for the diagram",
            "Follow-up questions maintain conversation context for deeper analysis",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "Architecture analysis with Claude" },
            { name: "AWS Lambda", role: "Prompt orchestration" },
            { name: "API Gateway", role: "REST endpoint with rate limiting" },
            { name: "CloudWatch", role: "Request logging" },
          ],
        },
        {
          id: "ai-agents",
          title: "AI Agent Visualizer",
          subtitle: "Watch AI think step-by-step.",
          icon: "robot",
          link: "/ai-agents",
          whatItDoes:
            "Select a scenario (code review, data analysis, deployment, bug fix) and watch an AI agent break down the problem, plan a solution, execute steps, and verify results — all streamed live to a terminal-style interface.",
          howItWorks:
            "The Lambda receives a scenario ID, constructs a multi-step prompt chain, and calls Bedrock for each agent phase (think → plan → execute → verify → result). Each phase's output is streamed as newline-delimited JSON, with the frontend updating the pipeline visualization in real time.",
          techFlow: [
            "User selects a predefined scenario (e.g., 'Code Review')",
            "Lambda receives the scenario and initiates a multi-phase prompt chain",
            "Each phase (Think, Plan, Execute, Verify, Result) calls Bedrock independently",
            "Responses stream as NDJSON with step metadata",
            "Frontend highlights the active pipeline step and appends terminal output",
            "Rate limiting tracks daily usage per IP",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "Multi-step agent reasoning" },
            { name: "AWS Lambda", role: "Agent orchestration" },
            { name: "API Gateway", role: "Streaming endpoint" },
            { name: "CloudWatch", role: "Step-level tracing" },
          ],
        },
        {
          id: "chat-widget",
          title: "AI Chat Assistant",
          subtitle: "Ask anything about creative-it.",
          icon: "chat",
          link: null,
          whatItDoes:
            "A floating chat widget that answers questions about creative-it's services, process, team, and capabilities. Maintains session context for natural follow-up conversations with streaming responses.",
          howItWorks:
            "The Lambda uses a Bedrock Knowledge Base backed by an S3 bucket of curated company documents. When a user asks a question, it performs RAG (Retrieval-Augmented Generation) — retrieving relevant chunks from the knowledge base, then generating a grounded answer with Claude. Session IDs enable multi-turn conversations.",
          techFlow: [
            "User types a question in the floating chat widget",
            "Request includes a session ID for conversation continuity",
            "Lambda queries the Bedrock Knowledge Base for relevant document chunks",
            "Retrieved context is injected into Claude's prompt (RAG pattern)",
            "Claude generates a grounded answer, streamed back to the widget",
            "Session state persists across messages for follow-up questions",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "LLM inference + Knowledge Bases" },
            { name: "Amazon S3", role: "Document storage for RAG" },
            { name: "AWS Lambda", role: "Query orchestration" },
            { name: "API Gateway", role: "Chat endpoint with session tracking" },
          ],
        },
        {
          id: "website-remix",
          title: "Website Remix",
          subtitle: "Restyle this site with AI.",
          icon: "paintbrush",
          link: null,
          whatItDoes:
            "Type a visual theme (e.g., 'retro 80s neon' or 'minimalist monochrome') and AI generates custom CSS that transforms the entire site's look in real time. Reset anytime to return to the original.",
          howItWorks:
            "The Lambda sends your theme description to Claude with a system prompt containing the site's CSS custom properties and design token structure. Claude generates override CSS that targets the existing theme variables. The frontend injects the CSS as a <style> tag, instantly restyling the page.",
          techFlow: [
            "User types a theme description (e.g., 'warm earthy tones')",
            "Lambda sends the prompt with the site's CSS variable schema",
            "Claude generates CSS overrides targeting theme custom properties",
            "Response streams with CSS between ---CSS--- markers",
            "Frontend extracts the CSS and injects it as a <style> element",
            "A banner appears with a reset button to restore the original theme",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "CSS generation with Claude" },
            { name: "AWS Lambda", role: "Theme prompt handler" },
            { name: "API Gateway", role: "Remix endpoint" },
          ],
        },
        {
          id: "live-translation",
          title: "Live Translation",
          subtitle: "Read this site in 25+ languages.",
          icon: "globe",
          link: null,
          whatItDoes:
            "Click any language flag and the entire page is translated in place — headlines, paragraphs, buttons, and all. Translations are context-aware and preserve formatting. Reset to return to English anytime.",
          howItWorks:
            "The frontend collects all translatable text nodes from the DOM, batches them (50 per request), and sends them to a Lambda that calls Claude with translation-specific prompts. Claude returns a JSON array of translated strings, which the frontend applies back to the corresponding DOM elements.",
          techFlow: [
            "User clicks a language flag (e.g., German, Japanese)",
            "Frontend traverses the DOM and collects text from translatable elements",
            "Original text is stored in a Map for later reset",
            "Texts are batched (50 per request) and sent to the translation Lambda",
            "Claude translates the batch while preserving formatting and context",
            "Translated strings are applied to DOM elements; a banner shows active language",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "Context-aware translation with Claude" },
            { name: "AWS Lambda", role: "Batch translation handler" },
            { name: "API Gateway", role: "Translation endpoint" },
          ],
        },
        {
          id: "agentic-coding",
          title: "Agentic Coding Stats",
          subtitle: "Live GitHub activity from AI agents.",
          icon: "code",
          link: "/agentic-coding",
          whatItDoes:
            "Displays real-time GitHub statistics — commits, lines changed, and a 7-day activity chart — from our organization's repositories. An AI-generated narrative summarizes the day's development activity.",
          howItWorks:
            "Two Lambda functions power this feature. The stats Lambda queries the GitHub API for commit and diff data across all org repos, caching results in DynamoDB with TTL. The story Lambda takes the stats and sends them to Claude, which generates a creative narrative about the day's coding activity.",
          techFlow: [
            "Page loads and fetches /github-stats from the API",
            "Stats Lambda checks DynamoDB cache (5-minute TTL)",
            "On cache miss, Lambda queries GitHub API for org-wide commit data",
            "Stats are aggregated (24h, 7d) and history points are stored",
            "Frontend renders stats cards and draws a Canvas-based activity chart",
            "Story Lambda sends stats to Claude for a narrative summary",
          ],
          awsServices: [
            { name: "Amazon Bedrock", role: "AI story generation with Claude" },
            { name: "Amazon DynamoDB", role: "Stats caching with TTL" },
            { name: "AWS Lambda", role: "GitHub API integration + story generation" },
            { name: "API Gateway", role: "Stats and story endpoints" },
          ],
        },
      ],
      architectureSection: {
        chip: "Architecture",
        headline: { before: "The Full ", gradient: "Stack", after: "" },
        description:
          "All AI features run on a serverless AWS architecture. Here's every service involved, grouped by layer.",
        categories: [
          {
            title: "AI / ML Layer",
            services: [
              { name: "Amazon Bedrock", description: "Managed LLM inference with Claude — powers all AI features" },
              { name: "Bedrock Knowledge Bases", description: "RAG pipeline for the chat assistant's document retrieval" },
            ],
          },
          {
            title: "Compute Layer",
            services: [
              { name: "AWS Lambda", description: "Serverless functions for every API endpoint — zero idle cost" },
              { name: "API Gateway", description: "REST APIs with throttling, CORS, and custom domain mapping" },
            ],
          },
          {
            title: "Data Layer",
            services: [
              { name: "Amazon DynamoDB", description: "Low-latency caching for GitHub stats and rate limiting" },
              { name: "Amazon S3", description: "Document storage for the knowledge base and static assets" },
            ],
          },
          {
            title: "Networking & Orchestration",
            services: [
              { name: "Amazon CloudFront", description: "CDN for the static Astro site and asset delivery" },
              { name: "AWS CDK", description: "Infrastructure as code — the entire stack defined in TypeScript" },
              { name: "Amazon CloudWatch", description: "Centralized logging, metrics, and alerting across all Lambdas" },
              { name: "AWS IAM", description: "Fine-grained permissions between services" },
            ],
          },
        ],
      },
      cta: {
        headline: "Want This for Your Product?",
        description:
          "Every feature on this site is built with the same tools and patterns we use for clients. Let's build something intelligent together.",
        button: "Start a Conversation",
      },
    },

    contact: {
      meta: {
        title: "Contact",
        description: "Get in touch with creative-it to discuss your project",
      },
      hero: {
        chip: "Contact Us",
        headline: { before: "Let's Start ", gradient: "Building", after: "" },
        description:
          "Have a project in mind? We'd love to hear about it. Reach out and let's discuss how we can help you achieve your goals.",
      },
      infoHeadline: "Get in Touch",
      socialLabel: "Follow Us",
      form: {
        headline: "Send a Message",
        description: "Fill out the form below and we'll get back to you shortly.",
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        companyLabel: "Company",
        companyOptional: "(optional)",
        companyPlaceholder: "Your company",
        subjectLabel: "Subject",
        subjectPlaceholder: "Select a topic",
        subjectOptions: [
          { value: "project", label: "New Project" },
          { value: "consulting", label: "Consulting Inquiry" },
          { value: "partnership", label: "Partnership Opportunity" },
          { value: "careers", label: "Careers" },
          { value: "other", label: "Other" },
        ],
        messageLabel: "Message",
        messagePlaceholder: "Tell us about your project or inquiry...",
        submitButton: "Send Message",
        successMessage: "Thank you for your message! We'll be in touch soon.",
      },
      faqSection: {
        chip: "FAQ",
        headline: "Common Questions",
      },
    },
  },

  // ── Chat Widget ──────────────────────────────────────────────────────────
  chatWidget: {
    buttonLabel: "Ask AI",
    headline: "Ask creative-it AI",
    placeholder: "Ask about our services, process, or team...",
    talkToHuman: "Talk to a human",
    poweredBy: "Powered by AWS Bedrock",
  },

  // ── Live Translation ────────────────────────────────────────────────────
  translation: {
    buttonLabel: "Translate",
    headline: "Live Translation",
    poweredBy: "Powered by AWS Bedrock",
    translating: "Translating...",
    resetButton: "Original",
  },

  // ── Website Remix ───────────────────────────────────────────────────────
  remix: {
    buttonLabel: "Remix",
    headline: "Remix This Site",
    placeholder: "How should it look? (e.g., retro 80s neon)",
    remixButton: "Remix",
    resetButton: "Reset to Original",
    examples: ["Retro 80s neon", "Warm earthy tones", "Minimalist monochrome", "Cyberpunk"],
  },

  // ── Legal / Impressum ────────────────────────────────────────────────────
  legal: {
    en: {
      meta: {
        title: "Legal Notice",
        description: "Legal notice and company information for creative-it Software Consulting e.U.",
      },
      chip: "Legal Notice",
      headline: { before: "Legal ", gradient: "Notice", after: "" },
      switchLabel: "Auf Deutsch lesen",
      switchHref: "/legal/de",
      sections: [
        {
          title: "Information according to E-Commerce Act (ECG) and Media Act",
          content: null,
          items: [
            { label: "Company", value: "creative-it Software Consulting e.U." },
            { label: "Owner", value: "Georg Wieser" },
            { label: "Address", value: "Am Gassl 25, A-3482 Gösing am Wagram, Austria" },
            { label: "Phone", value: "+43 660 4943737" },
            { label: "Email", value: "info@creative-it.com" },
            { label: "Website", value: "https://www.creative-it.com" },
          ],
        },
        {
          title: "Company Registration",
          content: null,
          items: [
            { label: "Company Register Number", value: "FN 535024 w" },
            { label: "Commercial Court", value: "Landesgericht St. Pölten" },
            { label: "Legal Form", value: "Einzelunternehmen (sole proprietorship)" },
            { label: "Business Purpose", value: "IT services (IT-Dienstleistungen)" },
            { label: "Chamber Membership", value: "Wirtschaftskammer Niederösterreich (WKO NÖ)" },
          ],
        },
        {
          title: "Applicable Law & Jurisdiction",
          content: "Austrian law applies. Place of jurisdiction is St. Pölten, Austria.",
          items: [],
        },
        {
          title: "VAT",
          content: null,
          items: [
            { label: "VAT ID (UID)", value: "ATU76261648" },
          ],
        },
        {
          title: "Disclaimer",
          content: "Despite careful content control, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content. All content on this website is subject to Austrian copyright law. Any reproduction, distribution, or use beyond the boundaries of copyright law requires written consent.",
          items: [],
        },
        {
          title: "Privacy",
          content: "For detailed information about how we process personal data on this website, please see our full Privacy Policy at /privacy.",
          items: [],
        },
      ],
    },
    de: {
      meta: {
        title: "Impressum",
        description: "Impressum und Unternehmensinformationen der creative-it Software Consulting e.U.",
      },
      chip: "Impressum",
      headline: { before: "", gradient: "Impressum", after: "" },
      switchLabel: "Read in English",
      switchHref: "/legal",
      sections: [
        {
          title: "Informationen gemäß E-Commerce-Gesetz (ECG) und Mediengesetz",
          content: null,
          items: [
            { label: "Unternehmen", value: "creative-it Software Consulting e.U." },
            { label: "Inhaber", value: "Georg Wieser" },
            { label: "Adresse", value: "Am Gassl 25, A-3482 Gösing am Wagram, Österreich" },
            { label: "Telefon", value: "+43 660 4943737" },
            { label: "E-Mail", value: "info@creative-it.com" },
            { label: "Website", value: "https://www.creative-it.com" },
          ],
        },
        {
          title: "Firmenbucheintragung",
          content: null,
          items: [
            { label: "Firmenbuchnummer", value: "FN 535024 w" },
            { label: "Firmenbuchgericht", value: "Landesgericht St. Pölten" },
            { label: "Rechtsform", value: "Einzelunternehmen" },
            { label: "Unternehmensgegenstand", value: "IT-Dienstleistungen" },
            { label: "Kammerzugehörigkeit", value: "Wirtschaftskammer Niederösterreich (WKO NÖ)" },
          ],
        },
        {
          title: "Anwendbares Recht & Gerichtsstand",
          content: "Es gilt österreichisches Recht. Gerichtsstand ist St. Pölten, Österreich.",
          items: [],
        },
        {
          title: "Umsatzsteuer",
          content: null,
          items: [
            { label: "UID-Nummer", value: "ATU76261648" },
          ],
        },
        {
          title: "Haftungsausschluss",
          content: "Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Alle Inhalte dieser Website unterliegen dem österreichischen Urheberrecht. Jede Vervielfältigung, Verbreitung oder Nutzung über die Grenzen des Urheberrechts hinaus bedarf der schriftlichen Zustimmung.",
          items: [],
        },
        {
          title: "Datenschutz",
          content: "Ausführliche Informationen zur Verarbeitung personenbezogener Daten auf dieser Website finden Sie in unserer vollständigen Datenschutzerklärung unter /privacy/de.",
          items: [],
        },
      ],
    },
  },

  // ── Privacy Policy / Datenschutzerklärung ─────────────────────────────────
  privacy: {
    en: {
      meta: {
        title: "Privacy Policy",
        description: "Privacy policy of creative-it Software Consulting e.U. — information about data processing on this website.",
      },
      chip: "Privacy Policy",
      headline: { before: "Privacy ", gradient: "Policy", after: "" },
      switchLabel: "Auf Deutsch lesen",
      switchHref: "/privacy/de",
      lastUpdated: "February 2025",
      sections: [
        {
          title: "1. Controller",
          paragraphs: [
            "creative-it Software Consulting e.U., Georg Wieser, Am Gassl 25, A-3482 Gösing am Wagram, Austria. Email: info@creative-it.com, Phone: +43 660 4943737.",
          ],
        },
        {
          title: "2. Overview",
          paragraphs: [
            "This privacy policy informs you about the nature, scope, and purpose of the processing of personal data on our website creative-it.com in accordance with the General Data Protection Regulation (GDPR) and the Austrian Data Protection Act (DSG).",
          ],
        },
        {
          title: "3. Legal Basis",
          paragraphs: [
            "We process personal data on the following legal bases: Consent (Art. 6(1)(a) GDPR) — e.g. when using the contact form or AI-powered services. Contract performance or pre-contractual measures (Art. 6(1)(b) GDPR). Legitimate interest (Art. 6(1)(f) GDPR) — e.g. secure operation of the website, rate limiting, and abuse prevention.",
          ],
        },
        {
          title: "4. Hosting",
          paragraphs: [
            "This website is hosted by Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA). When you visit our website, information is automatically stored in server log files, including: IP address, date and time of access, page visited, browser type and operating system, and referrer URL.",
            "This data is processed for the purpose of secure and reliable operation of the website (Art. 6(1)(f) GDPR). Vercel is certified under the EU-US Data Privacy Framework.",
          ],
        },
        {
          title: "5. Contact Form",
          paragraphs: [
            "When you send us a message via the contact form, your name, email address, and message are transmitted to us via Amazon Web Services (AWS) Simple Email Service (SES). The processing is carried out to handle your inquiry (Art. 6(1)(a) or (b) GDPR).",
            "Your data is used solely to respond to your inquiry and is not stored beyond that unless a business relationship is established. AWS processes data in the EU region (Frankfurt, eu-central-1).",
          ],
        },
        {
          title: "6. AI-Powered Services",
          paragraphs: [
            "Our website offers several AI-powered features (including AI Playground, Tech Advisor, Knowledge Bot, Website Remix, Live Translation, Agent Visualizer, and Commit Story). When you use these services, your text inputs are transmitted to Amazon Bedrock (AWS) for processing by AI models.",
            "Processing takes place in the AWS EU region (Frankfurt, eu-central-1). No text inputs are permanently stored or used for training purposes. Usage is based on your consent (Art. 6(1)(a) GDPR), which you grant by actively using the services.",
          ],
        },
        {
          title: "7. Rate Limiting and Abuse Prevention",
          paragraphs: [
            "To protect our services from abuse, we use IP-based rate limiting. A hashed version of your IP address is temporarily stored in Amazon DynamoDB to limit the number of requests. This data is automatically deleted after 24 hours.",
            "The legal basis is our legitimate interest in secure operation (Art. 6(1)(f) GDPR).",
          ],
        },
        {
          title: "8. Google Fonts",
          paragraphs: [
            "This website uses Google Fonts by Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) for consistent font display. When loading the page, fonts are retrieved from Google servers (fonts.googleapis.com, fonts.gstatic.com), during which your IP address is transmitted to Google.",
            "The legal basis is our legitimate interest in an appealing presentation (Art. 6(1)(f) GDPR). Google is certified under the EU-US Data Privacy Framework.",
          ],
        },
        {
          title: "9. Cookies",
          paragraphs: [
            "This website does not use tracking cookies or analytics tools. Only technically necessary cookies are used if required for the operation of the website.",
          ],
        },
        {
          title: "10. Data Transfers to Third Countries",
          paragraphs: [
            "Some of our service providers are based in the USA: Vercel Inc. (hosting) and Google LLC (Google Fonts). Data transfers are based on the EU-US Data Privacy Framework (Art. 45 GDPR) or Standard Contractual Clauses (Art. 46(2)(c) GDPR).",
            "AWS services (Bedrock, DynamoDB, SES) are operated in the EU region (Frankfurt).",
          ],
        },
        {
          title: "11. Data Retention",
          paragraphs: [
            "Server logs (Vercel): according to Vercel's policies (typically 30 days). Contact form data: only for the duration of processing the inquiry. Rate limiting data: automatically deleted after 24 hours. AI inputs: not permanently stored.",
          ],
        },
        {
          title: "12. Your Rights",
          paragraphs: [
            "Under the GDPR, you have the following rights: Right of access (Art. 15), Right to rectification (Art. 16), Right to erasure (Art. 17), Right to restriction of processing (Art. 18), Right to data portability (Art. 20), Right to object (Art. 21), and Right to withdraw consent (Art. 7(3)).",
            "To exercise your rights, contact us at info@creative-it.com.",
          ],
        },
        {
          title: "13. Right to Lodge a Complaint",
          paragraphs: [
            "You have the right to lodge a complaint with the competent supervisory authority: Austrian Data Protection Authority (Österreichische Datenschutzbehörde), Barichgasse 40-42, 1030 Vienna, Austria. Phone: +43 1 52 152-0, Email: dsb@dsb.gv.at, Website: www.dsb.gv.at.",
          ],
        },
        {
          title: "14. Changes to This Policy",
          paragraphs: [
            "We reserve the right to update this privacy policy as needed, for example due to changes to our website or legal requirements. The current version is always available on this page.",
          ],
        },
      ],
    },
    de: {
      meta: {
        title: "Datenschutzerklärung",
        description: "Datenschutzerklärung der creative-it Software Consulting e.U. — Informationen zur Datenverarbeitung auf dieser Website.",
      },
      chip: "Datenschutz",
      headline: { before: "Datenschutz", gradient: "erklärung", after: "" },
      switchLabel: "Read in English",
      switchHref: "/privacy",
      lastUpdated: "Februar 2025",
      sections: [
        {
          title: "1. Verantwortlicher",
          paragraphs: [
            "creative-it Software Consulting e.U., Georg Wieser, Am Gassl 25, A-3482 Gösing am Wagram, Österreich. E-Mail: info@creative-it.com, Telefon: +43 660 4943737.",
          ],
        },
        {
          title: "2. Übersicht",
          paragraphs: [
            "Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten auf unserer Website creative-it.com gemäß der Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG).",
          ],
        },
        {
          title: "3. Rechtsgrundlagen",
          paragraphs: [
            "Die Verarbeitung personenbezogener Daten erfolgt auf folgenden Rechtsgrundlagen: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) — z.\u00A0B. bei der Nutzung des Kontaktformulars oder der KI-gestützten Dienste. Vertragserfüllung oder vorvertragliche Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) — z.\u00A0B. für den sicheren Betrieb der Website, Rate Limiting und Missbrauchsschutz.",
          ],
        },
        {
          title: "4. Hosting",
          paragraphs: [
            "Diese Website wird von Vercel Inc. (440 N Barranca Ave #4133, Covina, CA 91723, USA) gehostet. Bei jedem Zugriff auf unsere Website werden automatisch Informationen in Server-Logfiles gespeichert, darunter: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Browser-Typ und Betriebssystem sowie Referrer-URL.",
            "Diese Daten werden zum Zweck des sicheren und störungsfreien Betriebs der Website verarbeitet (Art. 6 Abs. 1 lit. f DSGVO). Vercel ist unter dem EU-US Data Privacy Framework zertifiziert.",
          ],
        },
        {
          title: "5. Kontaktformular",
          paragraphs: [
            "Wenn Sie uns über das Kontaktformular eine Nachricht senden, werden Ihr Name, Ihre E-Mail-Adresse und Ihre Nachricht über Amazon Web Services (AWS) Simple Email Service (SES) an uns übermittelt. Die Verarbeitung erfolgt zum Zweck der Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. a bzw. lit. b DSGVO).",
            "Ihre Daten werden ausschließlich zur Beantwortung Ihrer Anfrage verwendet und darüber hinaus nicht gespeichert, sofern keine weitergehende Geschäftsbeziehung entsteht. AWS verarbeitet die Daten in der Region EU (Frankfurt, eu-central-1).",
          ],
        },
        {
          title: "6. KI-gestützte Dienste",
          paragraphs: [
            "Unsere Website bietet mehrere KI-gestützte Funktionen an (u.\u00A0a. AI Playground, Tech Advisor, Knowledge Bot, Website Remix, Live Translation, Agent Visualizer und Commit Story). Wenn Sie diese Dienste nutzen, werden Ihre Texteingaben an Amazon Bedrock (AWS) zur Verarbeitung durch KI-Modelle übermittelt.",
            "Die Verarbeitung erfolgt in der AWS-Region EU (Frankfurt, eu-central-1). Es werden keine Texteingaben dauerhaft gespeichert oder für Trainingszwecke verwendet. Die Nutzung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO), die Sie durch aktive Nutzung der Dienste erteilen.",
          ],
        },
        {
          title: "7. Rate Limiting und Missbrauchsschutz",
          paragraphs: [
            "Zum Schutz unserer Dienste vor Missbrauch setzen wir ein IP-basiertes Rate Limiting ein. Dabei wird eine gehashte Version Ihrer IP-Adresse temporär in Amazon DynamoDB gespeichert, um die Anzahl der Anfragen zu begrenzen. Diese Daten werden automatisch nach 24 Stunden gelöscht.",
            "Rechtsgrundlage ist unser berechtigtes Interesse am sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).",
          ],
        },
        {
          title: "8. Google Fonts",
          paragraphs: [
            "Diese Website verwendet Google Fonts der Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) zur einheitlichen Darstellung von Schriftarten. Beim Laden der Seite werden Schriftarten von Google-Servern (fonts.googleapis.com, fonts.gstatic.com) abgerufen, wobei Ihre IP-Adresse an Google übermittelt wird.",
            "Rechtsgrundlage ist unser berechtigtes Interesse an einer ansprechenden Darstellung (Art. 6 Abs. 1 lit. f DSGVO). Google ist unter dem EU-US Data Privacy Framework zertifiziert.",
          ],
        },
        {
          title: "9. Cookies",
          paragraphs: [
            "Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools. Es werden ausschließlich technisch notwendige Cookies eingesetzt, sofern für den Betrieb der Website erforderlich.",
          ],
        },
        {
          title: "10. Datenweitergabe an Drittländer",
          paragraphs: [
            "Einige unserer Dienstleister haben ihren Sitz in den USA: Vercel Inc. (Hosting) und Google LLC (Google Fonts). Die Datenübermittlung erfolgt auf Grundlage des EU-US Data Privacy Frameworks (Art. 45 DSGVO) bzw. Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).",
            "AWS-Dienste (Bedrock, DynamoDB, SES) werden in der Region EU (Frankfurt) betrieben.",
          ],
        },
        {
          title: "11. Speicherdauer",
          paragraphs: [
            "Server-Logs (Vercel): gemäß Vercel-Richtlinien (typischerweise 30 Tage). Kontaktformular-Daten: nur für die Dauer der Anfragenbearbeitung. Rate-Limiting-Daten: automatische Löschung nach 24 Stunden. KI-Eingaben: werden nicht dauerhaft gespeichert.",
          ],
        },
        {
          title: "12. Ihre Rechte",
          paragraphs: [
            "Sie haben gemäß DSGVO folgende Rechte: Auskunftsrecht (Art. 15), Recht auf Berichtigung (Art. 16), Recht auf Löschung (Art. 17), Recht auf Einschränkung der Verarbeitung (Art. 18), Recht auf Datenübertragbarkeit (Art. 20), Widerspruchsrecht (Art. 21) sowie Recht auf Widerruf einer Einwilligung (Art. 7 Abs. 3).",
            "Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter info@creative-it.com.",
          ],
        },
        {
          title: "13. Beschwerderecht",
          paragraphs: [
            "Sie haben das Recht, sich bei der zuständigen Aufsichtsbehörde zu beschweren: Österreichische Datenschutzbehörde, Barichgasse 40-42, 1030 Wien, Österreich. Telefon: +43 1 52 152-0, E-Mail: dsb@dsb.gv.at, Website: www.dsb.gv.at.",
          ],
        },
        {
          title: "14. Änderungen",
          paragraphs: [
            "Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, z.\u00A0B. bei Änderungen unserer Website oder der rechtlichen Anforderungen. Die aktuelle Fassung ist stets auf dieser Seite abrufbar.",
          ],
        },
      ],
    },
  },

  // ── Colors (reference only) ───────────────────────────────────────────────
  colors: {
    navy: "#030520",
    navyLight: "#181B39",
    purple: "#A163F1",
    indigo: "#6363F1",
    cyan: "#23F0C3",
    cyanBright: "#40DFA3",
    surface: "#0F1132",
    offWhite: "#F5F5F7",
  },
};
