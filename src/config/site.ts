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
      ctaPrimary: "Start a Project",
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

      philosophySection: {
        chip: "Our Philosophy",
        headline: { before: "Three Words.", gradient: "Infinite Possibility.", after: "" },
        linkText: "About Our Journey",
      },

      cta: {
        headline: "Ready to Build\nSomething That Matters?",
        description:
          "Let's discuss how we can help you achieve your technology goals and create lasting impact.",
        button: "Start the Conversation",
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
