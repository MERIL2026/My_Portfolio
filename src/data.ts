export const data = {
  name: "Meril Parmar",
  roles: [
    "AI Developer",
    "Full Stack Developer",
    "IoT Engineer",
    "Founder",
    "Problem Solver"
  ],
  stats: [
    { value: "20+", label: "Projects" },
    { value: "10+", label: "Technologies" },
    { value: "2+", label: "Years Experience" },
    { value: "1000+", label: "Hours Coding" }
  ],
  about: {
    intro: "Hi, I'm Meril Parmar. AI Developer • Full Stack Developer • IoT Engineer • Founder of Pixel Forge • President of TechTronix Club.",
    timeline: [
      { year: "2023", event: "Started Programming" },
      { year: "2023", event: "Built First Website" },
      { year: "2024", event: "Started AI" },
      { year: "2024", event: "Started Pixel Forge" },
      { year: "2025", event: "President of TechTronix" },
      { year: "2026", event: "Building AI Products" }
    ],
    story: "I am a passionate builder obsessed with combining AI, web technologies, and hardware. My mission is to push boundaries and create products that are not just functional but leave a lasting impact. At Pixel Forge and TechTronix, I lead teams to innovate at the edge of what's possible."
  },
  skills: {
    programming: ["Python", "Java", "JavaScript", "TypeScript", "C", "C++", "SQL"],
    frontend: ["HTML", "CSS", "Tailwind", "React", "Next.js", "Framer Motion", "Three.js"],
    backend: ["Node", "Express", "FastAPI", "Flask", "Firebase", "Supabase", "MongoDB", "MySQL"],
    ai: ["OpenAI", "Gemini", "Claude", "TensorFlow", "PyTorch", "LangChain", "Whisper", "ElevenLabs"],
    iot: ["Arduino", "ESP32", "MQTT", "Sensors", "Bluetooth", "LoRa", "Li-Fi"],
    tools: ["Git", "GitHub", "Docker", "VS Code", "Figma", "Photoshop", "Linux"]
  },
  projects: [
    {
      title: "TECH VISION IRIS",
      subtitle: "AI + IoT Surveillance System",
      features: ["Motion Detection", "Li-Fi Communication", "ESP32", "Cloud Dashboard", "Real-time Alerts"],
      tech: ["Python", "ESP32", "React", "Node.js", "Li-Fi"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
      links: { github: "#", demo: "#" },
      priority: 5,
      category: "AI + IoT"
    },
    {
      title: "Tronix AI Assistant",
      subtitle: "Voice Assistant & Automation",
      features: ["Voice Assistant", "Face Recognition", "ChatGPT", "Memory", "Automation", "Desktop Control"],
      tech: ["Python", "OpenAI API", "OpenCV", "Speech Synthesis"],
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
      links: { github: "#", demo: "#" },
      priority: 5,
      category: "AI / Python"
    },
    {
      title: "Event Management System",
      subtitle: "Full-Stack Event Hosting & Ticketing",
      features: ["Real-time Ticketing", "Seat Mapping", "Interactive Calendars", "Secure Gate Payments", "Analytics Dashboard"],
      tech: ["React", "Express", "Node.js", "MongoDB", "Stripe"],
      image: "/evenia.png",
      links: { github: "https://github.com/MERIL2026/EVENIA-", demo: "https://meril2026.github.io/EVENIA-/" },
      priority: 5,
      category: "Full Stack"
    },
    {
      title: "ComicVerse",
      subtitle: "Modern Comic & Manga E-Commerce Platform",
      features: [
        "Comic & Manga Store",
        "Secure User Authentication",
        "Shopping Cart & Wishlist",
        "Responsive Modern UI"
      ],
      tech: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB"
      ],
      image: "/comicverse.png",
      links: {
        github: "https://github.com/MERIL2026/comicverse-store",
        demo: "https://meril2026.github.io/comicverse-store/"
      },
      priority: 4,
      category: "E-Commerce / Web Development"
    },
    {
      title: "Unreal Engine Forest Environment",
      subtitle: "3D / Game Development",
      features: ["Photorealistic Foliage", "Dynamic Day/Night Cycle", "Lumen Real-time GI", "Landscape Sculpting", "Water System Physics"],
      tech: ["Unreal Engine 5", "Nanite", "Lumen", "Quixel Megascans", "Post Processing"],
      image: "/unreal-forest.jpg",
      links: { github: "https://github.com/MERIL2026/predator-badlands-unreal", demo: "https://github.com/MERIL2026/predator-badlands-unreal" },
      priority: 4,
      category: "3D / Game Development"
    },
    {
      title: "Gym Management Platform",
      subtitle: "Full Stack + AI Fitness Tracker",
      features: ["AI Workout Planning", "Progress Tracking", "Membership Billing", "Smart QR Gate Entry", "Diet Recommendation Engine"],
      tech: ["React", "Node.js", "Express", "PostgreSQL", "Gemini API"],
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop",
      links: { github: "#", demo: "#" },
      priority: 4,
      category: "Full Stack + AI"
    }
  ],
  experience: [
    { role: "Founder", company: "Pixel Forge", date: "2025-Present" },
    { role: "President", company: "TechTronix Club", date: "2024-Present" },
    { role: "Freelance Developer", company: "Self-Employed", date: "2023-Present" }
  ],
  services: [
    {
      title: "Website Development",
      features: ["React/Next.js Apps", "High Performance", "Custom Design", "SEO Optimized"]
    },
    {
      title: "AI Solutions",
      features: ["Custom Chatbots", "Agentic Workflows", "API Integration", "Process Automation"]
    },
    {
      title: "IoT Systems",
      features: ["ESP32/Arduino", "Sensor Networks", "Cloud Dashboards", "Hardware Prototyping"]
    }
  ],
  beyondCode: [
    { title: "Full Stack Development", icon: "Globe", desc: "Crafting end-to-end web architectures, responsive interfaces, and scalable databases." },
    { title: "Artificial Intelligence", icon: "Cpu", desc: "Integrating Gemini, OpenAI, custom voice recognition, LLM memory systems, and computer vision." },
    { title: "Automation", icon: "Zap", desc: "Designing desktop automation scripts, custom bots, and scheduled task workflows." },
    { title: "IoT Systems", icon: "Radio", desc: "Engineering physical hardware systems, ESP32/Arduino chips, and Li-Fi communications." },
    { title: "Unreal Engine", icon: "Gamepad", desc: "Developing immersive, real-time 3D forest landscapes, cinematic renderings, and game levels." },
    { title: "UI/UX Design", icon: "Palette", desc: "Prototyping responsive grids, brutalist typography, and bespoke interactive user experiences." },
    { title: "Problem Solving", icon: "Brain", desc: "Deconstructing complex code limitations and architecture bottlenecks with clean algorithms." },
    { title: "Startup Building", icon: "Rocket", desc: "Leading Pixel Forge as founder, launching agency products, and defining product roadmaps." },
    { title: "Community Leadership", icon: "Users", desc: "Serving as President of TechTronix Club, organizing tech events, and mentoring aspiring developers." }
  ],
  futureProjects: [
    { title: "Advanced Unreal Engine Environments", desc: "Dynamic weather simulations and interactive volumetric foliage setups." },
    { title: "Robotics projects", desc: "Self-navigating micro-rovers powered by computer vision and local sensory models." },
    { title: "AI-powered 3D experiences", desc: "Interactive Spline scenes linked to real-time agent responses." },
    { title: "VR/AR prototypes", desc: "Spatial design environments for interactive 3D level curation." },
    { title: "Interactive architectural visualization", desc: "High-fidelity virtual reality walkthroughs using Lumen real-time lighting." },
    { title: "Multiplayer game prototypes", desc: "Server-authoritative networking for sandbox survival game loops." }
  ],
  certificates: [
    {
      title: "Genrative AI Mastermind",
      issuer: "Outskill",
      date: "2024",
      credentialId: "CERT-001",
      image: "/outskill.jpeg",
      color: "orange" as const
    },
    {
      title: "INTERNSHIP",
      issuer: "YRSD OVERGEAR INTERACTIVE",
      date: "2025",
      credentialId: "CERT-002",
      image: "/yrsd.jpeg",
      color: "white" as const
    },
    {
      title: "AI Assistant ",
      issuer: "WsCube Tech",
      date: "2025",
      credentialId: "CERT-003",
      image: "/w3cube.jpeg",
      color: "orange" as const
    },
    {
      title: "TechExpo 2026",
      issuer: "Parul University",
      date: "2026",
      credentialId: "CERT-004",
      image: "/techexpo2025.jpeg",
      color: "white" as const
    },
    {
      title: "Claude Code 101 ",
      issuer: "Anthropic",
      date: "2026",
      credentialId: "CERT-005",
      image: "/claudcode.jpeg",
      color: "orange" as const
    },
    {
      title: "Red Hat System Administration",
      issuer: "Red Hat",
      date: "2026",
      credentialId: "CERT-006",
      image: "/redhat certificate.jpeg",
      color: "white" as const
    }
  ],
  badges: [
    {
      title: "Red Hat Badge",
      issuer: "Red Hat System Administration",
      date: "2026",
      image: "/redhat badge.jpeg",
      verifyUrl: "#"
    }
  ]
};
