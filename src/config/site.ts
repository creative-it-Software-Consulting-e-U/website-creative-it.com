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
};

// ── Locale-specific content ────────────────────────────────────────────────

const content = {
  en: {
    tagline: "Build. Grow. Matter.",
    description:
      "We build software, AI agents, teams, processes, and trust. Growth emerges — and with it, lasting impact.",

    navigation: [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: "About", href: "/about" },
      { name: "AI Playground", href: "/ai-playground" },
      { name: "Tech Advisor", href: "/tech-advisor" },
      { name: "AI Agents", href: "/ai-agents" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],

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
      },
    ],

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

    pages: {
      home: {
        chip: "AI · Software · Teams · Trust",
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
            "Let's discuss how we can bring these ideas to life for your business.",
          button: "Get in Touch",
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

    chatWidget: {
      buttonLabel: "Ask AI",
      headline: "Ask creative-it AI",
      placeholder: "Ask about our services, process, or team...",
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
      placeholder: "How should it look? (e.g., retro 80s neon)",
      remixButton: "Remix",
      resetButton: "Reset to Original",
      examples: ["Retro 80s neon", "Warm earthy tones", "Minimalist monochrome", "Cyberpunk"],
    },
  },

  // ════════════════════════════════════════════════════════════════════════════
  // GERMAN
  // ════════════════════════════════════════════════════════════════════════════

  de: {
    tagline: "Build. Grow. Matter.",
    description:
      "Wir entwickeln Software, KI-Agenten, Teams, Prozesse und Vertrauen. Daraus entsteht Wachstum — und nachhaltiger Mehrwert.",

    navigation: [
      { name: "Home", href: "/de" },
      { name: "Services", href: "/de/services" },
      { name: "Über uns", href: "/de/about" },
      { name: "AI Playground", href: "/de/ai-playground" },
      { name: "Tech-Berater", href: "/de/tech-advisor" },
      { name: "KI-Agenten", href: "/de/ai-agents" },
      { name: "Technologie", href: "/de/how-it-works" },
      { name: "Blog", href: "/de/blog" },
      { name: "Kontakt", href: "/de/contact" },
    ],

    services: [
      {
        title: "Agentic Coding",
        description:
          "Bringen Sie die Vorteile von Agentic Coding in Ihr Team. Steigern Sie die Produktivität massiv.",
        icon: "brain",
        features: [
          "Modellauswahl",
          "Workflows",
          "Team-Setup",
        ],
      },
      {
        title: "KI-basierte Anwendungen",
        description:
          "Maßgeschneiderte KI-Agenten und Modelle, die Ihr Produkt intelligenter machen.",
        icon: "robot",
        features: [
          "Agentenentwicklung",
          "Modelloptimierung",
          "DSGVO-Konformität",
        ],
      },
      {
        title: "App-Entwicklung",
        description: "Individuelle mobile Apps für Ihr Unternehmen. Wir entwickeln native Apps für iOS und Android.",
        icon: "mobile",
        features: [
          "iOS- & Android-Entwicklung",
          "Backend-Lösungen",
          "Natives App-Design, gleiche Funktionen",
        ],
      },
      {
        title: "Softwareentwicklung",
        description:
          "Maßgeschneiderte Lösungen mit Präzision und Ziel. Wir verwandeln komplexe Anforderungen in elegante, skalierbare Software.",
        icon: "code",
        features: [
          "Full-Stack-Entwicklung",
          "API-Design & Integration",
          "Serverless-Technologien",
        ],
      },
      {
        title: "Cloud-Architektur",
        description:
          "Sichere, skalierbare Infrastruktur für Wachstum. Wir entwerfen Cloud-Lösungen, die auch unter Druck performen.",
        icon: "cloud",
        features: [
          "Cloud-Migration",
          "Infrastructure as Code",
          "NoOps",
        ],
      },
      {
        title: "Technische Beratung",
        description:
          "Strategische Begleitung für Technologieentscheidungen, die zählen. Wir helfen Ihnen, Komplexität souverän zu meistern.",
        icon: "ruler",
        features: [
          "Architektur-Review",
          "Technologiestrategie",
          "Team-Erweiterung",
        ],
      },
    ],

    about: {
      mission:
        "Unternehmen durch Technologie stärken, die transformiert, Teams, die aufblühen, und Partnerschaften, die Bestand haben.",
      story:
        "Creative IT wurde auf einer einfachen Überzeugung gegründet: Technologie sollte Wachstum ermöglichen, nicht einschränken. Wir haben unser Unternehmen um die Philosophie Build. Grow. Matter. aufgebaut — Software entwickeln, Teams aufbauen, Vertrauen schaffen. Auf dieser Basis helfen wir unseren Kunden, ihre Fähigkeiten, ihre Reichweite und ihren Einfluss zu steigern. Denn letztlich glauben wir, dass das, was wir gemeinsam schaffen, zählen sollte — für Ihr Unternehmen, für Ihre Kunden und für die Zukunft, die Sie aufbauen.",
      values: [
        {
          title: "Build",
          description:
            "Wir bauen mit Absicht — Software, Teams, Prozesse und dauerhafte Beziehungen.",
        },
        {
          title: "Grow",
          description:
            "Wir fördern kontinuierliche Verbesserung für unsere Kunden, unser Team und uns selbst.",
        },
        {
          title: "Matter",
          description:
            "Wir liefern Arbeit, die echten Mehrwert und nachhaltigen Wandel schafft.",
        },
      ],
      stats: [
        { value: "150+", label: "Projekte geliefert" },
        { value: "30+", label: "Jahre Erfahrung" },
        { value: "100%", label: "Zufriedenheitsrate" },
        { value: "0%", label: "Mangel an Zuversicht" },
      ],
      whyChooseUs: {
        headline: "Partnerschaft, nicht nur Dienstleistung",
        description:
          "Wir liefern nicht nur Projekte — wir bauen Beziehungen auf. Wenn Sie mit creative-it arbeiten, gewinnen Sie einen Technologiepartner, der in Ihren langfristigen Erfolg investiert.",
        benefits: [
          {
            title: "Tiefgreifende Expertise",
            description:
              "Jahrzehntelange Erfahrung in verschiedensten Branchen und Technologien.",
          },
          {
            title: "Transparente Kommunikation",
            description:
              "Klarer, ehrlicher Dialog in jeder Phase der Zusammenarbeit.",
          },
          {
            title: "Langfristige Vision",
            description: "Lösungen, die mit Ihrem Unternehmen wachsen.",
          },
        ],
        highlights: [
          {
            title: "Schnell & effizient",
            description: "Agile Umsetzung ohne Kompromisse",
          },
          {
            title: "Erfahrenes Team",
            description: "Erfahrene Profis auf jeder Ebene",
          },
          {
            title: "Zuverlässiger Support",
            description: "Wir sind langfristig an Ihrer Seite",
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
          "Wir tauchen tief in Ihre Herausforderungen, Ziele und Vision ein, um das Gesamtbild zu verstehen.",
      },
      {
        step: "02",
        title: "Entwerfen",
        description:
          "Wir entwerfen Lösungen, die auf Ihre Ziele abgestimmt sind und mit Ihrem Wachstum skalieren.",
      },
      {
        step: "03",
        title: "Entwickeln",
        description:
          "Wir bauen mit Präzision und halten Sie bei jedem Schritt informiert und eingebunden.",
      },
      {
        step: "04",
        title: "Ausliefern",
        description:
          "Wir deployen, optimieren und unterstützen — für nachhaltigen Erfolg über den Launch hinaus.",
      },
    ],

    faq: [
      {
        question: "An welchen Arten von Projekten arbeiten Sie?",
        answer:
          "Wir arbeiten an einem breiten Spektrum von Technologieprojekten, darunter individuelle Softwareentwicklung, Cloud-Architektur, digitale Transformationsinitiativen und IT-Beratung. Von Startups bis zu Großunternehmen passen wir unseren Ansatz an Ihre spezifischen Bedürfnisse an.",
      },
      {
        question: "Wie handhaben Sie die Projektkommunikation?",
        answer:
          "Wir setzen auf transparente, konsistente Kommunikation. Sie erhalten einen festen Ansprechpartner, regelmäßige Statusupdates und Zugang zu Projektmanagement-Tools. Wir passen unseren Kommunikationsstil an das an, was für Ihr Team am besten funktioniert.",
      },
      {
        question: "Wie sieht Ihre typische Projektlaufzeit aus?",
        answer:
          "Die Laufzeiten variieren je nach Projektumfang und Komplexität. Während unseres ersten Beratungsgesprächs erstellen wir eine detaillierte Zeitplanung. Wir konzentrieren uns darauf, qualitativ hochwertige Arbeit effizient zu liefern und Sie über den Fortschritt auf dem Laufenden zu halten.",
      },
      {
        question: "Bieten Sie nach Projektabschluss laufenden Support an?",
        answer:
          "Selbstverständlich. Wir bieten verschiedene Support- und Wartungspakete an, damit Ihre Lösungen weiterhin optimal funktionieren. Wir setzen auf Ihren langfristigen Erfolg, nicht nur auf die Projektauslieferung.",
      },
    ],

    pages: {
      home: {
        chip: "KI · Software · Teams · Vertrauen",
        headline: { before: "Build. ", gradient: "Grow.", after: " Matter." },
        ctaPrimary: "Kostenlose Beratung",
        ctaSecondary: "Dienstleistungen entdecken",

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
          chip: "Was wir tun",
          headline: { before: "Technologielösungen, die ", gradient: "Wachstum antreiben", after: "" },
          description:
            "Von individueller Software bis zur Cloud-Architektur liefern wir Lösungen, die mit Ihren Ambitionen skalieren.",
          linkText: "Mehr erfahren",
        },

        appsSection: {
          chip: "Unsere Apps",
          headline: { before: "Produkte, die wir ", gradient: "entwickelt haben", after: "" },
          description:
            "Fokussierte Tools und Anwendungen, die echte Probleme mit klarem Design und durchdachtem Engineering lösen.",
          linkText: "Alle Apps ansehen",
          linkUrl: "https://apps.creative.it.com",
        },

        philosophySection: {
          chip: "Unsere Philosophie",
          headline: { before: "Drei Worte.", gradient: "Unendliche Möglichkeiten.", after: "" },
          linkText: "Über unsere Reise",
        },

        cta: {
          headline: "Bereit, etwas zu bauen,\ndas zählt?",
          description:
            "Lassen Sie uns besprechen, wie wir Ihnen helfen können, Ihre Technologieziele zu erreichen und nachhaltige Wirkung zu erzielen.",
          button: "Beratungsgespräch vereinbaren",
        },
      },

      about: {
        meta: {
          title: "Über uns",
          description: "Erfahren Sie mehr über creative-it und unsere Build. Grow. Matter. Philosophie",
        },
        hero: {
          chip: "Über uns",
          headline: { before: "Wir bauen mit ", gradient: "Absicht", after: "" },
        },
        storySection: {
          chip: "Unsere Geschichte",
          headline: "Die Philosophie hinter allem, was wir tun",
        },
        valuesSection: {
          chip: "Unsere Werte",
          headline: { before: "Build. ", gradient: "Grow.", after: " Matter." },
        },
        whySection: {
          chip: "Warum wir",
        },
        cta: {
          headline: "Gemeinsam bauen",
          description:
            "Bereit für eine Partnerschaft mit einem Team, das in Ihren Erfolg investiert? Lassen Sie uns ins Gespräch kommen.",
          button: "Kontakt aufnehmen",
        },
      },

      services: {
        meta: {
          title: "Dienstleistungen",
          description: "Umfassende Technologielösungen, die Ihr Unternehmen voranbringen",
        },
        hero: {
          chip: "Unsere Dienstleistungen",
          headline: { before: "Technologie, die ", gradient: "Wachstum antreibt", after: "" },
          description:
            "Vom Konzept bis zum Deployment liefern wir End-to-End-Lösungen, die Ihre Geschäftsfähigkeiten transformieren und Ihren Erfolg beschleunigen.",
        },
        serviceButton: "Projekt besprechen",
        processSection: {
          chip: "Unser Prozess",
          headline: "So arbeiten wir",
          description: "Eine bewährte Methodik, die jedes Mal Ergebnisse liefert.",
        },
        cta: {
          headline: "Bauen wir etwas Großartiges",
          description:
            "Bereit, Ihre Ideen in die Realität umzusetzen? Wir begleiten Sie bei jedem Schritt.",
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
          headline: { before: "Programmieren in ", gradient: "Gedankengeschwindigkeit", after: "" },
          description:
            "Wir setzen Teams von KI-Coding-Agenten ein, die Seite an Seite mit unseren Ingenieuren arbeiten — rund um die Uhr Code schreiben, reviewen und ausliefern.",
        },
        whatSection: {
          chip: "Was ist das",
          headline: "KI-Agenten, die echten Code schreiben",
          description:
            "Agentic Coding geht über Autocomplete hinaus. Autonome KI-Agenten verstehen Ihre Codebasis, planen Implementierungen, schreiben Tests und erstellen Pull Requests — genau wie ein menschlicher Entwickler. Sie übernehmen die Routinearbeit, damit unsere Ingenieure sich auf Architektur, Design und die wirklich wichtigen Probleme konzentrieren können.",
          points: [
            { title: "Autonome Ausführung", description: "Agenten planen, implementieren und verifizieren eigenständig dateiübergreifende Änderungen in ganzen Repositories." },
            { title: "Kontextbewusst", description: "Sie verstehen Ihre Projektstruktur, Coding-Konventionen und Geschäftslogik — nicht nur Syntax." },
            { title: "Mensch im Loop", description: "Jede Änderung wird von erfahrenen Ingenieuren geprüft. Agenten beschleunigen die Auslieferung; Menschen sichern die Qualität." },
          ],
        },
        howSection: {
          chip: "Unser Ansatz",
          headline: "Wie creative-it Agentic Coding einsetzt",
          description:
            "Wir integrieren KI-Agenten direkt in unseren Entwicklungsworkflow. Sie sind kein Gimmick — sie sind vollwertige Teammitglieder mit zugewiesenen Aufgaben, Code-Review-Standards und Verantwortlichkeit.",
          steps: [
            { step: "01", title: "Aufgabenzuweisung", description: "Agenten erhalten klar definierte Aufgaben aus unserem Projektmanagement-System, genau wie jeder Entwickler." },
            { step: "02", title: "Implementierung", description: "Agenten schreiben Code, erstellen Tests und öffnen Pull Requests mit vollständigem Kontext und Dokumentation." },
            { step: "03", title: "Review & Merge", description: "Erfahrene Ingenieure prüfen jeden PR auf Qualität, Sicherheit und Übereinstimmung mit den Projektzielen." },
            { step: "04", title: "Kontinuierliches Lernen", description: "Agenten verbessern sich mit der Zeit, indem sie Projektkonventionen und Feedback-Muster aufnehmen." },
          ],
        },
        benefitsSection: {
          chip: "Produktivitätsgewinne",
          headline: { before: "Ergebnisse, die ", gradient: "sprechen", after: "" },
          description:
            "Die Zahlen aus unserer Live-GitHub-Aktivität erzählen die Geschichte. Agentic Coding ist nicht theoretisch — es liefert jeden Tag Produktionscode.",
          benefits: [
            { value: "5–10x", label: "Schnellere Feature-Auslieferung", description: "Was früher eine Woche dauerte, wird an einem Tag ausgeliefert. Agenten übernehmen Boilerplate, Tests und repetitive Refactorings in Maschinengeschwindigkeit." },
            { value: "24/7", label: "Entwicklungsgeschwindigkeit", description: "Agenten schlafen nicht. Sie verarbeiten Aufgaben über Nacht, sodass Ingenieure am Morgen fertige Pull Requests vorfinden." },
            { value: "Höhere", label: "Codequalität", description: "Jede Änderung kommt mit Tests und Dokumentation. Agenten sind von Haus aus gründlich — keine Abkürzungen, keine technischen Schulden." },
            { value: "Mehr", label: "Fokus für Ingenieure", description: "Da Routinearbeit erledigt wird, verbringen Ingenieure ihre Zeit mit Architektur, User Experience und kreativem Problemlösen." },
          ],
        },
        storySection: {
          chip: "KI-Erzählung",
          headline: "Was wir heute gebaut haben",
          description: "Diese Geschichte wird live von KI basierend auf unserer tatsächlichen GitHub-Aktivität generiert — jedes Mal eine andere Erzählung.",
          refreshButton: "Neue Geschichte",
          loadingText: "KI schreibt die heutige Geschichte...",
          fallback: "Unsere Agenten waren fleißig beim Code-Ausliefern. Schauen Sie sich die Statistiken oben an, um die Zahlen zu sehen.",
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
        exampleCategories: [
          {
            label: "Marketing",
            examples: [
              "Ein Hero-Bereich mit Gradient-Überschrift, Untertitel und zwei CTA-Buttons",
              "Eine Testimonial-Karussell-Karte mit Avatar, Zitat, Name und Rolle",
              "Eine Preistabelle mit drei Stufen: Free, Pro und Enterprise",
              "Eine Feature-Vergleichstabelle mit Häkchen und Kreuzen für drei Pläne",
              "Ein Newsletter-Anmeldebanner mit E-Mail-Eingabe und fetter Überschrift",
              "Eine Teammitglieder-Profilkarte mit Foto-Platzhalter, Name, Rolle und Social Links",
            ],
          },
          {
            label: "Dashboard",
            examples: [
              "Ein Dashboard-Statistikraster mit 4 Metrikkarten mit Icons und Trends",
              "Ein Benachrichtigungs-Feed-Panel mit Zeitstempeln, Icons und gelesen/ungelesen Status",
              "Eine Benutzerprofil-Seitenleiste mit Avatar, Statistiken und einer Liste der letzten Aktivitäten",
              "Ein Fortschritts-Tracker mit 5 Schritten, aktuellem Schritt hervorgehoben und Abschlussprozentzahl",
              "Eine Datentabelle mit sortierbaren Spaltenüberschriften, gestreiften Zeilen und Paginierung",
            ],
          },
          {
            label: "E-Commerce",
            examples: [
              "Eine Produktkarte mit Bild-Platzhalter, Titel, Preis, Sterne-Bewertung und Warenkorb-Button",
              "Eine Warenkorb-Zusammenfassung mit Artikelliste, Mengen, Zwischensumme und Checkout-Button",
              "Ein Produktbewertungs-Bereich mit Sterne-Aufschlüsselung und einzelnen Bewertungskarten",
              "Eine Kategorie-Filter-Seitenleiste mit Checkboxen, Preisspannen-Slider und Anwenden-Button",
            ],
          },
          {
            label: "Formulare",
            examples: [
              "Ein Login-Formular mit E-Mail, Passwort, Social-Sign-in-Buttons und einer Angemeldet-bleiben-Checkbox",
              "Ein mehrstufiger Registrierungs-Assistent mit Fortschrittsanzeige und Formularfeldern",
              "Ein Kontaktformular mit Name, E-Mail, Betreff-Dropdown, Nachrichtenfeld und Datei-Upload",
              "Eine Einstellungsseite mit Toggle-Switches, Radio-Gruppen und einem Speichern-Button",
            ],
          },
          {
            label: "Navigation",
            examples: [
              "Eine responsive Navbar mit Logo, Menü-Links, Suchleiste und einem Benutzer-Avatar-Dropdown",
              "Eine Seitenleisten-Navigation mit einklappbaren Abschnitten, Icons und einem Aktiv-Status-Indikator",
              "Eine Breadcrumb-Leiste mit hervorgehobener aktueller Seite und einem Zurück-Button",
              "Eine Tab-Leiste mit Icons und Labels für eine mobile App Bottom-Navigation",
            ],
          },
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
            "Erzählen Sie uns von Ihren Projektanforderungen und unsere KI empfiehlt einen kompletten Tech-Stack mit Architekturdiagrammen und Begründung.",
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
          headline: "Sollen wir das bauen?",
          description:
            "Unser Team kann diese Empfehlungen in die Realität umsetzen. Lassen Sie uns Ihr Projekt besprechen.",
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
            "Lassen Sie unser Team intelligente Agenten bauen, die auf Ihre Workflows und Geschäftsprozesse zugeschnitten sind.",
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
          headline: { before: "Wie unsere KI ", gradient: "wirklich funktioniert", after: "" },
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
              "Zeigt Echtzeit-GitHub-Statistiken — Commits, geänderte Zeilen und ein 7-Tage-Aktivitätsdiagramm — aus den Repositories unserer Organisation. Eine KI-generierte Erzählung fasst die Entwicklungsaktivität des Tages zusammen.",
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
            "Jedes Feature auf dieser Website wird mit den gleichen Tools und Mustern gebaut, die wir auch für Kunden verwenden. Lassen Sie uns gemeinsam etwas Intelligentes bauen.",
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
            "Lassen Sie uns besprechen, wie wir diese Ideen für Ihr Unternehmen zum Leben erwecken können.",
          button: "Kontakt aufnehmen",
        },
      },

      contact: {
        meta: {
          title: "Kontakt",
          description: "Nehmen Sie Kontakt mit creative-it auf, um Ihr Projekt zu besprechen",
        },
        hero: {
          chip: "Kontakt",
          headline: { before: "Fangen wir an zu ", gradient: "bauen", after: "" },
          description:
            "Haben Sie ein Projekt im Sinn? Wir freuen uns, davon zu hören. Nehmen Sie Kontakt auf und lassen Sie uns besprechen, wie wir Ihnen helfen können, Ihre Ziele zu erreichen.",
        },
        infoHeadline: "Kontakt aufnehmen",
        socialLabel: "Folgen Sie uns",
        form: {
          headline: "Nachricht senden",
          description: "Füllen Sie das untenstehende Formular aus und wir melden uns in Kürze bei Ihnen.",
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
            { value: "project", label: "Neues Projekt" },
            { value: "consulting", label: "Beratungsanfrage" },
            { value: "partnership", label: "Partnerschaftsmöglichkeit" },
            { value: "careers", label: "Karriere" },
            { value: "other", label: "Sonstiges" },
          ],
          messageLabel: "Nachricht",
          messagePlaceholder: "Erzählen Sie uns von Ihrem Projekt oder Ihrer Anfrage...",
          submitButton: "Nachricht senden",
          successMessage: "Vielen Dank für Ihre Nachricht! Wir melden uns in Kürze bei Ihnen.",
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
      placeholder: "Fragen Sie nach unseren Dienstleistungen, Prozessen oder dem Team...",
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
      placeholder: "Wie soll es aussehen? (z.B. Retro 80er Neon)",
      remixButton: "Remix",
      resetButton: "Auf Original zurücksetzen",
      examples: ["Retro 80er Neon", "Warme Erdtöne", "Minimalistisches Monochrom", "Cyberpunk"],
    },
  },
};

// ── t() helper ─────────────────────────────────────────────────────────────

export function t(locale: Locale = 'en') {
  return { ...shared, ...content[locale] };
}

// ── Backward compatibility ─────────────────────────────────────────────────

export const siteConfig = t('en');
