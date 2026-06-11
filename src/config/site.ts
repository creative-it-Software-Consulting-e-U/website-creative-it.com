// ============================================================================
// Site Configuration — Bilingual EN + DE
// ============================================================================

export type Locale = 'en' | 'de';

// ── Shared (locale-agnostic) ───────────────────────────────────────────────

const shared = {
  name: "creative-it",

  contact: {
    email: "info@creative-it.com",
    phone: "+43-660-4943737",
    address: "Am Gassl 25, A-3482 Gösing am Wagram, Austria",
  },

  social: {
    linkedin: "https://www.linkedin.com/company/35435836",
    twitter: "https://x.com/creative_it_at",
    github: "https://github.com/orgs/creative-it-Software-Consulting-e-U/",
  },

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
            { label: "Owner", value: "Günther Wieser" },
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
            { label: "Inhaber", value: "Günther Wieser" },
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
            "creative-it Software Consulting e.U., Günther Wieser, Am Gassl 25, A-3482 Gösing am Wagram, Austria. Email: info@creative-it.com, Phone: +43 660 4943737.",
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
          title: "8. Web Fonts",
          paragraphs: [
            "This website uses the web fonts Newsreader, IBM Plex Sans, and IBM Plex Mono for consistent font display. All fonts are self-hosted and delivered directly from this website's server. No connection to third-party font services (such as Google Fonts) is established, and no data is transmitted to font providers.",
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
            "Our hosting provider Vercel Inc. is based in the USA. Data transfers are based on the EU-US Data Privacy Framework (Art. 45 GDPR) or Standard Contractual Clauses (Art. 46(2)(c) GDPR).",
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
            "creative-it Software Consulting e.U., Günther Wieser, Am Gassl 25, A-3482 Gösing am Wagram, Österreich. E-Mail: info@creative-it.com, Telefon: +43 660 4943737.",
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
          title: "8. Webfonts",
          paragraphs: [
            "Diese Website verwendet die Schriftarten Newsreader, IBM Plex Sans und IBM Plex Mono zur einheitlichen Darstellung. Alle Schriftarten werden lokal gehostet und direkt vom Server dieser Website ausgeliefert. Es wird keine Verbindung zu Schriftdiensten Dritter (etwa Google Fonts) aufgebaut und es werden keine Daten an Schriftanbieter übermittelt.",
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
            "Unser Hosting-Anbieter Vercel Inc. hat seinen Sitz in den USA. Die Datenübermittlung erfolgt auf Grundlage des EU-US Data Privacy Frameworks (Art. 45 DSGVO) bzw. Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).",
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
};

// ── Locale-specific content ────────────────────────────────────────────────

const content = {
  en: {
    tagline: "AWS Serverless & Agentic AI Consulting",
    description:
      "I build serverless systems and AI agents on AWS — GDPR-compliant and production-ready. You talk directly to the person who does the work.",

    navigation: [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services/", children: [
        { name: "Overview", href: "/services/" },
        { name: "AWS Serverless", href: "/services/aws-serverless/" },
        { name: "Agentic AI", href: "/services/agentic-ai/" },
        { name: "Fractional CTO", href: "/services/fractional-cto/" },
        { name: "Cloud Optimization", href: "/services/cloud-optimization/" },
      ]},
      { name: "About", href: "/about/" },
      { name: "AI Lab", href: "#", children: [
        { name: "AI Playground", href: "/ai-playground/" },
        { name: "Tech Advisor", href: "/tech-advisor/" },
        { name: "AI Agents", href: "/ai-agents/" },
        { name: "How It Works", href: "/how-it-works/" },
      ]},
      { name: "Blog", href: "/blog/" },
      { name: "Contact", href: "/contact/" },
    ],

    services: [
      {
        slug: "aws-serverless",
        title: "AWS Serverless Architecture",
        description:
          "Zero-ops infrastructure that scales automatically and costs only what you use. I design event-driven systems on Lambda, DynamoDB, and API Gateway that are production-ready from day one.",
        icon: "cloud",
        features: [
          "Serverless Architecture",
          "Infrastructure as Code",
          "Event-driven microservices",
          "Pay-per-use cost model",
        ],
        tagline: "Infrastructure that scales itself — so you can focus on building.",
        longDescription: "Serverless architecture eliminates the need to provision, scale, or maintain servers. With core services like AWS Lambda, DynamoDB, and API Gateway, your applications respond to demand in real time — scaling from zero to millions of requests without manual intervention.\n\nI design event-driven systems using Infrastructure as Code (AWS CDK), ensuring every deployment is reproducible, auditable, and version-controlled. From REST APIs to real-time data pipelines, my serverless architectures are built for production from day one.\n\nThe result: lower operational costs, faster time to market, and infrastructure that grows with your business — not against it.",
        benefits: [
          { title: "Zero Ops Overhead", description: "No servers to patch, scale, or monitor. AWS handles the infrastructure so your team focuses on features." },
          { title: "Pay Only for Usage", description: "No idle compute costs. You pay per request and per millisecond of execution — nothing more." },
          { title: "Infinite Scalability", description: "From zero to millions of requests automatically. No capacity planning, no bottlenecks." },
        ],
        useCases: [
          "REST & GraphQL APIs with automatic scaling",
          "Event-driven data processing pipelines",
          "Real-time webhooks and integrations",
          "Scheduled batch jobs and ETL workflows",
        ],
      },
      {
        slug: "agentic-ai",
        title: "Agentic AI & GDPR Compliance",
        description:
          "Custom AI agents built on AWS Bedrock that automate workflows and augment your team — EU-compliant from day one, with your data staying in the EU.",
        icon: "brain",
        features: [
          "AWS Bedrock agent development",
          "RAG pipelines & knowledge bases",
          "GDPR-compliant AI architecture",
          "GDPR-compliant Agentic Coding",
        ],
        tagline: "AI agents that work for you — not against compliance.",
        longDescription: "Agentic AI goes beyond simple chatbots. I build autonomous AI agents on AWS Bedrock that understand context, plan multi-step actions, and execute complex workflows — all while keeping your data within the EU.\n\nThe agents leverage Retrieval-Augmented Generation (RAG) to ground responses in your actual business data, reducing hallucinations and increasing accuracy. Combined with human-in-the-loop safeguards, you get AI that's powerful yet controllable.\n\nEvery solution is architected with GDPR compliance from the start: data residency in the EU (dedicated region like Frankfurt/eu-central-1, or across EU regions for cheaper and faster inference), no training on your data, full audit trails, and consent management built in.",
        benefits: [
          { title: "EU-Compliant by Design", description: "All data processed in AWS EU regions. No model training on your data. Full audit trails and consent management." },
          { title: "Grounded in Your Data", description: "RAG pipelines ensure AI responses are based on your actual documents and knowledge — not generic training data." },
          { title: "Human-in-the-Loop", description: "Critical decisions stay with humans. Agents handle the heavy lifting; your team keeps control." },
        ],
        useCases: [
          "In-app AI assistants and chatbots",
          "Document processing and extraction pipelines",
          "Knowledge base Q&A systems",
          "Automated workflow orchestration",
        ],
      },
      {
        slug: "fractional-cto",
        title: "Fractional CTO",
        description:
          "C-level technology leadership at a fraction of the cost: strategy, architecture decisions, and mentoring from someone who has built systems for 30+ years — a few days a month instead of a full-time salary.",
        icon: "ruler",
        features: [
          "Technology strategy & roadmap",
          "Architecture review & decisions",
          "Team mentoring & hiring guidance",
          "Vendor evaluation & due diligence",
        ],
        tagline: "C-level tech leadership without the full-time overhead.",
        longDescription: "Not every company needs a full-time CTO — but every company needs strategic technology leadership. As your Fractional CTO, I bring 30+ years of engineering experience to your leadership team on a flexible, part-time basis.\n\nFrom technology strategy and architecture decisions to team mentoring and vendor evaluation, I provide the guidance that turns technical investments into business outcomes. I've seen what works and what doesn't — across startups, scale-ups, and enterprise environments.\n\nThe engagement is tailored to your needs: a few days per month for ongoing advisory, or intensive sprints for critical decisions like technology migrations, team scaling, or product architecture.",
        benefits: [
          { title: "Senior Advice, Part-Time", description: "Strategic technology leadership a few days per month — without the full-time salary." },
          { title: "30+ Years Experience", description: "Deep expertise across cloud architecture, AI, mobile, and enterprise systems — battle-tested in production." },
          { title: "Flexible Engagement", description: "Scale involvement up or down as your needs change. Advisory retainer or intensive project sprints." },
        ],
        useCases: [
          "Technology strategy and roadmap planning",
          "Architecture reviews and technical due diligence",
          "Engineering team mentoring and hiring",
          "Build-vs-buy decisions and vendor evaluation",
        ],
      },
      {
        slug: "cloud-optimization",
        title: "Cost-Optimized Cloud & AI",
        description:
          "Reduce your cloud spend by up to 70% through right-sizing, reserved capacity, and FinOps practices. I turn bloated infrastructure into lean, cost-efficient systems.",
        icon: "code",
        features: [
          "AWS cost analysis & optimization",
          "FinOps implementation",
          "Serverless migration for cost savings",
          "AI workload cost management",
        ],
        tagline: "Cut cloud costs by up to 70% — without cutting capabilities.",
        longDescription: "Most companies overspend on cloud by 30-50%. I perform a deep cost analysis of your AWS infrastructure, identify waste, and implement FinOps practices that deliver measurable savings — without sacrificing performance or reliability.\n\nMy approach combines right-sizing, reserved capacity planning, spot instance strategies, and serverless migration to eliminate idle compute costs. For AI workloads, I optimize model selection, batching strategies, and caching to keep inference costs under control.\n\nEvery engagement starts with a detailed cost analysis and ends with a clear savings roadmap — so you know exactly what to expect before committing.",
        benefits: [
          { title: "40-70% Cost Reduction", description: "Most clients see dramatic savings through right-sizing, reserved capacity, and eliminating idle resources." },
          { title: "FinOps Best Practices", description: "Implement cost visibility, accountability, and optimization as ongoing disciplines — not one-time fixes." },
          { title: "AI Cost Control", description: "Optimize model selection, batching, and caching strategies to keep AI inference costs predictable." },
        ],
        useCases: [
          "AWS cost audit and savings roadmap",
          "Serverless migration for cost reduction",
          "AI/ML workload cost optimization",
          "FinOps culture and tooling implementation",
        ],
      },
    ],

    about: {
      mission:
        "To help businesses harness the power of AWS serverless and agentic AI — with solutions that are GDPR-compliant, production-ready, and built to scale.",
      essenz: [
        'I\'m <strong>Günther Wieser</strong>, AWS Serverless &amp; Agentic AI Architect, and founder of creative-it.',
        'I\'ve been building software for almost 35 years — from my first lines of code on an Intel 386DX to today, where AI agents ship entire features while <a href="/blog/the-rise-of-agentic-coding-moving-beyond-electron-and-react-native" class="text-cyan hover:text-cyan-bright transition-colors underline decoration-cyan/30 hover:decoration-cyan">I walk the dog</a>.',
        'Two moments changed everything for me: discovering <strong>Serverless Architecture</strong> around 2016, which freed me from infrastructure constraints and let me build the right solution instead of the affordable one. And the rise of <strong>Agentic Coding</strong> in late 2025, which removed the time and budget limitations that held back even the best ideas.',
        'creative-it is me — supported by a curated network of specialists who join on demand when a project needs it.',
      ],
      storyPrompt: "Read the full story below",
      fullStory: [
        'I reserved the domain "creative-it.com" in 1997, while I was studying in Graz, Austria. Just a few years before that, I started working with computers, and from the beginning I found that developing software means finding solutions to real-world problems, and that\'s a very creative task for me.',
        'Almost 30 years later, I still stand with this approach. So much has happened from starting my first coding on an Intel 386DX to today, where AI-based agents code complete applications on their own.',
        'What was never lost was my will to find the best solution for my customers. The one that actually solves their problem — not the one that looks best on a conference slide. Over this very long time, I stayed on top of the technology, dealing with dozens of programming languages, an uncountable number of frameworks and libraries, and massive conceptual changes in the paradigms how "good software" is built.',
        'But breadth alone wasn\'t the answer.',
        'The biggest change until then came about 2016 to 2017, when I noticed the benefits of Serverless Architectures. At the time, we were implementing a microservice-based application using Spring Cloud, which is to some extent the total opposite to Serverless. It wasn\'t the amount of code needed to write the application that drove me almost crazy, it was the complex infrastructure that we needed to build up and maintain, and the limitations we had.',
        'We asked the customer if we could have a Kafka streaming cluster, and they felt like we were asking for the impossible. We asked for strict schema separation in the database to encapsulate the services with their data, and they looked at us as if we were crazy scientists. And then I saw what Serverless means, and can do. Picking a service because it\'s the perfect fit in the architecture, without causing massive initial costs (servers, team knowledge, etc.) was like a huge release for my creativity. I finally was able to implement the best architecture for my customers, and still had no operational overhead. It was magic! We did everything from Proof-of-Concepts to large-scale ingestion services that can handle millions of messages per hour from zero without losing a single message over years of operations. Things that were impossible (and still are) without Serverless Architecture in the Cloud.',
        'Then, at the end of 2025, when agentic coding became reality, the next "release of creativity" came — all the ideas, all the features I could think of, can become reality within minutes or hours, or within a few iterations, while I could focus on other projects and tasks. This felt, again, like a door opens to a better world. Most teams are still underestimating the impact this will have on how software is built.',
        '<strong>Serverless freed us from architectural and infrastructure constraints, and agentic coding freed us from (most of the) time and budget limitations.</strong>',
        'So what is creative-it standing for today? Who is "we"?',
        'creative-it is me — supported by a curated network of specialists who join on demand when a project needs it.',
        'creative-it stands for providing you the best solution for your problem, so that we all can <strong>build</strong> a better future, <strong>grow</strong> on the problems and tasks ahead, and <strong>matter</strong> with what we do.',
      ],
      values: [
        {
          title: "Build",
          description:
            "I architect serverless systems and AI agents that solve real problems — not theoretical ones.",
        },
        {
          title: "Grow",
          description:
            "I scale your AI capabilities and cloud infrastructure so your technology grows with your business.",
        },
        {
          title: "Matter",
          description:
            "I deliver GDPR-compliant solutions with measurable ROI — because impact you can prove is impact that matters.",
        },
      ],
      whyChooseUs: {
        headline: "Specialist, Not Generalist",
        description:
          "I don't try to do everything — I go deep on AWS serverless and agentic AI. When you work with creative-it, you work with one specialist, not a rotating team.",
        benefits: [
          {
            title: "Deep AWS & AI Expertise",
            description:
              "Specialized in serverless architecture and agentic AI — not a generalist juggling dozens of technologies.",
          },
          {
            title: "GDPR-Compliant by Design",
            description:
              "Every solution is built with EU data protection requirements from the start, not bolted on as an afterthought.",
          },
          {
            title: "Fractional Flexibility",
            description: "C-level technology expertise without the full-time overhead — scale my involvement up or down as you need.",
          },
        ],
        highlights: [
          {
            title: "Production-Ready",
            description: "Battle-tested serverless architectures",
          },
          {
            title: "Cost-Optimized",
            description: "Up to 70% cloud cost reduction",
          },
          {
            title: "EU-Compliant",
            description: "GDPR built into every solution",
          },
        ],
      },
    },

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

    process: [
      {
        step: "01",
        title: "Discover",
        description:
          "I dive deep into your challenges, goals, and vision to understand the full picture.",
      },
      {
        step: "02",
        title: "Design",
        description:
          "I architect solutions that align with your objectives and scale with your growth.",
      },
      {
        step: "03",
        title: "Develop",
        description:
          "I build with precision, keeping you informed and involved every step of the way.",
      },
      {
        step: "04",
        title: "Deliver",
        description:
          "I deploy, optimize, and support — ensuring lasting success beyond launch.",
      },
    ],

    faq: [
      {
        question: "What is AWS Serverless and why should I care?",
        answer:
          "AWS Serverless means you run applications without managing servers. Services like Lambda, DynamoDB, and API Gateway automatically scale with demand and you only pay for actual usage. This eliminates idle server costs, reduces operational overhead, and lets your team focus on building features instead of maintaining infrastructure.",
      },
      {
        question: "How do you ensure GDPR compliance for AI solutions?",
        answer:
          "I build on AWS Bedrock, which processes data in the EU region (Frankfurt) and doesn't use your data for model training. All my AI architectures include data residency controls, consent management, and audit trails. I design for GDPR compliance from the start — it's not an afterthought.",
      },
      {
        question: "What does a Fractional CTO engagement look like?",
        answer:
          "A Fractional CTO engagement typically starts with a technology audit and strategy session. From there, I work with you on an ongoing basis — usually a few days per month — covering architecture decisions, team mentoring, vendor evaluation, and roadmap planning. You get C-level expertise without the full-time salary.",
      },
      {
        question: "How much can serverless save compared to traditional infrastructure?",
        answer:
          "Most clients see 40-70% cost reduction after migrating to serverless. The savings come from eliminating idle compute costs, reducing ops overhead, and paying only for actual usage. I provide a detailed cost analysis before any migration to quantify your specific savings potential.",
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes. I work with clients across Europe and beyond, with experience in cross-border data compliance and multi-region AWS deployments. My GDPR expertise is particularly valuable for companies operating in or selling to the EU market.",
      },
      {
        question: "What's the typical engagement timeline?",
        answer:
          "It depends on the scope. A serverless architecture review takes 1-2 weeks. An AI agent MVP typically takes 4-8 weeks. A full cloud migration can span 2-6 months. In a free initial call, I'll map out a timeline tailored to your specific needs and priorities.",
      },
    ],

    statsBanner: {
      description: "Code changes shipped by my agentic coding agents",
      last24h: "Last 24h",
      last7d: "Last 7d",
      learnMore: "Learn about agentic coding",
      commits: "commits",
      lines: "lines",
      collapseLabel: "Collapse stats card",
      expandLabel: "Show agentic coding stats",
    },

    pages: {
      home: {
        chip: "AI Agents · Serverless · Cloud Architecture",
        headline: { before: "AI agents write the code. I make sure it's the ", gradient: "right", after: " code." },
        ctaPrimary: "Book a Free Consultation",
        ctaSecondary: "See what I do",

        servicesSection: {
          chip: "Services",
          headline: { before: "What I ", gradient: "do", after: " — and what I deliberately don't." },
          description:
            "Four focused services: serverless architecture, AI agents, technology leadership, and cloud costs. For everything else, I'll point you to someone better suited.",
          linkText: "Learn more",
        },

        appsSection: {
          chip: "Products",
          headline: { before: "Products I ", gradient: "built", after: "" },
          description:
            "Focused tools and applications that solve real problems with clean design and thoughtful engineering.",
          linkText: "View all apps",
          linkUrl: "https://apps.creative-it.com",
        },

        philosophySection: {
          chip: "Philosophy",
          headline: { before: "The person behind ", gradient: "creative-it", after: "." },
          linkText: "Read my story",
        },

        cta: {
          headline: "You'll talk to the person\nwho does the work.",
          description:
            "Tell me what you're building. I read every message myself and usually reply the same day.",
          button: "Schedule a Consultation",
        },
      },

      about: {
        meta: {
          title: "About",
          description: "AWS Serverless & Agentic AI Architect — 30+ years of experience, specialized expertise",
        },
        hero: {
          chip: "About",
          headline: { before: "AWS Serverless & ", gradient: "Agentic AI", after: " Architect" },
        },
        storySection: {
          chip: "My Story",
          headline: "The domain since 1997. The craft since 1991.",
        },
        valuesSection: {
          chip: "Values",
          headline: { before: "Three words I ", gradient: "work", after: " by." },
        },
        whySection: {
          chip: "Why creative-it",
        },
        cta: {
          headline: "Write to me. I read every message myself.",
          description:
            "No sales team, no account managers — your message lands directly with me, and I usually reply the same day.",
          button: "Get in Touch",
        },
      },

      services: {
        meta: {
          title: "Services",
          description: "AWS Serverless Architecture, Agentic AI, Fractional CTO & Cloud Cost Optimization",
        },
        hero: {
          chip: "Services",
          headline: { before: "Four things I do ", gradient: "well", after: "." },
          description:
            "Serverless architecture, AI agents, fractional CTO work, and cloud cost optimization. If your problem is outside these four, I'll say so — and point you to someone better.",
        },
        serviceButton: "Discuss Your Project",
        processSection: {
          chip: "Process",
          headline: "How I work",
          description: "Four steps, no theater: understand, design, build, ship.",
        },
        cta: {
          headline: "Tell me about your project.",
          description:
            "A short call is enough to find out whether I'm the right person for it. If I'm not, I'll tell you.",
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
          headline: { before: "This page shows what AI agents ", gradient: "actually", after: " ship." },
          description:
            "I work with AI coding agents that write, review, and ship production code around the clock. The numbers below come live from my GitHub organization — not from a slide deck.",
        },
        whatSection: {
          chip: "What Is It",
          headline: "AI Agents That Write Real Code",
          description:
            "Agentic coding goes beyond autocomplete. Autonomous AI agents understand your codebase, plan implementations, write tests, and submit pull requests — just like a human developer. They handle the routine so I can focus on architecture, design, and the problems that matter.",
          points: [
            { title: "Autonomous Execution", description: "Agents independently plan, implement, and verify multi-file changes across entire repositories." },
            { title: "Context-Aware", description: "They understand your project structure, coding conventions, and business logic — not just syntax." },
            { title: "Human-in-the-Loop", description: "Every change is reviewed by me before it merges. Agents accelerate delivery; a human ensures quality." },
          ],
        },
        howSection: {
          chip: "Our Approach",
          headline: "How creative-it Uses Agentic Coding",
          description:
            "I integrate AI agents directly into my development workflow. They're not a gimmick — they're team members with assigned tasks, code review standards, and accountability.",
          steps: [
            { step: "01", title: "Task Assignment", description: "Agents receive well-scoped tasks from my project management system, just like any developer." },
            { step: "02", title: "Implementation", description: "Agents write code, create tests, and open pull requests with full context and documentation." },
            { step: "03", title: "Review & Merge", description: "I review every PR for quality, security, and alignment with project goals." },
            { step: "04", title: "Continuous Learning", description: "Agents improve over time as they absorb project conventions and feedback patterns." },
          ],
        },
        benefitsSection: {
          chip: "Productivity Gains",
          headline: { before: "Live numbers, not ", gradient: "estimates", after: "." },
          description:
            "The numbers from my live GitHub activity tell the story. Agentic coding isn't theoretical — it's shipping production code every day.",
          benefits: [
            { value: "5–10x", label: "Faster Feature Delivery", description: "What used to take a week ships in a day. Agents handle boilerplate, tests, and repetitive refactors at machine speed." },
            { value: "24/7", label: "Development Velocity", description: "Agents don't sleep. They process tasks overnight so engineers wake up to completed pull requests." },
            { value: "Higher", label: "Code Quality", description: "Every change comes with tests and documentation — and still goes through a human review before merge." },
            { value: "More", label: "Focus for Engineers", description: "With routine work handled, engineers spend their time on architecture, user experience, and creative problem-solving." },
          ],
        },
        statsSection: {
          commits24h: "Commits (24h)",
          linesChanged24h: "Lines Changed (24h)",
          commits7d: "Commits (7d)",
          linesChanged7d: "Lines Changed (7d)",
          liveDataNote: "Live data from my GitHub organization — updated in real time",
          chartTitle: "7-Day Activity",
          legendCommits: "Commits",
          legendLines: "Lines Changed",
          howItWorksLink: "How it works",
        },
        storySection: {
          chip: "AI Narrative",
          headline: "What the agents built today",
          description: "This story is generated live by AI based on my actual GitHub activity — a different narrative every time.",
          refreshButton: "New Story",
          loadingText: "AI is writing today's story...",
          fallback: "The agents have been busy shipping code. Check the stats above to see the numbers.",
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
        examples: [
          "A hero section with a gradient headline, subtitle, and two CTA buttons",
          "A pricing table with three tiers: Free, Pro, and Enterprise",
          "A dashboard stats grid with 4 metric cards showing icons and trends",
          "A product card with image, title, price, rating stars, and add-to-cart button",
          "A login form with email, password, social sign-in, and remember-me checkbox",
          "A data table with sortable columns, striped rows, and pagination",
          "A testimonial carousel card with avatar, quote, name, and role",
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
            "Describe your project requirements and the AI recommends a complete tech stack with architecture diagrams and reasoning.",
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
          headline: "Want this built for real?",
          description:
            "I can turn these recommendations into reality. Let's discuss your project.",
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
            "I build intelligent agents tailored to your workflows and business processes.",
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
          headline: { before: "How this site's AI ", gradient: "actually", after: " works" },
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
              "Displays real-time GitHub statistics — commits, lines changed, and a 7-day activity chart — from my organization's repositories. An AI-generated narrative summarizes the day's development activity.",
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
            "Every feature on this site is built with the same tools and patterns I use for client projects. Let's build something intelligent together.",
          button: "Start a Conversation",
        },
      },

      blog: {
        meta: {
          title: "Blog",
          description: "Articles about software development, AI, cloud architecture, and technology insights from creative-it",
        },
        hero: {
          chip: "Blog",
          headline: { before: "Insights & ", gradient: "Articles", after: "" },
          description:
            "Thoughts on software development, AI, cloud architecture, and the future of technology.",
        },
        minRead: "min read",
        cta: {
          headline: "Have a Project in Mind?",
          description:
            "If one of these topics matters for your business, write to me.",
          button: "Get in Touch",
        },
      },

      contact: {
        meta: {
          title: "Contact",
          description: "Book a free consultation for AWS Serverless, Agentic AI, or Fractional CTO services",
        },
        hero: {
          chip: "Contact",
          headline: { before: "Write to me. I answer ", gradient: "myself", after: "." },
          description:
            "Whether serverless architecture, AI agents, or technology leadership: tell me where you stand. I usually reply the same day.",
        },
        infoHeadline: "Get in Touch",
        socialLabel: "Follow Us",
        form: {
          headline: "Send a Message",
          description: "Or use the form — it lands in the same inbox.",
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
            { value: "serverless", label: "Serverless Architecture" },
            { value: "ai", label: "AI & Agentic Consulting" },
            { value: "cto", label: "Fractional CTO Inquiry" },
            { value: "optimization", label: "Cloud Cost Optimization" },
            { value: "other", label: "Other" },
          ],
          messageLabel: "Message",
          messagePlaceholder: "Tell me about your project or inquiry...",
          submitButton: "Send Message",
          successMessage: "Thank you! Your message is in my inbox — I'll get back to you shortly.",
        },
        faqSection: {
          chip: "FAQ",
          headline: "Common Questions",
        },
      },
    },

    chatWidget: {
      buttonLabel: "Ask AI",
      headline: "Ask creative-it AI",
      placeholder: "Ask about services, process, or availability...",
      talkToHuman: "Talk to a human",
      poweredBy: "Powered by AWS Bedrock",
    },

    translation: {
      buttonLabel: "Translate",
      headline: "Live Translation",
      poweredBy: "Powered by AWS Bedrock",
      translating: "Translating...",
      resetButton: "Original",
    },

    remix: {
      buttonLabel: "Remix",
      headline: "Remix This Site",
      placeholder: "How should it look? (e.g., elegant dark mode)",
      remixButton: "Remix",
      resetButton: "Reset to Original",
      examples: ["Elegant dark mode", "Warm terracotta & sand", "Cool Scandinavian blue", "1970s magazine"],
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GERMAN
  // ════════════════════════════════════════════════════════════════════════════

  de: {
    tagline: "Beratung für AWS Serverless & Agentic AI",
    description:
      "Ich baue serverlose Systeme und KI-Agenten auf AWS — DSGVO-konform und produktionsreif. Sie sprechen direkt mit dem, der die Arbeit macht.",

    navigation: [
      { name: "Home", href: "/de/" },
      { name: "Services", href: "/de/services/", children: [
        { name: "Übersicht", href: "/de/services/" },
        { name: "AWS Serverless", href: "/de/services/aws-serverless/" },
        { name: "Agentic AI", href: "/de/services/agentic-ai/" },
        { name: "Fractional CTO", href: "/de/services/fractional-cto/" },
        { name: "Cloud-Optimierung", href: "/de/services/cloud-optimization/" },
      ]},
      { name: "Über uns", href: "/de/about/" },
      { name: "KI-Labor", href: "#", children: [
        { name: "AI Playground", href: "/de/ai-playground/" },
        { name: "Tech-Berater", href: "/de/tech-advisor/" },
        { name: "KI-Agenten", href: "/de/ai-agents/" },
        { name: "Technologie", href: "/de/how-it-works/" },
      ]},
      { name: "Blog", href: "/de/blog/" },
      { name: "Kontakt", href: "/de/contact/" },
    ],

    services: [
      {
        slug: "aws-serverless",
        title: "AWS Serverless Architektur",
        description:
          "Zero-Ops-Infrastruktur, die automatisch skaliert und nur kostet, was Sie nutzen. Ich entwerfe event-getriebene Systeme auf Lambda, DynamoDB und API Gateway, die ab dem ersten Tag produktionsreif sind.",
        icon: "cloud",
        features: [
          "Serverless-Architektur",
          "Infrastructure as Code",
          "Event-driven Microservices",
          "Pay-per-Use Kostenmodell",
        ],
        tagline: "Infrastruktur, die sich selbst skaliert — damit Sie sich aufs Bauen konzentrieren können.",
        longDescription: "Serverless-Architektur eliminiert die Notwendigkeit, Server bereitzustellen, zu skalieren oder zu warten. Mit Kerndiensten wie AWS Lambda, DynamoDB und API Gateway reagieren Ihre Anwendungen in Echtzeit auf Nachfrage — skalieren von null auf Millionen Anfragen ohne manuelle Eingriffe.\n\nIch entwerfe event-driven Systeme mit Infrastructure as Code (AWS CDK), wobei jedes Deployment reproduzierbar, auditierbar und versionskontrolliert ist. Von REST-APIs bis zu Echtzeit-Datenpipelines — meine Serverless-Architekturen sind von Tag eins produktionsreif.\n\nDas Ergebnis: niedrigere Betriebskosten, schnellere Time-to-Market und Infrastruktur, die mit Ihrem Unternehmen wächst — nicht dagegen.",
        benefits: [
          { title: "Zero Ops Overhead", description: "Keine Server zum Patchen, Skalieren oder Überwachen. AWS verwaltet die Infrastruktur, damit Ihr Team sich auf Features konzentriert." },
          { title: "Zahlen nur bei Nutzung", description: "Keine Leerlauf-Compute-Kosten. Sie zahlen pro Anfrage und pro Millisekunde Ausführung — nicht mehr." },
          { title: "Unbegrenzte Skalierbarkeit", description: "Von null auf Millionen Anfragen automatisch. Keine Kapazitätsplanung, keine Engpässe." },
        ],
        useCases: [
          "REST- & GraphQL-APIs mit automatischer Skalierung",
          "Event-driven Datenverarbeitungspipelines",
          "Echtzeit-Webhooks und Integrationen",
          "Geplante Batch-Jobs und ETL-Workflows",
        ],
      },
      {
        slug: "agentic-ai",
        title: "Agentic AI & DSGVO-Konformität",
        description:
          "Maßgeschneiderte KI-Agenten auf AWS Bedrock, die Workflows automatisieren und Ihr Team verstärken — von Tag eins EU-konform, Ihre Daten bleiben in der EU.",
        icon: "brain",
        features: [
          "AWS Bedrock Agentenentwicklung",
          "RAG-Pipelines & Wissensdatenbanken",
          "DSGVO-konforme KI-Architektur",
          "DSGVO-konformes Agentic Coding",
        ],
        tagline: "KI-Agenten, die für Sie arbeiten — nicht gegen die Compliance.",
        longDescription: "Agentic AI geht über einfache Chatbots hinaus. Ich baue autonome KI-Agenten auf AWS Bedrock, die Kontext verstehen, mehrstufige Aktionen planen und komplexe Workflows ausführen — und dabei Ihre Daten innerhalb der EU halten.\n\nDie Agenten nutzen Retrieval-Augmented Generation (RAG), um Antworten in Ihren tatsächlichen Geschäftsdaten zu verankern, Halluzinationen zu reduzieren und die Genauigkeit zu erhöhen. Kombiniert mit Human-in-the-Loop-Sicherungen erhalten Sie KI, die leistungsfähig und dennoch kontrollierbar ist.\n\nJede Lösung wird von Anfang an DSGVO-konform entworfen: Datenresidenz in der EU (dedizierte Region wie Frankfurt/eu-central-1 oder EU-weit für günstigere und schnellere Inferenz), kein Training mit Ihren Daten, vollständige Audit-Trails und eingebautes Consent-Management.",
        benefits: [
          { title: "EU-konform by Design", description: "Alle Daten werden in AWS EU-Regionen verarbeitet. Kein Modelltraining mit Ihren Daten. Vollständige Audit-Trails und Consent-Management." },
          { title: "In Ihren Daten verankert", description: "RAG-Pipelines stellen sicher, dass KI-Antworten auf Ihren tatsächlichen Dokumenten und Wissen basieren — nicht auf generischen Trainingsdaten." },
          { title: "Mensch im Loop", description: "Kritische Entscheidungen bleiben beim Menschen. Agenten übernehmen die schwere Arbeit; Ihr Team behält die Kontrolle." },
        ],
        useCases: [
          "In-App KI-Assistenten und Chatbots",
          "Dokumentenverarbeitungs- und Extraktionspipelines",
          "Wissensdatenbank Q&A-Systeme",
          "Automatisierte Workflow-Orchestrierung",
        ],
      },
      {
        slug: "fractional-cto",
        title: "Fractional CTO",
        description:
          "C-Level-Technologieführung zu einem Bruchteil der Kosten: Strategie, Architekturentscheidungen und Mentoring von jemandem, der seit über 30 Jahren Systeme baut — ein paar Tage im Monat statt eines Vollzeit-Gehalts.",
        icon: "ruler",
        features: [
          "Technologiestrategie & Roadmap",
          "Architektur-Review & Entscheidungen",
          "Team-Mentoring & Hiring-Begleitung",
          "Vendor-Evaluation & Due Diligence",
        ],
        tagline: "C-Level Tech-Führung ohne Vollzeit-Overhead.",
        longDescription: "Nicht jedes Unternehmen braucht einen Vollzeit-CTO — aber jedes Unternehmen braucht strategische Technologieführung. Als Ihr Fractional CTO bringe ich über 30 Jahre Engineering-Erfahrung in Ihr Führungsteam ein — flexibel und in Teilzeit.\n\nVon Technologiestrategie und Architekturentscheidungen bis zu Team-Mentoring und Vendor-Evaluation: Ich biete die Begleitung, die technische Investitionen in Geschäftsergebnisse verwandelt. Ich habe gesehen, was funktioniert und was nicht — in Startups, Scale-ups und Enterprise-Umgebungen.\n\nDas Engagement wird auf Ihre Bedürfnisse zugeschnitten: einige Tage pro Monat für laufende Beratung oder intensive Sprints für kritische Entscheidungen wie Technologiemigrationen, Team-Skalierung oder Produktarchitektur.",
        benefits: [
          { title: "Senior-Beratung in Teilzeit", description: "Strategische Technologieführung an ein paar Tagen pro Monat — ohne Vollzeit-Gehalt." },
          { title: "30+ Jahre Erfahrung", description: "Tiefe Expertise in Cloud-Architektur, KI, Mobile und Enterprise-Systemen — praxiserprobt in der Produktion." },
          { title: "Flexibles Engagement", description: "Skalieren Sie die Beteiligung nach Bedarf hoch oder runter. Beratungs-Retainer oder intensive Projekt-Sprints." },
        ],
        useCases: [
          "Technologiestrategie und Roadmap-Planung",
          "Architektur-Reviews und technische Due Diligence",
          "Engineering-Team-Mentoring und Hiring",
          "Build-vs-Buy-Entscheidungen und Vendor-Evaluation",
        ],
      },
      {
        slug: "cloud-optimization",
        title: "Kostenoptimierte Cloud & KI",
        description:
          "Reduzieren Sie Ihre Cloud-Kosten um bis zu 70% durch Right-Sizing, reservierte Kapazitäten und FinOps-Praktiken. Ich verwandle aufgeblähte Infrastruktur in schlanke, kosteneffiziente Systeme.",
        icon: "code",
        features: [
          "AWS-Kostenanalyse & Optimierung",
          "FinOps-Implementierung",
          "Serverless-Migration zur Kostensenkung",
          "KI-Workload Kostenmanagement",
        ],
        tagline: "Cloud-Kosten um bis zu 70% senken — ohne Leistung einzubüßen.",
        longDescription: "Die meisten Unternehmen geben 30-50% zu viel für die Cloud aus. Ich führe eine tiefgehende Kostenanalyse Ihrer AWS-Infrastruktur durch, identifiziere Verschwendung und implementiere FinOps-Praktiken, die messbare Einsparungen liefern — ohne Leistung oder Zuverlässigkeit zu opfern.\n\nMein Ansatz kombiniert Right-Sizing, reservierte Kapazitätsplanung, Spot-Instance-Strategien und Serverless-Migration, um Leerlauf-Compute-Kosten zu eliminieren. Für KI-Workloads optimiere ich Modellauswahl, Batching-Strategien und Caching, um Inferenzkosten unter Kontrolle zu halten.\n\nJedes Engagement beginnt mit einer detaillierten Kostenanalyse und endet mit einer klaren Einsparungs-Roadmap — damit Sie genau wissen, was Sie erwartet, bevor Sie sich committen.",
        benefits: [
          { title: "40-70% Kostenreduktion", description: "Die meisten Kunden sehen dramatische Einsparungen durch Right-Sizing, reservierte Kapazitäten und Eliminierung ungenutzter Ressourcen." },
          { title: "FinOps Best Practices", description: "Implementieren Sie Kostentransparenz, Verantwortlichkeit und Optimierung als laufende Disziplinen — nicht als einmalige Fixes." },
          { title: "KI-Kostenkontrolle", description: "Optimieren Sie Modellauswahl, Batching und Caching-Strategien, um KI-Inferenzkosten vorhersagbar zu halten." },
        ],
        useCases: [
          "AWS-Kostenaudit und Einsparungs-Roadmap",
          "Serverless-Migration zur Kostenreduktion",
          "KI/ML-Workload Kostenoptimierung",
          "FinOps-Kultur und Tooling-Implementierung",
        ],
      },
    ],

    about: {
      mission:
        "Unternehmen dabei unterstützen, die Kraft von AWS Serverless und Agentic AI zu nutzen — mit Lösungen, die DSGVO-konform, produktionsreif und skalierbar sind.",
      essenz: [
        'Ich bin <strong>Günther Wieser</strong>, AWS Serverless &amp; Agentic AI Architekt und Gründer von creative-it.',
        'Seit fast 35 Jahren entwickle ich Software — von meinen ersten Codezeilen auf einem Intel 386DX bis heute, wo KI-Agenten komplette Features liefern, während <a href="/blog/the-rise-of-agentic-coding-moving-beyond-electron-and-react-native" class="text-cyan hover:text-cyan-bright transition-colors underline decoration-cyan/30 hover:decoration-cyan">ich mit dem Hund spazieren gehe</a>.',
        'Zwei Momente haben alles verändert: Die Entdeckung von <strong>Serverless Architecture</strong> um 2016, die mich von Infrastruktur-Einschränkungen befreite und mir erlaubte, die richtige Lösung zu bauen statt die leistbare. Und der Aufstieg von <strong>Agentic Coding</strong> Ende 2025, der die Zeit- und Budgetlimitierungen beseitigte, die selbst die besten Ideen zurückhielten.',
        'creative-it bin ich — unterstützt von einem kuratierten Netzwerk aus Spezialisten, die bei Bedarf zum Projekt dazustoßen.',
      ],
      storyPrompt: "Die ganze Geschichte lesen",
      fullStory: [
        'Ich habe die Domain „creative-it.com" 1997 reserviert, während ich in Graz studierte. Nur wenige Jahre davor begann ich mit Computern zu arbeiten, und von Anfang an erkannte ich: Software zu entwickeln bedeutet, Lösungen für reale Probleme zu finden — und das ist für mich eine zutiefst kreative Aufgabe.',
        'Fast 30 Jahre später stehe ich immer noch zu diesem Ansatz. So viel ist passiert, von meinem ersten Code auf einem Intel 386DX bis heute, wo KI-basierte Agenten komplette Anwendungen eigenständig programmieren.',
        'Was nie verloren ging, war mein Wille, die beste Lösung für meine Kunden zu finden. Diejenige, die tatsächlich ihr Problem löst — nicht diejenige, die auf einer Konferenz-Folie am besten aussieht. Über diese sehr lange Zeit blieb ich am Puls der Technologie, arbeitete mit Dutzenden Programmiersprachen, einer unzähligen Menge an Frameworks und Libraries, und massiven konzeptionellen Veränderungen in den Paradigmen, wie „gute Software" gebaut wird.',
        'Aber Breite allein war nicht die Antwort.',
        'Die größte Veränderung bis dahin kam etwa 2016 bis 2017, als ich die Vorteile von Serverless Architectures erkannte. Zu der Zeit implementierten wir eine Microservice-basierte Anwendung mit Spring Cloud, was in gewisser Hinsicht das totale Gegenteil von Serverless ist. Es war nicht die Menge an Code, die für die Anwendung geschrieben werden musste, die mich fast wahnsinnig machte — es war die komplexe Infrastruktur, die wir aufbauen und warten mussten, und die Einschränkungen, die wir hatten.',
        'Wir fragten den Kunden, ob wir einen Kafka-Streaming-Cluster haben könnten, und sie reagierten, als würden wir das Unmögliche verlangen. Wir baten um strikte Schema-Trennung in der Datenbank, um die Services mit ihren Daten zu kapseln, und sie schauten uns an wie verrückte Wissenschaftler. Und dann sah ich, was Serverless bedeutet und kann. Einen Service zu wählen, weil er perfekt in die Architektur passt, ohne massive Anfangskosten (Server, Team-Know-how etc.) zu verursachen — das war wie eine riesige Befreiung für meine Kreativität. Endlich konnte ich die beste Architektur für meine Kunden umsetzen und hatte trotzdem keinen operativen Overhead. Es war Magie! Wir bauten alles von Proof-of-Concepts bis zu Large-Scale-Ingestion-Services, die Millionen von Nachrichten pro Stunde von null verarbeiten können, ohne eine einzige Nachricht über Jahre des Betriebs zu verlieren. Dinge, die ohne Serverless Architecture in der Cloud unmöglich waren (und immer noch sind).',
        'Dann, Ende 2025, als Agentic Coding Realität wurde, kam die nächste „Befreiung der Kreativität" — alle Ideen, alle Features, die mir einfielen, konnten innerhalb von Minuten oder Stunden Realität werden, oder innerhalb weniger Iterationen, während ich mich auf andere Projekte und Aufgaben konzentrieren konnte. Das fühlte sich wieder an, als würde sich eine Tür zu einer besseren Welt öffnen. Die meisten Teams unterschätzen noch immer den Einfluss, den das auf die Art haben wird, wie Software gebaut wird.',
        '<strong>Serverless befreite uns von architektonischen und infrastrukturellen Einschränkungen, und Agentic Coding befreite uns von (den meisten) Zeit- und Budget-Limitierungen.</strong>',
        'Wofür steht creative-it heute? Wer ist „wir"?',
        'creative-it bin ich — unterstützt von einem kuratierten Netzwerk aus Spezialisten, die bei Bedarf zum Projekt dazustoßen.',
        'creative-it steht dafür, Ihnen die beste Lösung für Ihr Problem zu liefern, damit wir alle eine bessere Zukunft <strong>bauen</strong>, an den Problemen und Aufgaben vor uns <strong>wachsen</strong> und mit dem, was wir tun, <strong>wirken</strong> können.',
      ],
      values: [
        {
          title: "Build",
          description:
            "Ich entwerfe Serverless-Systeme und KI-Agenten, die echte Probleme lösen — keine theoretischen.",
        },
        {
          title: "Grow",
          description:
            "Ich skaliere Ihre KI-Fähigkeiten und Cloud-Infrastruktur, damit Ihre Technologie mit Ihrem Unternehmen wächst.",
        },
        {
          title: "Matter",
          description:
            "Ich liefere DSGVO-konforme Lösungen mit messbarem ROI — denn Wirkung, die man belegen kann, ist Wirkung, die zählt.",
        },
      ],
      whyChooseUs: {
        headline: "Spezialist, kein Generalist",
        description:
          "Ich versuche nicht, alles zu machen — ich gehe bei AWS Serverless und Agentic AI in die Tiefe. Wer mit creative-it arbeitet, arbeitet mit einem Spezialisten, nicht mit einem wechselnden Team.",
        benefits: [
          {
            title: "Tiefe AWS- & KI-Expertise",
            description:
              "Spezialisiert auf Serverless-Architektur und Agentic AI — kein Generalist, der dutzende Technologien jongliert.",
          },
          {
            title: "DSGVO-konform by Design",
            description:
              "Jede Lösung wird von Anfang an mit EU-Datenschutzanforderungen gebaut — nicht nachträglich draufgeschraubt.",
          },
          {
            title: "Fraktionale Flexibilität",
            description: "C-Level-Technologie-Expertise ohne Vollzeit-Overhead — skalieren Sie meine Beteiligung nach Bedarf.",
          },
        ],
        highlights: [
          {
            title: "Produktionsreif",
            description: "Battle-tested Serverless-Architekturen",
          },
          {
            title: "Kostenoptimiert",
            description: "Bis zu 70% Cloud-Kostenreduktion",
          },
          {
            title: "EU-konform",
            description: "DSGVO in jede Lösung eingebaut",
          },
        ],
      },
    },

    apps: [
      {
        title: "GeoHook",
        description:
          "Lösen Sie automatisch Webhooks aus, wenn Sie Standorte betreten oder verlassen. Verbinden Sie Ihre Geofences mit Home Assistant, IFTTT, n8n oder jeder beliebigen API.",
        icon: "/apps/geohook-icon.svg",
        link: "https://geohook.creative-it.com",
        status: "live" as const,
      },
      {
        title: "AInvoiceMate",
        description:
          "KI-gestützte Rechnungsverarbeitung für Ihren Buchhaltungs-Workflow. Rechnungen scannen, Daten automatisch extrahieren und nach sevDesk, DATEV, Google Sheets und mehr exportieren.",
        icon: "/apps/ainvoicemate-icon.png",
        link: null,
        status: "coming-soon" as const,
      },
      {
        title: "FlowAgent",
        description:
          "Automatisierte Buchhaltung und Finanzmanagement für österreichisches Steuerrecht. KI-gestützte Rechnungsverarbeitung, Transaktionsverfolgung und Cashflow-Prognosen.",
        icon: "/apps/flowagent-icon.png",
        link: null,
        status: "coming-soon" as const,
      },
    ],

    process: [
      {
        step: "01",
        title: "Entdecken",
        description:
          "Ich tauche tief in Ihre Herausforderungen, Ziele und Vision ein, um das Gesamtbild zu verstehen.",
      },
      {
        step: "02",
        title: "Entwerfen",
        description:
          "Ich entwerfe Lösungen, die auf Ihre Ziele abgestimmt sind und mit Ihrem Wachstum skalieren.",
      },
      {
        step: "03",
        title: "Entwickeln",
        description:
          "Ich baue mit Präzision und halte Sie bei jedem Schritt informiert und eingebunden.",
      },
      {
        step: "04",
        title: "Ausliefern",
        description:
          "Ich deploye, optimiere und unterstütze — für nachhaltigen Erfolg über den Launch hinaus.",
      },
    ],

    faq: [
      {
        question: "Was ist AWS Serverless und warum sollte mich das interessieren?",
        answer:
          "AWS Serverless bedeutet, dass Sie Anwendungen betreiben, ohne Server zu verwalten. Dienste wie Lambda, DynamoDB und API Gateway skalieren automatisch mit der Nachfrage und Sie zahlen nur für die tatsächliche Nutzung. Das eliminiert Leerlauf-Serverkosten, reduziert den Betriebsaufwand und lässt Ihr Team sich auf Features konzentrieren statt auf Infrastruktur.",
      },
      {
        question: "Wie stellen Sie die DSGVO-Konformität bei KI-Lösungen sicher?",
        answer:
          "Ich baue auf AWS Bedrock, das Daten in der EU-Region (Frankfurt) verarbeitet und Ihre Daten nicht für Modelltraining verwendet. Alle meine KI-Architekturen beinhalten Datenresidenz-Kontrollen, Consent-Management und Audit-Trails. Ich entwerfe für DSGVO-Konformität von Anfang an — sie ist kein Nachgedanke.",
      },
      {
        question: "Wie sieht ein Fractional-CTO-Engagement aus?",
        answer:
          "Ein Fractional-CTO-Engagement beginnt typischerweise mit einem Technologie-Audit und einer Strategie-Session. Danach arbeite ich fortlaufend mit Ihnen zusammen — meist einige Tage pro Monat — zu Architekturentscheidungen, Team-Mentoring, Vendor-Evaluation und Roadmap-Planung. Sie erhalten C-Level-Expertise ohne Vollzeit-Gehalt.",
      },
      {
        question: "Wie viel kann Serverless im Vergleich zu traditioneller Infrastruktur sparen?",
        answer:
          "Die meisten Kunden sehen 40-70% Kostenreduktion nach der Migration auf Serverless. Die Einsparungen kommen durch den Wegfall von Leerlauf-Compute-Kosten, reduzierten Betriebsaufwand und Bezahlung nur für die tatsächliche Nutzung. Ich erstelle vor jeder Migration eine detaillierte Kostenanalyse, um Ihr spezifisches Einsparpotenzial zu quantifizieren.",
      },
      {
        question: "Arbeiten Sie mit internationalen Kunden?",
        answer:
          "Ja. Ich arbeite mit Kunden in ganz Europa und darüber hinaus, mit Erfahrung in grenzüberschreitender Daten-Compliance und Multi-Region-AWS-Deployments. Meine DSGVO-Expertise ist besonders wertvoll für Unternehmen, die in der EU tätig sind oder dorthin verkaufen.",
      },
      {
        question: "Wie sieht der typische Zeitrahmen eines Engagements aus?",
        answer:
          "Das hängt vom Umfang ab. Ein Serverless-Architektur-Review dauert 1-2 Wochen. Ein KI-Agenten-MVP typischerweise 4-8 Wochen. Eine vollständige Cloud-Migration kann 2-6 Monate umfassen. Im kostenlosen Erstgespräch erstelle ich einen Zeitplan, der auf Ihre spezifischen Bedürfnisse und Prioritäten zugeschnitten ist.",
      },
    ],

    statsBanner: {
      description: "Code-Änderungen meiner KI-Coding-Agenten",
      last24h: "Letzte 24h",
      last7d: "Letzte 7d",
      learnMore: "Mehr über Agentic Coding",
      commits: "Commits",
      lines: "Zeilen",
      collapseLabel: "Statistik-Karte einklappen",
      expandLabel: "Agentic-Coding-Statistiken anzeigen",
    },

    pages: {
      home: {
        chip: "KI-Agenten · Serverless · Cloud-Architektur",
        headline: { before: "KI-Agenten schreiben den Code. Ich sorge dafür, dass es der ", gradient: "richtige", after: " ist." },
        ctaPrimary: "Kostenlose Beratung buchen",
        ctaSecondary: "Was ich mache",

        servicesSection: {
          chip: "Leistungen",
          headline: { before: "Was ich ", gradient: "mache", after: " — und was bewusst nicht." },
          description:
            "Vier fokussierte Leistungen: Serverless-Architektur, KI-Agenten, Technologieführung und Cloud-Kosten. Für alles andere empfehle ich Ihnen jemanden, der es besser kann.",
          linkText: "Mehr erfahren",
        },

        appsSection: {
          chip: "Produkte",
          headline: { before: "Produkte, die ich ", gradient: "gebaut", after: " habe" },
          description:
            "Fokussierte Tools und Anwendungen, die echte Probleme mit klarem Design und durchdachtem Engineering lösen.",
          linkText: "Alle Apps ansehen",
          linkUrl: "https://apps.creative-it.com",
        },

        philosophySection: {
          chip: "Philosophie",
          headline: { before: "Der Mensch hinter ", gradient: "creative-it", after: "." },
          linkText: "Meine Geschichte lesen",
        },

        cta: {
          headline: "Sie reden mit dem,\nder die Arbeit macht.",
          description:
            "Erzählen Sie mir, was Sie bauen. Ich lese jede Nachricht selbst und antworte meist noch am selben Tag.",
          button: "Beratungsgespräch vereinbaren",
        },
      },

      about: {
        meta: {
          title: "Über uns",
          description: "AWS Serverless & Agentic AI Architekt — 30+ Jahre Erfahrung, spezialisierte Expertise",
        },
        hero: {
          chip: "Über uns",
          headline: { before: "AWS Serverless & ", gradient: "Agentic AI", after: " Architekt" },
        },
        storySection: {
          chip: "Meine Geschichte",
          headline: "Die Domain seit 1997. Das Handwerk seit 1991.",
        },
        valuesSection: {
          chip: "Werte",
          headline: { before: "Drei Worte, nach denen ich ", gradient: "arbeite", after: "." },
        },
        whySection: {
          chip: "Warum creative-it",
        },
        cta: {
          headline: "Schreiben Sie mir. Ich lese jede Nachricht selbst.",
          description:
            "Kein Vertriebsteam, keine Account-Manager — Ihre Nachricht landet direkt bei mir, und ich antworte meist noch am selben Tag.",
          button: "Kontakt aufnehmen",
        },
      },

      services: {
        meta: {
          title: "Dienstleistungen",
          description: "AWS Serverless Architektur, Agentic AI, Fractional CTO & Cloud-Kostenoptimierung",
        },
        hero: {
          chip: "Leistungen",
          headline: { before: "Vier Dinge, die ich ", gradient: "gut", after: " kann." },
          description:
            "Serverless-Architektur, KI-Agenten, Fractional-CTO-Arbeit und Cloud-Kostenoptimierung. Liegt Ihr Problem außerhalb dieser vier, sage ich es Ihnen — und empfehle jemanden, der es besser kann.",
        },
        serviceButton: "Projekt besprechen",
        processSection: {
          chip: "Prozess",
          headline: "So arbeite ich",
          description: "Vier Schritte, kein Theater: verstehen, entwerfen, bauen, liefern.",
        },
        cta: {
          headline: "Erzählen Sie mir von Ihrem Projekt.",
          description:
            "Ein kurzes Gespräch genügt, um herauszufinden, ob ich der Richtige dafür bin. Wenn nicht, sage ich es Ihnen.",
          button: "Projekt starten",
        },
      },

      agenticCoding: {
        meta: {
          title: "Agentic Coding",
          description: "Wie creative-it KI-Coding-Agenten nutzt, um schneller zu liefern — mit höherer Qualität und beispiellosen Produktivitätssteigerungen.",
        },
        hero: {
          chip: "Agentic Coding",
          headline: { before: "Diese Seite zeigt, was KI-Agenten ", gradient: "wirklich", after: " liefern." },
          description:
            "Ich arbeite mit KI-Coding-Agenten, die rund um die Uhr Produktionscode schreiben, reviewen und ausliefern. Die Zahlen unten kommen live aus meiner GitHub-Organisation — nicht von einer Folie.",
        },
        whatSection: {
          chip: "Was ist das",
          headline: "KI-Agenten, die echten Code schreiben",
          description:
            "Agentic Coding geht über Autocomplete hinaus. Autonome KI-Agenten verstehen Ihre Codebasis, planen Implementierungen, schreiben Tests und erstellen Pull Requests — genau wie ein menschlicher Entwickler. Sie übernehmen die Routinearbeit, damit ich mich auf Architektur, Design und die wirklich wichtigen Probleme konzentrieren kann.",
          points: [
            { title: "Autonome Ausführung", description: "Agenten planen, implementieren und verifizieren eigenständig dateiübergreifende Änderungen in ganzen Repositories." },
            { title: "Kontextbewusst", description: "Sie verstehen Ihre Projektstruktur, Coding-Konventionen und Geschäftslogik — nicht nur Syntax." },
            { title: "Mensch im Loop", description: "Jede Änderung prüfe ich selbst, bevor sie gemergt wird. Agenten beschleunigen die Auslieferung; ein Mensch sichert die Qualität." },
          ],
        },
        howSection: {
          chip: "Unser Ansatz",
          headline: "Wie creative-it Agentic Coding einsetzt",
          description:
            "Ich integriere KI-Agenten direkt in meinen Entwicklungsworkflow. Sie sind kein Gimmick — sie sind Teammitglieder mit zugewiesenen Aufgaben, Code-Review-Standards und Verantwortlichkeit.",
          steps: [
            { step: "01", title: "Aufgabenzuweisung", description: "Agenten erhalten klar definierte Aufgaben aus meinem Projektmanagement-System, genau wie jeder Entwickler." },
            { step: "02", title: "Implementierung", description: "Agenten schreiben Code, erstellen Tests und öffnen Pull Requests mit vollständigem Kontext und Dokumentation." },
            { step: "03", title: "Review & Merge", description: "Ich prüfe jeden PR auf Qualität, Sicherheit und Übereinstimmung mit den Projektzielen." },
            { step: "04", title: "Kontinuierliches Lernen", description: "Agenten verbessern sich mit der Zeit, indem sie Projektkonventionen und Feedback-Muster aufnehmen." },
          ],
        },
        benefitsSection: {
          chip: "Produktivitätsgewinne",
          headline: { before: "Echte Zahlen, keine ", gradient: "Schätzungen", after: "." },
          description:
            "Die Zahlen aus meiner Live-GitHub-Aktivität erzählen die Geschichte. Agentic Coding ist nicht theoretisch — es liefert jeden Tag Produktionscode.",
          benefits: [
            { value: "5–10x", label: "Schnellere Feature-Auslieferung", description: "Was früher eine Woche dauerte, wird an einem Tag ausgeliefert. Agenten übernehmen Boilerplate, Tests und repetitive Refactorings in Maschinengeschwindigkeit." },
            { value: "24/7", label: "Entwicklungsgeschwindigkeit", description: "Agenten schlafen nicht. Sie verarbeiten Aufgaben über Nacht, sodass Ingenieure am Morgen fertige Pull Requests vorfinden." },
            { value: "Höhere", label: "Codequalität", description: "Jede Änderung kommt mit Tests und Dokumentation — und geht trotzdem durch ein menschliches Review vor dem Merge." },
            { value: "Mehr", label: "Fokus für Ingenieure", description: "Da Routinearbeit erledigt wird, verbringen Ingenieure ihre Zeit mit Architektur, User Experience und kreativem Problemlösen." },
          ],
        },
        statsSection: {
          commits24h: "Commits (24h)",
          linesChanged24h: "Geänderte Zeilen (24h)",
          commits7d: "Commits (7d)",
          linesChanged7d: "Geänderte Zeilen (7d)",
          liveDataNote: "Live-Daten aus meiner GitHub-Organisation — in Echtzeit aktualisiert",
          chartTitle: "7-Tage-Aktivität",
          legendCommits: "Commits",
          legendLines: "Geänderte Zeilen",
          howItWorksLink: "So funktioniert's",
        },
        storySection: {
          chip: "KI-Erzählung",
          headline: "Was die Agenten heute gebaut haben",
          description: "Diese Geschichte wird live von KI basierend auf meiner tatsächlichen GitHub-Aktivität generiert — jedes Mal eine andere Erzählung.",
          refreshButton: "Neue Geschichte",
          loadingText: "KI schreibt die heutige Geschichte...",
          fallback: "Die Agenten waren fleißig beim Code-Ausliefern. Die Zahlen stehen oben.",
        },
        cta: {
          headline: "Bereit, schneller zu liefern?",
          description:
            "Bringen Sie die Kraft von Agentic Coding in Ihr nächstes Projekt. Lassen Sie uns darüber sprechen, wie KI-unterstützte Entwicklung Ihre Roadmap beschleunigen kann.",
          button: "Gespräch starten",
        },
      },

      aiPlayground: {
        meta: {
          title: "AI Playground",
          description: "Beschreiben Sie eine UI-Komponente in einfachem Deutsch und sehen Sie zu, wie KI sie live erstellt — powered by creative-it",
        },
        hero: {
          chip: "AI Playground",
          headline: { before: "Beschreiben. ", gradient: "Zusehen. Fertig.", after: "" },
          description:
            "Geben Sie eine Beschreibung einer beliebigen UI-Komponente ein und sehen Sie zu, wie KI sie in Echtzeit generiert. Powered by Claude und AWS Bedrock.",
        },
        inputSection: {
          promptLabel: "Beschreiben Sie Ihre Komponente",
          promptPlaceholder: "Eine Preiskarte mit drei Stufen: Starter, Pro und Enterprise...",
          generateButton: "Generieren",
          generatingButton: "Wird generiert...",
          charLimit: 2000,
        },
        examples: [
          "Ein Hero-Bereich mit Gradient-Überschrift, Untertitel und zwei CTA-Buttons",
          "Eine Preistabelle mit drei Stufen: Free, Pro und Enterprise",
          "Ein Dashboard-Statistikraster mit 4 Metrikkarten mit Icons und Trends",
          "Eine Produktkarte mit Bild-Platzhalter, Titel, Preis und Warenkorb-Button",
          "Ein Login-Formular mit E-Mail, Passwort, Social-Sign-in und Angemeldet-bleiben",
          "Eine Datentabelle mit sortierbaren Spalten, gestreiften Zeilen und Paginierung",
          "Eine Testimonial-Karussell-Karte mit Avatar, Zitat, Name und Rolle",
        ],
        previewSection: {
          previewTab: "Vorschau",
          codeTab: "Code",
          copyButton: "Code kopieren",
          copiedButton: "Kopiert!",
          clearButton: "Leeren",
          emptyState: "Ihre generierte Komponente erscheint hier",
          desktopLabel: "Desktop",
          tabletLabel: "Tablet",
          mobileLabel: "Mobil",
        },
        conversation: {
          newComponentButton: "Neue Komponente",
          refiningLabel: "Verfeinern",
          refiningPlaceholder: "Beschreiben Sie, was geändert oder verfeinert werden soll...",
        },
        cta: {
          headline: "Möchten Sie individuelle KI-Lösungen?",
          description:
            "Das ist nur ein Vorgeschmack auf das, was KI kann. Lassen Sie uns intelligente Features bauen, die auf Ihr Produkt zugeschnitten sind.",
          button: "Gespräch starten",
        },
      },

      techAdvisor: {
        meta: {
          title: "Tech-Berater",
          description: "Beschreiben Sie Ihr Projekt und erhalten Sie KI-gestützte Architekturempfehlungen mit Begründung",
        },
        hero: {
          chip: "KI Tech-Berater",
          headline: { before: "Projekt beschreiben. ", gradient: "Stack erhalten.", after: "" },
          description:
            "Beschreiben Sie Ihre Projektanforderungen und die KI empfiehlt einen kompletten Tech-Stack mit Architekturdiagrammen und Begründung.",
        },
        inputSection: {
          promptLabel: "Beschreiben Sie Ihr Projekt",
          promptPlaceholder: "Wir brauchen ein Echtzeit-Dashboard zur Überwachung von IoT-Sensordaten von 500 Geräten...",
          generateButton: "Analysieren",
          generatingButton: "Wird analysiert...",
          charLimit: 2000,
        },
        examples: [
          "E-Commerce-Plattform für 10.000 tägliche Nutzer mit Zahlungen und Lagerverwaltung",
          "Echtzeit-Dashboard für IoT-Sensordaten von 500 Geräten",
          "Mobile App mit Offline-Synchronisation und Push-Benachrichtigungen",
          "KI-gestützter Dokumentenverarbeiter mit OCR und Klassifizierung",
        ],
        previewSection: {
          resultsTab: "Empfehlungen",
          diagramTab: "Architektur",
          emptyState: "Beschreiben Sie Ihr Projekt, um KI-gestützte Architekturempfehlungen zu erhalten",
        },
        conversation: {
          newAnalysisButton: "Neue Analyse",
          refiningLabel: "Rückfrage",
          refiningPlaceholder: "Stellen Sie eine Rückfrage zu den Empfehlungen...",
        },
        cta: {
          headline: "Soll ich das bauen?",
          description:
            "Ich kann diese Empfehlungen in die Realität umsetzen. Lassen Sie uns Ihr Projekt besprechen.",
          button: "Gespräch starten",
        },
      },

      aiAgents: {
        meta: {
          title: "KI-Agenten",
          description: "Sehen Sie zu, wie KI-Agenten echte Aufgaben Schritt für Schritt lösen — mit Live-Visualisierung",
        },
        hero: {
          chip: "KI-Agenten",
          headline: { before: "Sehen Sie KI ", gradient: "denken.", after: "" },
          description:
            "Erleben Sie, wie KI-Agenten komplexe Probleme aufschlüsseln, Lösungen planen und Aufgaben Schritt für Schritt ausführen — angetrieben von echten Bedrock-Aufrufen.",
        },
        scenarios: [
          { id: "code-review", title: "Code-Review", description: "Agent prüft Code auf Fehler und Verbesserungen", icon: "code" },
          { id: "data-analysis", title: "Datenanalyse", description: "Agent analysiert Daten und extrahiert Erkenntnisse", icon: "chart" },
          { id: "deployment", title: "Deployment-Pipeline", description: "Agent plant und führt ein Deployment durch", icon: "rocket" },
          { id: "bug-fix", title: "Bug-Untersuchung", description: "Agent untersucht und behebt einen Fehler", icon: "bug" },
        ],
        runButton: "Szenario starten",
        runAgainButton: "Erneut starten",
        steps: { think: "Denkt", plan: "Plant", execute: "Führt aus", verify: "Verifiziert", result: "Ergebnis" },
        cta: {
          headline: "KI-Agenten für Ihr Projekt",
          description:
            "Ich baue intelligente Agenten, die auf Ihre Workflows und Geschäftsprozesse zugeschnitten sind.",
          button: "Gespräch starten",
        },
      },

      howItWorks: {
        meta: {
          title: "So funktioniert's",
          description: "Hinter den Kulissen der KI-Features von creative-it — Architektur, AWS-Services und technische Abläufe",
        },
        hero: {
          chip: "Hinter den Kulissen",
          headline: { before: "Wie die KI dieser Website ", gradient: "wirklich", after: " funktioniert" },
          description:
            "Jedes KI-Feature auf dieser Website wird von echter AWS-Infrastruktur angetrieben. Erkunden Sie die Architektur, Services und technischen Abläufe hinter jedem einzelnen.",
        },
        features: [
          {
            id: "ai-playground",
            title: "AI Playground",
            subtitle: "Beschreiben. Zusehen. Fertig.",
            icon: "lightning",
            link: "/de/ai-playground",
            whatItDoes:
              "Geben Sie eine Beschreibung einer beliebigen UI-Komponente ein und sehen Sie zu, wie KI produktionsreifes HTML + Tailwind CSS in Echtzeit generiert. Unterstützt mehrstufige Konversationen zum Verfeinern und Iterieren Ihrer Komponente.",
            howItWorks:
              "Ihr Prompt wird an einen API-Gateway-Endpunkt gesendet, der von einer Lambda-Funktion unterstützt wird. Das Lambda ruft Amazon Bedrock mit Claude auf und streamt Tokens über eine Chunked-HTTP-Response zurück. Das Frontend rendert jeden Chunk in Echtzeit in ein Live-Preview-Iframe.",
            techFlow: [
              "Benutzer gibt eine Komponentenbeschreibung im Browser ein",
              "Anfrage trifft auf API Gateway mit Rate Limiting (10/Tag pro IP)",
              "Lambda erstellt einen System-Prompt, optimiert für HTML/Tailwind-Generierung",
              "Amazon Bedrock streamt Claudes Antwort Token für Token",
              "Frontend rendert jeden Chunk in ein Sandbox-Iframe in Echtzeit",
              "Konversationsverlauf wird client-seitig für mehrstufige Verfeinerung gespeichert",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "LLM-Inferenz mit Claude" },
              { name: "AWS Lambda", role: "Serverloser Anfragen-Handler" },
              { name: "API Gateway", role: "REST-Endpunkt mit Throttling" },
              { name: "CloudWatch", role: "Logging und Monitoring" },
            ],
          },
          {
            id: "tech-advisor",
            title: "Tech-Stack-Berater",
            subtitle: "Projekt beschreiben. Stack erhalten.",
            icon: "beaker",
            link: "/de/tech-advisor",
            whatItDoes:
              "Beschreiben Sie Ihre Projektanforderungen und erhalten Sie KI-gestützte Architekturempfehlungen mit komplettem Tech-Stack, Begründung und einem Mermaid-Architekturdiagramm. Stellen Sie Rückfragen, um die Empfehlungen zu verfeinern.",
            howItWorks:
              "Die Lambda-Funktion sendet Ihre Projektbeschreibung über Bedrock an Claude mit einem spezialisierten System-Prompt, der das Modell anweist, Anforderungen zu analysieren, Technologien zu empfehlen und ein Mermaid-Diagramm zu generieren. Antworten werden mit einem speziellen Marker-Format für den Diagramm-Abschnitt zurückgestreamt.",
            techFlow: [
              "Benutzer beschreibt seine Projektanforderungen",
              "Lambda sendet den Prompt mit architektur-fokussierten System-Instruktionen an Bedrock",
              "Claude analysiert Anforderungen und generiert strukturierte Empfehlungen",
              "Antwort enthält ein Mermaid-Diagramm zwischen ---DIAGRAM--- Markern",
              "Frontend rendert Markdown-Empfehlungen und lädt Mermaid.js für das Diagramm",
              "Rückfragen behalten den Konversationskontext für tiefere Analyse bei",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "Architekturanalyse mit Claude" },
              { name: "AWS Lambda", role: "Prompt-Orchestrierung" },
              { name: "API Gateway", role: "REST-Endpunkt mit Rate Limiting" },
              { name: "CloudWatch", role: "Anfragen-Logging" },
            ],
          },
          {
            id: "ai-agents",
            title: "KI-Agenten-Visualisierer",
            subtitle: "KI beim Denken zusehen — Schritt für Schritt.",
            icon: "robot",
            link: "/de/ai-agents",
            whatItDoes:
              "Wählen Sie ein Szenario (Code-Review, Datenanalyse, Deployment, Bug-Fix) und beobachten Sie, wie ein KI-Agent das Problem aufschlüsselt, eine Lösung plant, Schritte ausführt und Ergebnisse verifiziert — alles live gestreamt in eine Terminal-ähnliche Oberfläche.",
            howItWorks:
              "Das Lambda empfängt eine Szenario-ID, konstruiert eine mehrstufige Prompt-Kette und ruft Bedrock für jede Agentenphase auf (Denken → Planen → Ausführen → Verifizieren → Ergebnis). Die Ausgabe jeder Phase wird als Newline-delimited JSON gestreamt, wobei das Frontend die Pipeline-Visualisierung in Echtzeit aktualisiert.",
            techFlow: [
              "Benutzer wählt ein vordefiniertes Szenario (z.B. 'Code-Review')",
              "Lambda empfängt das Szenario und initiiert eine mehrphasige Prompt-Kette",
              "Jede Phase (Denken, Planen, Ausführen, Verifizieren, Ergebnis) ruft Bedrock unabhängig auf",
              "Antworten werden als NDJSON mit Schritt-Metadaten gestreamt",
              "Frontend hebt den aktiven Pipeline-Schritt hervor und fügt Terminal-Ausgabe an",
              "Rate Limiting verfolgt die tägliche Nutzung pro IP",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "Mehrstufiges Agenten-Reasoning" },
              { name: "AWS Lambda", role: "Agenten-Orchestrierung" },
              { name: "API Gateway", role: "Streaming-Endpunkt" },
              { name: "CloudWatch", role: "Schritt-Level-Tracing" },
            ],
          },
          {
            id: "chat-widget",
            title: "KI-Chat-Assistent",
            subtitle: "Fragen Sie alles über creative-it.",
            icon: "chat",
            link: null,
            whatItDoes:
              "Ein schwebendes Chat-Widget, das Fragen zu den Dienstleistungen, Prozessen, dem Team und den Fähigkeiten von creative-it beantwortet. Hält den Session-Kontext für natürliche Folgekonversationen mit Streaming-Antworten aufrecht.",
            howItWorks:
              "Das Lambda nutzt eine Bedrock Knowledge Base, die von einem S3-Bucket mit kuratierten Unternehmensdokumenten unterstützt wird. Wenn ein Benutzer eine Frage stellt, wird RAG (Retrieval-Augmented Generation) durchgeführt — relevante Chunks aus der Wissensbasis abgerufen und dann mit Claude eine fundierte Antwort generiert. Session-IDs ermöglichen mehrstufige Konversationen.",
            techFlow: [
              "Benutzer tippt eine Frage in das schwebende Chat-Widget",
              "Anfrage enthält eine Session-ID für Konversationskontinuität",
              "Lambda fragt die Bedrock Knowledge Base nach relevanten Dokumenten-Chunks ab",
              "Abgerufener Kontext wird in Claudes Prompt injiziert (RAG-Muster)",
              "Claude generiert eine fundierte Antwort, die zum Widget zurückgestreamt wird",
              "Session-Status bleibt über Nachrichten hinweg für Rückfragen erhalten",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "LLM-Inferenz + Knowledge Bases" },
              { name: "Amazon S3", role: "Dokumentenspeicher für RAG" },
              { name: "AWS Lambda", role: "Abfrage-Orchestrierung" },
              { name: "API Gateway", role: "Chat-Endpunkt mit Session-Tracking" },
            ],
          },
          {
            id: "website-remix",
            title: "Website Remix",
            subtitle: "Diese Website mit KI neu gestalten.",
            icon: "paintbrush",
            link: null,
            whatItDoes:
              "Geben Sie ein visuelles Thema ein (z.B. 'Retro 80er Neon' oder 'minimalistisches Monochrom') und KI generiert individuelles CSS, das das gesamte Erscheinungsbild der Website in Echtzeit transformiert. Jederzeit zurücksetzen auf das Original.",
            howItWorks:
              "Das Lambda sendet Ihre Themenbeschreibung an Claude mit einem System-Prompt, der die CSS Custom Properties und die Design-Token-Struktur der Website enthält. Claude generiert überschreibendes CSS, das die bestehenden Theme-Variablen anspricht. Das Frontend injiziert das CSS als <style>-Tag und stylt die Seite sofort um.",
            techFlow: [
              "Benutzer gibt eine Themenbeschreibung ein (z.B. 'warme Erdtöne')",
              "Lambda sendet den Prompt mit dem CSS-Variablen-Schema der Website",
              "Claude generiert CSS-Überschreibungen für die Theme Custom Properties",
              "Antwort wird mit CSS zwischen ---CSS--- Markern gestreamt",
              "Frontend extrahiert das CSS und injiziert es als <style>-Element",
              "Ein Banner erscheint mit einem Reset-Button zur Wiederherstellung des Original-Themes",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "CSS-Generierung mit Claude" },
              { name: "AWS Lambda", role: "Theme-Prompt-Handler" },
              { name: "API Gateway", role: "Remix-Endpunkt" },
            ],
          },
          {
            id: "live-translation",
            title: "Live-Übersetzung",
            subtitle: "Diese Website in 25+ Sprachen lesen.",
            icon: "globe",
            link: null,
            whatItDoes:
              "Klicken Sie auf eine Sprachflagge und die gesamte Seite wird vor Ort übersetzt — Überschriften, Absätze, Buttons und alles andere. Übersetzungen sind kontextbewusst und behalten die Formatierung bei. Jederzeit auf Englisch zurücksetzen.",
            howItWorks:
              "Das Frontend sammelt alle übersetzbaren Textknoten aus dem DOM, bündelt sie (50 pro Anfrage) und sendet sie an ein Lambda, das Claude mit übersetzungsspezifischen Prompts aufruft. Claude gibt ein JSON-Array übersetzter Strings zurück, das das Frontend auf die entsprechenden DOM-Elemente anwendet.",
            techFlow: [
              "Benutzer klickt eine Sprachflagge (z.B. Deutsch, Japanisch)",
              "Frontend durchläuft das DOM und sammelt Text aus übersetzbaren Elementen",
              "Originaltext wird in einer Map für späteres Zurücksetzen gespeichert",
              "Texte werden gebündelt (50 pro Anfrage) und an das Übersetzungs-Lambda gesendet",
              "Claude übersetzt den Batch unter Beibehaltung von Formatierung und Kontext",
              "Übersetzte Strings werden auf DOM-Elemente angewendet; ein Banner zeigt die aktive Sprache an",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "Kontextbewusste Übersetzung mit Claude" },
              { name: "AWS Lambda", role: "Batch-Übersetzungs-Handler" },
              { name: "API Gateway", role: "Übersetzungs-Endpunkt" },
            ],
          },
          {
            id: "agentic-coding",
            title: "Agentic Coding Stats",
            subtitle: "Live-GitHub-Aktivität von KI-Agenten.",
            icon: "code",
            link: "/de/agentic-coding",
            whatItDoes:
              "Zeigt Echtzeit-GitHub-Statistiken — Commits, geänderte Zeilen und ein 7-Tage-Aktivitätsdiagramm — aus den Repositories meiner Organisation. Eine KI-generierte Erzählung fasst die Entwicklungsaktivität des Tages zusammen.",
            howItWorks:
              "Zwei Lambda-Funktionen treiben dieses Feature an. Das Stats-Lambda fragt die GitHub-API nach Commit- und Diff-Daten über alle Org-Repos ab und cached die Ergebnisse in DynamoDB mit TTL. Das Story-Lambda nimmt die Statistiken und sendet sie an Claude, der eine kreative Erzählung über die Coding-Aktivität des Tages generiert.",
            techFlow: [
              "Seite wird geladen und ruft /github-stats von der API ab",
              "Stats-Lambda prüft den DynamoDB-Cache (5-Minuten-TTL)",
              "Bei Cache-Miss fragt Lambda die GitHub-API nach organisationsweiten Commit-Daten ab",
              "Statistiken werden aggregiert (24h, 7d) und Verlaufspunkte gespeichert",
              "Frontend rendert Stats-Karten und zeichnet ein Canvas-basiertes Aktivitätsdiagramm",
              "Story-Lambda sendet Statistiken an Claude für eine narrative Zusammenfassung",
            ],
            awsServices: [
              { name: "Amazon Bedrock", role: "KI-Story-Generierung mit Claude" },
              { name: "Amazon DynamoDB", role: "Stats-Caching mit TTL" },
              { name: "AWS Lambda", role: "GitHub-API-Integration + Story-Generierung" },
              { name: "API Gateway", role: "Stats- und Story-Endpunkte" },
            ],
          },
        ],
        architectureSection: {
          chip: "Architektur",
          headline: { before: "Der komplette ", gradient: "Stack", after: "" },
          description:
            "Alle KI-Features laufen auf einer serverlosen AWS-Architektur. Hier sind alle beteiligten Services, gruppiert nach Schicht.",
          categories: [
            {
              title: "KI / ML Schicht",
              services: [
                { name: "Amazon Bedrock", description: "Managed LLM-Inferenz mit Claude — treibt alle KI-Features an" },
                { name: "Bedrock Knowledge Bases", description: "RAG-Pipeline für die Dokumentenabfrage des Chat-Assistenten" },
              ],
            },
            {
              title: "Compute-Schicht",
              services: [
                { name: "AWS Lambda", description: "Serverlose Funktionen für jeden API-Endpunkt — null Leerlaufkosten" },
                { name: "API Gateway", description: "REST-APIs mit Throttling, CORS und benutzerdefiniertem Domain-Mapping" },
              ],
            },
            {
              title: "Datenschicht",
              services: [
                { name: "Amazon DynamoDB", description: "Low-Latency-Caching für GitHub-Statistiken und Rate Limiting" },
                { name: "Amazon S3", description: "Dokumentenspeicher für die Wissensbasis und statische Assets" },
              ],
            },
            {
              title: "Netzwerk & Orchestrierung",
              services: [
                { name: "Amazon CloudFront", description: "CDN für die statische Astro-Site und Asset-Auslieferung" },
                { name: "AWS CDK", description: "Infrastructure as Code — der gesamte Stack in TypeScript definiert" },
                { name: "Amazon CloudWatch", description: "Zentrales Logging, Metriken und Alerting über alle Lambdas" },
                { name: "AWS IAM", description: "Feingranulare Berechtigungen zwischen Services" },
              ],
            },
          ],
        },
        cta: {
          headline: "Wollen Sie das für Ihr Produkt?",
          description:
            "Jedes Feature auf dieser Website wird mit den gleichen Tools und Mustern gebaut, die ich auch für Kundenprojekte verwende. Lassen Sie uns gemeinsam etwas Intelligentes bauen.",
          button: "Gespräch starten",
        },
      },

      blog: {
        meta: {
          title: "Blog",
          description: "Artikel über Softwareentwicklung, KI, Cloud-Architektur und Technologie-Einblicke von creative-it",
        },
        hero: {
          chip: "Blog",
          headline: { before: "Einblicke & ", gradient: "Artikel", after: "" },
          description:
            "Gedanken zu Softwareentwicklung, KI, Cloud-Architektur und der Zukunft der Technologie.",
        },
        minRead: "Min. Lesezeit",
        cta: {
          headline: "Haben Sie ein Projekt im Sinn?",
          description:
            "Wenn eines dieser Themen für Ihr Unternehmen relevant ist, schreiben Sie mir.",
          button: "Kontakt aufnehmen",
        },
      },

      contact: {
        meta: {
          title: "Kontakt",
          description: "Buchen Sie eine kostenlose Beratung für AWS Serverless, Agentic AI oder Fractional-CTO-Services",
        },
        hero: {
          chip: "Kontakt",
          headline: { before: "Schreiben Sie mir. Ich antworte ", gradient: "selbst", after: "." },
          description:
            "Ob Serverless-Architektur, KI-Agenten oder Technologieführung: Erzählen Sie mir, wo Sie stehen. Ich antworte meist noch am selben Tag.",
        },
        infoHeadline: "Kontakt aufnehmen",
        socialLabel: "Folgen Sie uns",
        form: {
          headline: "Nachricht senden",
          description: "Oder nutzen Sie das Formular — es landet im selben Postfach.",
          nameLabel: "Name",
          namePlaceholder: "Ihr Name",
          emailLabel: "E-Mail",
          emailPlaceholder: "ihre@email.com",
          companyLabel: "Unternehmen",
          companyOptional: "(optional)",
          companyPlaceholder: "Ihr Unternehmen",
          subjectLabel: "Betreff",
          subjectPlaceholder: "Thema auswählen",
          subjectOptions: [
            { value: "serverless", label: "Serverless-Architektur" },
            { value: "ai", label: "KI & Agentic Consulting" },
            { value: "cto", label: "Fractional-CTO-Anfrage" },
            { value: "optimization", label: "Cloud-Kostenoptimierung" },
            { value: "other", label: "Sonstiges" },
          ],
          messageLabel: "Nachricht",
          messagePlaceholder: "Erzählen Sie mir von Ihrem Projekt oder Ihrer Anfrage...",
          submitButton: "Nachricht senden",
          successMessage: "Vielen Dank! Ihre Nachricht ist in meinem Postfach — ich melde mich in Kürze.",
        },
        faqSection: {
          chip: "FAQ",
          headline: "Häufige Fragen",
        },
      },
    },

    chatWidget: {
      buttonLabel: "KI fragen",
      headline: "creative-it KI fragen",
      placeholder: "Fragen Sie nach Leistungen, Prozess oder Verfügbarkeit...",
      talkToHuman: "Mit einem Menschen sprechen",
      poweredBy: "Powered by AWS Bedrock",
    },

    translation: {
      buttonLabel: "Übersetzen",
      headline: "Live-Übersetzung",
      poweredBy: "Powered by AWS Bedrock",
      translating: "Wird übersetzt...",
      resetButton: "Original",
    },

    remix: {
      buttonLabel: "Remix",
      headline: "Website umgestalten",
      placeholder: "Wie soll es aussehen? (z.B. elegantes Dark Mode)",
      remixButton: "Remix",
      resetButton: "Auf Original zurücksetzen",
      examples: ["Elegantes Dark Mode", "Warmes Terrakotta & Sand", "Kühles Skandinavisch-Blau", "70er-Jahre-Magazin"],
    },
  },
};

// ── t() helper ─────────────────────────────────────────────────────────────

export function t(locale: Locale = 'en') {
  return { ...shared, ...content[locale] };
}

// ── Backward compatibility ─────────────────────────────────────────────────

export const siteConfig = t('en');
