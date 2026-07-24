import { Project, Skill, Experience, Statistic } from "@/types";

export const INITIAL_STATISTICS: Statistic[] = [
  { label: "Years Experience", value: "1+", description: "Software Engineering" },
  { label: "Projects Completed", value: "4+", description: "Web, Mobile & Desktop" },
  { label: "Technologies Mastered", value: "28+", description: "Full-Stack Tech Stacks" },
  { label: "Client Satisfaction", value: "100%", description: "Quality Driven Deliverables" },
];

export const INITIAL_SKILLS: Skill[] = [
  // Languages
  { id: "s1", name: "PHP", category: "Languages", icon: "php", proficiency: 90 },
  { id: "s2", name: "Java", category: "Languages", icon: "java", proficiency: 85 },
  { id: "s3", name: "Python", category: "Languages", icon: "python", proficiency: 88 },
  { id: "s4", name: "Dart", category: "Languages", icon: "dart", proficiency: 85 },
  { id: "s5", name: "JavaScript", category: "Languages", icon: "js", proficiency: 95 },
  { id: "s6", name: "TypeScript", category: "Languages", icon: "ts", proficiency: 92 },

  // Web Development
  { id: "s7", name: "HTML", category: "Web Development", icon: "html", proficiency: 98 },
  { id: "s8", name: "CSS", category: "Web Development", icon: "css", proficiency: 95 },
  { id: "s9", name: "React", category: "Web Development", icon: "react", proficiency: 95 },
  { id: "s10", name: "Next.js", category: "Web Development", icon: "nextjs", proficiency: 92 },

  // Mobile Development
  { id: "s11", name: "React Native", category: "Mobile Development", icon: "reactnative", proficiency: 90 },
  { id: "s12", name: "Flutter", category: "Mobile Development", icon: "flutter", proficiency: 88 },

  // Frameworks
  { id: "s13", name: "React", category: "Frameworks", icon: "react", proficiency: 95 },
  { id: "s14", name: "Angular", category: "Frameworks", icon: "angular", proficiency: 80 },
  { id: "s15", name: "Next.js", category: "Frameworks", icon: "nextjs", proficiency: 92 },
  { id: "s16", name: "MERN", category: "Frameworks", icon: "mern", proficiency: 92 },
  { id: "s17", name: "Flutter", category: "Frameworks", icon: "flutter", proficiency: 88 },
  { id: "s18", name: "Laravel", category: "Frameworks", icon: "laravel", proficiency: 88 },
  { id: "s19", name: "Electron", category: "Frameworks", icon: "electron", proficiency: 85 },

  // Tools
  { id: "s20", name: "Git", category: "Tools", icon: "git", proficiency: 92 },
  { id: "s21", name: "GitHub", category: "Tools", icon: "github", proficiency: 95 },
  { id: "s22", name: "VS Code", category: "Tools", icon: "vscode", proficiency: 98 },
  { id: "s23", name: "Android Studio", category: "Tools", icon: "androidstudio", proficiency: 85 },
  { id: "s24", name: "Figma", category: "Tools", icon: "figma", proficiency: 88 },

  // AI Tools
  { id: "s25", name: "ChatGPT", category: "AI Tools", icon: "chatgpt", proficiency: 95 },
  { id: "s26", name: "GitHub Copilot", category: "AI Tools", icon: "copilot", proficiency: 92 },
  { id: "s27", name: "Claude", category: "AI Tools", icon: "claude", proficiency: 95 },
  { id: "s28", name: "Gemini", category: "AI Tools", icon: "gemini", proficiency: 92 },
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    company: "Rabbit Solutions Pvt Ltd",
    role: "Associate Software Engineer",
    period: "Jan 2026 - Present",
    description: "Architecting and engineering high-scalability web and mobile products. Leading full-stack development initiatives using React, Next.js, PHP, and mobile cross-platform technologies. Collaborating with cross-functional teams to deliver robust enterprise solutions.",
    is_current: true,
  },
  {
    id: "exp-2",
    company: "Rabbit Solutions Pvt Ltd",
    role: "Intern Software Engineer",
    period: "Aug 2025 - Jan 2026",
    description: "Contributed to front-end interface development, API integrations, database optimization, and cross-platform app maintenance. Worked closely with senior engineers to implement user-centric features.",
    is_current: false,
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Accounting Guide LMS Platform",
    category: "Web Applications",
    description: "An advanced Learning Management System engineered for accounting students and educators. Features interactive online courses, quiz modules, student progress tracking, and secure video lecture streaming.",
    technologies: ["React", "PHP", "MySQL", "Tailwind CSS"],
    live_url: "https://accountingguide.lk",
    github_url: "https://github.com/madhushanka/accounting-guide",
    youtube_url: "https://www.youtube.com/watch?v=demo-accounting-guide",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p2",
    title: "MyBulaBuy E-commerce Platform",
    category: "Web Applications",
    description: "A feature-rich online retail marketplace supporting multi-category product listings, dynamic cart management, multi-currency pricing, order fulfillment tracking, and admin dashboard controls.",
    technologies: ["PHP", "MySQL", "JavaScript", "CSS3"],
    live_url: "https://mybulabuy.com",
    github_url: "https://github.com/madhushanka/mybulabuy-ecommerce",
    youtube_url: "https://www.youtube.com/watch?v=demo-mybulabuy",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556742049-0a67daf40955?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p3",
    title: "Travel Lanka World Website",
    category: "Web Applications",
    description: "Comprehensive travel agency web portal designed to promote Sri Lankan tourism. Provides itinerary building, tour package reservations, interactive destination guides, and customer reviews.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML5"],
    live_url: "https://travellankaworld.com",
    github_url: "https://github.com/madhushanka/travel-lanka-world",
    youtube_url: "https://www.youtube.com/watch?v=demo-travel-lanka",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p4",
    title: "Devora Company Website",
    category: "Web Applications",
    description: "Modern, high-performance corporate portal built for a software engineering solutions agency. Features glassmorphism UI aesthetic, service portfolio, team profiles, and consultation request workflows.",
    technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
    live_url: "https://devora.lk",
    github_url: "https://github.com/madhushanka/devora-company-web",
    youtube_url: "https://www.youtube.com/watch?v=demo-devora",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p5",
    title: "Dragon Car Rent Mobile App",
    category: "Mobile Applications",
    description: "Cross-platform mobile app enabling instant vehicle rentals. Includes real-time car availability search, GPS location pickup mapping, online reservation management, and digital invoice issuance.",
    technologies: ["React Native", "TypeScript", "Redux", "Node.js"],
    live_url: null,
    github_url: "https://github.com/madhushanka/dragon-car-rent-app",
    youtube_url: "https://www.youtube.com/watch?v=demo-dragon-car-rent",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p6",
    title: "Village Mart Mobile App",
    category: "Mobile Applications",
    description: "Hyperlocal grocery ordering app designed to bring fresh farm produce directly to consumers. Powered by Firebase Realtime Database for instant order status updates and push notifications.",
    technologies: ["React Native", "Firebase", "Context API"],
    live_url: null,
    github_url: "https://github.com/madhushanka/village-mart-mobile",
    youtube_url: "https://www.youtube.com/watch?v=demo-village-mart",
    is_featured: false,
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p7",
    title: "Smart Harvest Platform",
    category: "Mobile Applications",
    description: "Integrated AgriTech suite connecting local farmers, distributors, and buyers. Uses Supabase backend for real-time inventory updates, market price trending, and harvest yield analytics.",
    technologies: ["React Native", "Next.js", "Supabase", "Tailwind CSS"],
    live_url: null,
    github_url: "https://github.com/madhushanka/smart-harvest-agri",
    youtube_url: "https://www.youtube.com/watch?v=demo-smart-harvest",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    id: "p8",
    title: "Medusa AI Learning Chatbot",
    category: "Desktop Applications",
    description: "Cutting-edge desktop AI assistant featuring offline LLM conversation capabilities, voice recognition control, interactive 3D live avatar rendering, and direct PC system automation commands.",
    technologies: ["Python", "Electron", "SQLite", "PyTorch"],
    live_url: null,
    github_url: "https://github.com/madhushanka/medusa-ai-desktop",
    youtube_url: "https://www.youtube.com/watch?v=demo-medusa-ai",
    is_featured: true,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];
