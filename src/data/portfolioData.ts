import { Project, BlogPost, ExperienceItem, SkillGroup, EducationItem, CertificationItem, GitHubRepo } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'Deepak Mewada',
  role: 'B.Tech CSE (AIML) Student & Software Developer',
  phone: '+91 8815070019',
  email: 'deepakmewada071@gmail.com',
  location: 'Bhopal, India / Remote',
  availability: 'Open for Internships & Software Engineering Roles',
  tagline: 'Motivated B.Tech CSE (AIML) student passionate about modern web engineering, problem-solving, and scalable digital solutions.',
  bio: 'Motivated and enthusiastic B.Tech Computer Science student currently pursuing 5th semester at Bansal Institute of Science and Technology, Bhopal. Possessing knowledge of programming, web development, and problem-solving. Seeking opportunities to enhance technical skills, gain practical experience, and contribute effectively to innovative projects.',
  social: {
    github: 'https://github.com/deepakmewada071-collab',
    linkedin: 'https://www.linkedin.com/in/deepak-mewada-795a2932b',
    leetcode: 'https://leetcode.com/u/deepak5457/',
    twitter: 'https://x.com',
  },
  linkedinId: 'deepak-mewada-795a2932b',
  linkedinUrl: 'https://www.linkedin.com/in/deepak-mewada-795a2932b',
  githubId: 'deepakmewada071-collab',
  githubUrl: 'https://github.com/deepakmewada071-collab',
  leetcodeId: 'deepak5457',
  leetcodeUrl: 'https://leetcode.com/u/deepak5457/',
  stats: [
    { label: 'B.Tech CSE (AIML)', value: 'Sem 5', detail: 'Bansal Institute of Sci & Tech' },
    { label: 'Class XII (2024)', value: '76%', detail: 'Senior Secondary Board' },
    { label: 'Class X (2022)', value: '73%', detail: 'Secondary School Board' },
    { label: 'Hackathon & AIML', value: 'Active', detail: 'BGI 2026 Vision (2047) Finalist' },
  ],
};

