// Site configuration - edit this file to update site content
export const siteConfig = {
  name: "creative-it",
  tagline: "Build. Grow. Matter.",
  description: "We build software, teams, processes, and trust. From this foundation, growth emerges—and with it, lasting impact.",

  contact: {
    email: "info@creative-it.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, Innovation City, ST 12345",
  },

  social: {
    linkedin: "https://linkedin.com/company/creative-it",
    twitter: "https://twitter.com/creativeit",
    github: "https://github.com/creative-it",
  },

  navigation: [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],

  services: [
    {
      title: "Software Development",
      description: "Custom solutions built with precision and purpose. We transform complex requirements into elegant, scalable software.",
      icon: "code",
      features: ["Full-stack development", "API design & integration", "Legacy modernization"],
    },
    {
      title: "Cloud Architecture",
      description: "Secure, scalable infrastructure designed for growth. We architect cloud solutions that perform under pressure.",
      icon: "cloud",
      features: ["Cloud migration", "Infrastructure as code", "DevOps automation"],
    },
    {
      title: "Technical Consulting",
      description: "Strategic guidance for technology decisions that matter. We help you navigate complexity with confidence.",
      icon: "lightbulb",
      features: ["Architecture review", "Technology strategy", "Team augmentation"],
    },
    {
      title: "Managed Services",
      description: "Proactive care for your technology ecosystem. We monitor, maintain, and optimize so you can focus on growth.",
      icon: "shield",
      features: ["24/7 monitoring", "Security management", "Performance optimization"],
    },
  ],

  about: {
    mission: "To empower businesses through technology that transforms, teams that thrive, and partnerships that last.",
    story: "Creative IT was founded on a simple belief: technology should enable growth, not constrain it. We've built our company around the philosophy of Build. Grow. Matter.—building software, building teams, building trust. From this foundation, we help our clients grow their capabilities, their reach, and their impact. Because ultimately, we believe that what we create together should matter—to your business, to your customers, and to the future you're building.",
    values: [
      {
        title: "Build",
        description: "We construct with purpose—software, teams, processes, and lasting relationships."
      },
      {
        title: "Grow",
        description: "We foster continuous improvement for our clients, our team, and ourselves."
      },
      {
        title: "Matter",
        description: "We deliver work that creates real impact and meaningful change."
      },
    ],
    stats: [
      { value: "150+", label: "Projects Delivered" },
      { value: "12+", label: "Years Experience" },
      { value: "98%", label: "Client Retention" },
      { value: "24/7", label: "Support Available" },
    ],
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
};