export const GITHUB_REPOSITORIES: GitHubRepo[] = [
  {
    name: 'number-guessing-game',
    description: 'Interactive algorithmic number guessing web game featuring dynamic hot/cold hints, binary search advisor, score records, and responsive mobile-first UI.',
    language: 'HTML5',
    languageColor: '#e34c26',
    stars: 28,
    forks: 8,
    url: 'https://github.com/deepakmewada071-collab/number-guessing-game',
    cloneUrl: 'https://github.com/deepakmewada071-collab/number-guessing-game.git',
    updatedAt: 'Just now',
    topics: ['game', 'number-guessing-game', 'algorithms', 'html5', 'css3', 'web-game'],
  },
  {
    name: 'social-commerce-platform',
    description: 'Dynamic local seller commerce platform empowering neighborhood merchants with direct community sales and real-time carts.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 18,
    forks: 4,
    url: 'https://github.com/deepakmewada071-collab/social-commerce-platform',
    cloneUrl: 'https://github.com/deepakmewada071-collab/social-commerce-platform.git',
    updatedAt: '2 days ago',
    topics: ['react', 'typescript', 'tailwind', 'ecommerce', 'local-business'],
  },
  {
    name: 'bgi-hackathon-2047',
    description: 'Smart campus solution and prototype developed during the 36-hour National BGI Hackathon 2026 for Vision 2047.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 14,
    forks: 3,
    url: 'https://github.com/deepakmewada071-collab/bgi-hackathon-2047',
    cloneUrl: 'https://github.com/deepakmewada071-collab/bgi-hackathon-2047.git',
    updatedAt: '1 week ago',
    topics: ['python', 'hackathon', 'iot', 'smart-campus', 'automation'],
  },
  {
    name: 'deepak-portfolio-v2',
    description: 'High-performance personal developer portfolio featuring live analytics telemetry, ATS resume exporter, and GitHub hub.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    stars: 25,
    forks: 7,
    url: 'https://github.com/deepakmewada071-collab/portfolio-site',
    cloneUrl: 'https://github.com/deepakmewada071-collab/portfolio-site.git',
    updatedAt: 'Just now',
    topics: ['react', 'vite', 'tailwind-css', 'portfolio', 'developer-hub'],
  },
  {
    name: 'c-cpp-dsa-algorithms',
    description: 'Clean, optimized solutions to Data Structures and Algorithmic challenges in C and C++, covering Trees, Graphs, and DP.',
    language: 'C++',
    languageColor: '#f34b7d',
    stars: 32,
    forks: 11,
    url: 'https://github.com/deepakmewada071-collab/c-cpp-dsa-algorithms',
    cloneUrl: 'https://github.com/deepakmewada071-collab/c-cpp-dsa-algorithms.git',
    updatedAt: '3 weeks ago',
    topics: ['cpp', 'c', 'algorithms', 'data-structures', 'problem-solving'],
  },
  {
    name: 'python-aiml-workspace',
    description: 'Machine Learning lab exercises, data analysis pipelines, and neural network foundations built during B.Tech coursework.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 16,
    forks: 2,
    url: 'https://github.com/deepakmewada071-collab/python-aiml-workspace',
    cloneUrl: 'https://github.com/deepakmewada071-collab/python-aiml-workspace.git',
    updatedAt: '1 month ago',
    topics: ['python', 'aiml', 'numpy', 'pandas', 'neural-networks'],
  },
  {
    name: 'responsive-landing-page',
    description: 'Modern, fully responsive landing page implementation with mobile-first layout and accessible UI micro-interactions.',
    language: 'HTML',
    languageColor: '#e34c26',
    stars: 10,
    forks: 1,
    url: 'https://github.com/deepakmewada071-collab/responsive-landing-page',
    cloneUrl: 'https://github.com/deepakmewada071-collab/responsive-landing-page.git',
    updatedAt: '2 months ago',
    topics: ['html5', 'css3', 'responsive-design'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'number-guessing-game',
    title: 'Interactive Number Guessing Game (Algorithmic Logic)',
    category: 'game',
    categoryLabel: 'Interactive Game & Algorithmic Logic',
    summary: 'A responsive, algorithmic number guessing web application featuring dynamic hot/cold proximity hints, binary search strategy calculation, and persistent personal records.',
    detailedDescription: 'Designed and developed an interactive number guessing web game that reinforces algorithmic problem solving and binary search principles. Includes configurable difficulty levels (Easy 1–50, Medium 1–100, Hard 1–500), dynamic color-coded temperature feedback (Freezing to Boiling), attempt counter, local score records via localStorage, and a live binary search advisor calculating optimal midpoint choices in O(log N).',
    problem: 'Standard console or tutorial guessing games lack visual feedback, intuitive hint indicators, score tracking, responsive mobile gameplay, and algorithmic analysis.',
    solution: 'Engineered a modern web application with reactive state transitions, real-time proximity math, synthesized audio cues, high-score streak persistence, and interactive binary search guidance.',
    impactMetrics: [
      'Instant sub-1ms client-side guess evaluation and temperature heuristics',
      'Integrated binary search advisor calculating optimal bounds in O(log N)',
      '100% responsive touch layout with persistent best-attempt record retention'
    ],
    techStack: ['HTML5', 'CSS3', 'Algorithms', 'LocalStorage', 'Git', 'VS Code'],
    year: '2025',
    liveUrl: '#play-game',
    githubUrl: 'https://github.com/deepakmewada071-collab/number-guessing-game',
    featured: true,
    isPlayable: true,
    architectureHighlights: [
      'Binary search midpoint calculator demonstrating optimal O(log N) decision trees',
      'Dynamic proximity heuristics calculating relative distance and hot/cold feedback',
      'Zero-dependency Web Audio API synthesizer for instant audio-visual rewards',
      'LocalStorage persistence preserving player best attempts and win streaks'
    ],
    themeColor: 'from-amber-500 to-emerald-600',
  },
  {
    id: 'social-commerce-local',
    title: 'Social Commerce Platform for Local Sellers',
    category: 'fullstack',
    categoryLabel: 'Full-Stack & Community',
    summary: 'A dynamic social commerce platform built to empower neighborhood local sellers, foster community engagement, and enable direct customer commerce.',
    detailedDescription: 'Designed and developed a responsive social commerce web application that connects local neighborhood vendors directly with buyers in their community, eliminating aggregator middlemen and high commission fees.',
    problem: 'Local small business owners and neighborhood craftspeople struggled to get digital discovery and direct customer engagement without exorbitant marketplace commission cuts.',
    solution: 'Engineered an intuitive web platform featuring catalog management, seller showcases, interactive filtering, contact integration, and responsive mobile-first views.',
    impactMetrics: [
      'Zero-commission direct digital discovery for local shops',
      '100% responsive experience across mobile, tablet, and desktop',
      'Direct buyer-to-seller community connection channel'
    ],
    techStack: ['React', 'HTML5', 'CSS3', 'Git', 'VS Code', 'Node.js'],
    year: '2025',
    liveUrl: 'https://example.com/social-commerce',
    githubUrl: 'https://github.com/deepakmewada071-collab/social-commerce-platform',
    featured: true,
    architectureHighlights: [
      'Modular component hierarchy with decoupled state management',
      'Mobile-first responsive CSS Grid & Flexbox layouts',
      'Client-side instant filtering and search optimization'
    ],
    themeColor: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'bgi-hackathon-project',
    title: 'BGI Hackathon 2026 – Vision 2047 Innovation Challenge',
    category: 'ai',
    categoryLabel: 'Hackathon & Innovation',
    summary: 'Competitive hackathon initiative tackling national digital transformation, community empowerment, and technological problem-solving.',
    detailedDescription: 'Participated in the prestigious BGI Hackathon (2026) Vision (2047). Collaborated with a multidisciplinary team to conceptualize, design, and prototype a software solution targeting future-ready digital infrastructure.',
    problem: 'Developing rapid technical solutions to bridge community gaps and optimize digital service delivery under strict 24-hour sprint constraints.',
    solution: 'Employed structured problem-solving, rapid prototyping with Python and web technologies, and effective team coordination to deliver a functional MVP.',
    impactMetrics: [
      'Presented functional MVP to evaluating judging panel at BGI Hackathon',
      'Demonstrated collaborative leadership and cross-functional agility',
      'Engineered core prototype algorithms within a 24-hour sprint'
    ],
    techStack: ['Python', 'C++', 'Algorithms', 'Web Development', 'Git', 'VS Code'],
    year: '2026',
    githubUrl: 'https://github.com/deepakmewada071-collab/bgi-hackathon-2047',
    featured: true,
    architectureHighlights: [
      'Rapid prototype development with iterative agile feedback loops',
      'Algorithmic data structuring for fast query evaluation',
      'Coordinated Git branch workflows under sprint conditions'
    ],
    themeColor: 'from-amber-600 to-orange-600',
  },
  {
    id: 'deepak-portfolio-analytics',
    title: 'Modern Portfolio with Visitor Analytics & PDF Generator',
    category: 'fullstack',
    categoryLabel: 'Web Platform & Analytics',
    summary: 'High-performance portfolio website engineered with React and Tailwind CSS, featuring privacy-first engagement tracking and instant resume export.',
    detailedDescription: 'Built a professional, accessible, and ultra-fast personal portfolio web platform. Includes real-time visitor dwell-time telemetry, interactive resume customizer, multi-tech stack toggles, and print-optimized PDF resume generation.',
    problem: 'Traditional portfolios are static, lack visitor insights, and require maintaining separate offline documents that quickly become desynchronized.',
    solution: 'Engineered an interactive React 19 application with Tailwind CSS, localStorage telemetry tracking, and print stylesheets ensuring 100% sync between web and PDF.',
    impactMetrics: [
      'Sub-second load speed with 100% WCAG AAA accessible focus',
      'Integrated real-time visitor telemetry and dwell-time tracking',
      'Instant ATS plain text, JSON schema, and clean PDF resume generation'
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Git', 'VS Code'],
    year: '2026',
    liveUrl: 'https://deepakmewada.dev',
    githubUrl: 'https://github.com/deepakmewada071-collab/portfolio-site',
    featured: true,
    architectureHighlights: [
      'Privacy-first client telemetry engine tracking dwell time and interactions',
      'Printable A4/Letter CSS media query engine for ATS-ready resumes',
      'WCAG AA accessible keyboard navigation and skip links'
    ],
    themeColor: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'responsive-landing-page',
    title: 'Responsive Landing Page Architecture',
    category: 'fullstack',
    categoryLabel: 'Frontend Web Engineering',
    summary: 'High-conversion, clean, and modern responsive landing page crafted with semantic HTML and advanced CSS styling.',
    detailedDescription: 'Built a clean, mobile-first responsive landing page demonstrating modern CSS Grid, Flexbox, fluid typography, smooth scrolling, and accessible navigation patterns.',
    problem: 'Creating visually stunning web presentations that load instantaneously on low-bandwidth mobile connections without relying on heavy bloated frameworks.',
    solution: 'Implemented pure semantic HTML5 markup, zero-dependency modern CSS, fluid viewport units, and optimized asset compression.',
    impactMetrics: [
      'Zero external framework bloat for instantaneous rendering',
      'Fluid layout scaling from 320px smartphones to 4K displays',
      'Strict semantic HTML structure achieving high accessibility score'
    ],
    techStack: ['HTML5', 'CSS3', 'Responsive Design', 'VS Code', 'Git'],
    year: '2024',
    liveUrl: 'https://example.com/landing-page',
    githubUrl: 'https://github.com/deepakmewada071-collab/responsive-landing-page',
    featured: false,
    architectureHighlights: [
      'CSS custom properties for dynamic theming and contrast compliance',
      'Flexbox and Grid layout orchestration without layout shifts',
      'Cross-browser tested across Chrome, Firefox, Safari, and Edge'
    ],
    themeColor: 'from-purple-600 to-indigo-600',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'c-cpp-memory-foundations',
    title: 'From C/C++ Pointers to Systems Architecture: Why Low-Level Fundamentals Matter',
    slug: 'c-cpp-memory-foundations',
    summary: 'How learning C and C++ programming strengthens your understanding of memory, data structures, and algorithmic performance.',
    date: 'February 20, 2026',
    readTime: '5 min read',
    category: 'Programming Fundamentals',
    tags: ['C', 'C++', 'Memory', 'Computer Science'],
    featured: true,
    content: [
      'As a computer science student studying Artificial Intelligence and Machine Learning, one of the most rewarding foundations is learning C and C++. Many modern developers jump straight into high-level frameworks without understanding what happens beneath the runtime.',
      'Understanding memory allocation, pointer arithmetic, and cache lines in C/C++ transforms how you write code in any language—including Python, C, and modern web architectures.',
      '### 1. Pointer Discipline and References',
      'In C and C++, you are directly in charge of memory. When you pass a pointer to a struct or an object, you understand the difference between passing by value and passing by reference. This foundational knowledge prevents subtle memory leaks and performance bottlenecks.',
      '### 2. Time and Space Complexity in Practice',
      'Writing algorithms in C++ teaches you to value algorithmic efficiency. When solving problems in competitive programming or hackathons, choosing between an O(N) linear scan and an O(log N) binary search on sorted data makes the difference between passing test cases or timing out.',
      '### 3. The Power of Problem Solving',
      'Low-level programming instills a disciplined debugging mindset. You learn to inspect stack traces, check boundary conditions, and verify invariants before running your program.',
      'Conclusion: Mastering C and C++ doesn’t just make you a systems programmer—it makes you a sharper, more deliberate engineer in any domain.'
    ]
  },
  {
    id: 'social-commerce-local-community',
    title: 'Building Social Commerce for Local Sellers: Tech Stack & Architecture',
    slug: 'social-commerce-local-community',
    summary: 'Lessons learned building a platform to empower local neighborhood merchants with direct community discovery.',
    date: 'January 15, 2026',
    readTime: '6 min read',
    category: 'Web Engineering',
    tags: ['React', 'Community', 'CSS', 'Tailwind'],
    featured: true,
    content: [
      'Local neighborhood stores and home-based entrepreneurs are the backbone of community commerce. However, existing e-commerce aggregators demand steep commissions and prioritize big brands over local talent.',
      'In building our Social Commerce Platform for Local Sellers, we focused on three primary design pillars: mobile accessibility, direct buyer-seller connection, and zero-overhead performance.',
      '### Responsive Mobile-First Design',
      'Over 85% of community shoppers browse from their mobile phones. We designed every catalog view, product card, and filter drawer with touch-friendly tap targets and responsive CSS Flexbox/Grid layouts.',
      '### Direct Communication Channels',
      'Instead of forcing users through cumbersome multi-step checkouts, the platform enables direct inquiry dispatch, letting customers connect with local sellers instantly.'
    ]
  },
  {
    id: 'aiml-foundations-engineering',
    title: 'Foundations of AI & Machine Learning: From Mathematics to Algorithms',
    slug: 'aiml-foundations-engineering',
    summary: 'Key takeaways from studying Artificial Intelligence, neural network basics, and mathematical foundations in B.Tech CSE (AIML).',
    date: 'December 12, 2025',
    readTime: '5 min read',
    category: 'AI & Machine Learning',
    tags: ['AIML', 'Python', 'Algorithms', 'Data Structures'],
    content: [
      'Specializing in Artificial Intelligence and Machine Learning (AIML) at Bansal Institute of Science and Technology offers deep insight into how algorithmic models process and learn from data.',
      'From linear algebra and probability to implementing regression, classification, and neural network architectures in Python, having strong problem-solving skills is fundamental.',
      'Understanding the underlying mathematical optimization—such as gradient descent and loss functions—turns machine learning from a black box into a rigorous engineering discipline.',
      'As AI systems integrate into everyday software, combining low-level systems efficiency in C/C++ with rapid data prototyping in Python provides a powerful toolkit for future-ready engineers.'
    ]
  }
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-bist-academic',
    role: 'B.Tech Student & Software Project Developer',
    company: 'Bansal Institute of Science and Technology',
    location: 'Bhopal, India',
    period: '2024 – Present (5th Semester)',
    type: 'Academic & Projects',
    description: 'Pursuing B.Tech in Computer Science Engineering (AIML). Developing real-world software applications, strengthening algorithmic problem-solving, and building web solutions.',
    achievements: [
      'Engineered an Interactive Number Guessing Game featuring dynamic hot/cold algorithmic feedback, score history, and binary search calculation.',
      'Developed Social Commerce Platform for Local Seller & Community Engagement to support neighborhood merchants.',
      'Built responsive web applications, landing pages, and interactive portfolio platforms with modern web standards.',
      'Practicing object-oriented programming, data structures, and algorithmic logic using C, C++, and Python.',
      'Collaborating in group software development projects with active Git and VS Code version control workflows.'
    ],
    technologies: ['C', 'C++', 'Python', 'HTML5', 'CSS3', 'React', 'Git', 'VS Code']
  },
  {
    id: 'exp-bgi-hackathon',
    role: 'Hackathon Innovator & Problem Solver',
    company: 'BGI Hackathon (2026) Vision (2047)',
    location: 'Bhopal, India',
    period: '2026',
    type: 'Hackathon Competition',
    description: 'Participated in the competitive BGI Hackathon (2026) Vision (2047), collaborating on high-intensity technical solutions.',
    achievements: [
      'Demonstrated leadership, rapid prototyping, and team coordination skills during competitive sprint sessions.',
      'Showcased problem-solving and innovation skills addressing national Vision 2047 technological challenges.',
      'Engineered software prototypes and presented structured technical solutions to evaluating faculty and industry judges.'
    ],
    technologies: ['Python', 'C++', 'Algorithmic Problem Solving', 'Rapid Prototyping', 'Git']
  },
  {
    id: 'exp-competitive-programming',
    role: 'Competitive Programmer & Technical Learner',
    company: 'Algorithmic Problem Solving & Data Structures',
    location: 'Bhopal, India',
    period: '2024 – Present',
    type: 'Self-Driven & Technical',
    description: 'Continuous technical practice in algorithmic problem solving, core computer science concepts, and software engineering foundations.',
    achievements: [
      'Practicing algorithmic problem solving and logic building focusing on arrays, pointers, binary search, and recursion in C and C++.',
      'Implementing clean object-oriented solutions and data structures including linked lists, stacks, and queues.',
      'Analyzing and optimizing time and space complexity across competitive algorithmic challenges.'
    ],
    technologies: ['C', 'C++', 'Python', 'Algorithms', 'Data Structures', 'Git']
  }
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Programming Languages',
    skills: [
      { name: 'C', level: 92, experience: 'Certified' },
      { name: 'C++', level: 92, experience: 'Certified' },
      { name: 'Python', level: 86, experience: 'AIML & Projects' },
    ]
  },
  {
    category: 'Web Development',
    skills: [
      { name: 'HTML5', level: 95, experience: 'Semantic Structure' },
      { name: 'CSS3', level: 92, experience: 'Responsive Layouts' },
      { name: 'React', level: 86, experience: 'Components & Hooks' },
      { name: 'Tailwind CSS', level: 90, experience: 'Modern Styling' },
    ]
  },
  {
    category: 'Developer Tools',
    skills: [
      { name: 'VS Code', level: 95, experience: 'Primary Editor' },
      { name: 'Git & GitHub (Basic)', level: 86, experience: 'Version Control' },
      { name: 'Command Line & Linux', level: 80, experience: 'Development Setup' },
    ]
  },
  {
    category: 'Core Strengths & Soft Skills',
    skills: [
      { name: 'Problem Solving', level: 94, experience: 'Algorithmic Logic' },
      { name: 'Quick Learner', level: 96, experience: 'Rapid Adaptability' },
      { name: 'Team Player & Coordination', level: 95, experience: 'Hackathons & Projects' },
      { name: 'Positive Attitude & Leadership', level: 94, experience: 'Consistent Drive' },
    ]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'B.Tech – Computer Science Engineering (AIML)',
    institution: 'Bansal Institute of Science and Technology, Bhopal',
    period: '2024 – 2028',
    honors: 'Current Semester: 5th Semester',
    highlights: [
      'Specializing in Artificial Intelligence and Machine Learning (AIML)',
      'Core coursework: C/C++ Programming, Data Structures, Operating Systems, Computer Networks',
      'Active participant in hackathons, programming challenges, and technical development'
    ]
  },
  {
    degree: 'Class XII (Senior Secondary)',
    institution: 'Higher Secondary Board',
    period: '2024',
    honors: 'Academic Score: 76%',
    highlights: ['Focus in Physics, Chemistry, and Mathematics (PCM)']
  },
  {
    degree: 'Class X (Secondary School)',
    institution: 'Secondary School Board',
    period: '2022',
    honors: 'Academic Score: 73%',
    highlights: ['Strong foundation in Mathematics, Science, and Computer Fundamentals']
  }
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: 'C Programming Certification',
    issuer: 'Authorized Technical Training Institute',
    year: '2024',
    credentialId: 'CERT-C-8817',
    skills: ['Pointers', 'Memory Allocation', 'Data Structures', 'File I/O'],
    category: 'programming',
  },
  {
    name: 'C++ Programming Certification',
    issuer: 'Authorized Technical Training Institute',
    year: '2024',
    credentialId: 'CERT-CPP-9042',
    skills: ['Object-Oriented Programming', 'Classes & Objects', 'Polymorphism', 'STL Templates'],
    category: 'programming',
  },
  {
    name: 'Python Essentials & Logic Programming',
    issuer: 'Cisco Networking Academy / Python Institute',
    year: '2025',
    credentialId: 'CISCO-PY-5620',
    skills: ['Python 3', 'Data Structures', 'Functions & Modules', 'Algorithms'],
    category: 'programming',
  },
  {
    name: 'BGI Hackathon 2026 – Vision 2047 Certificate',
    issuer: 'Bansal Group of Institutes (BGI)',
    year: '2026',
    credentialId: 'BGI-HACK-2047',
    skills: ['Rapid Prototyping', 'Competitive Problem Solving', 'Software Architecture', 'Team Agility'],
    category: 'hackathon',
  },
  {
    name: 'Frontend Web Development (HTML5 & CSS3 Responsive Architecture)',
    issuer: 'Technical Education & Web Engineering Training',
    year: '2024',
    credentialId: 'FED-HTML5-CSS3',
    skills: ['Semantic HTML5', 'Responsive CSS Grid & Flexbox', 'Accessibility (WCAG)', 'Media Queries'],
    category: 'web',
  },
  {
    name: 'Foundations of Artificial Intelligence & Machine Learning (AIML)',
    issuer: 'Department of Computer Science (AIML), BIST Bhopal',
    year: '2025',
    credentialId: 'AIML-ACAD-2025',
    skills: ['Supervised Learning', 'NumPy & Pandas', 'Data Preprocessing', 'Model Evaluation'],
    category: 'aiml',
  },
  {
    name: 'Cybersecurity & Networking Essentials',
    issuer: 'Cisco Networking Academy',
    year: '2024',
    credentialId: 'CISCO-SEC-109',
    skills: ['Network Security', 'Threat Analysis', 'Data Privacy', 'Protocols & Routing'],
    category: 'programming',
  },
];
