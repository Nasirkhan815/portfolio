const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. DYNAMIC ENV LOADING (Manually read .env.local to support standard node execution without dependencies)
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found at " + envPath);
  console.error("Please ensure you have configured your Supabase environment variables.");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local!");
  process.exit(1);
}

console.log("⚡ Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log("\n🚀 Starting Database Seeding...\n");

  // =========================================================================
  // 1. SEED SITE SETTINGS
  // =========================================================================
  console.log("⚙️  Seeding 'site_settings'...");
  const siteSettings = {
    id: 'site_settings',
    title: 'Nasir Khan | Premium UI/UX Designer & CG Artist',
    description: 'Portfolio website of Nasir Khan, a Senior UI/UX Designer and 3D CG Artist with 10+ years of certified experience. Bridging the gap between artistic CGI rendering and functional user experiences.',
    logo_url: '/logo.png',
    email: 'nasir.khan815@gmail.com',
    phone: '',
    whatsapp_url: 'https://wa.me/923459037885',
    linkedin_url: 'https://www.linkedin.com/in/nasirkhan-uiux/',
    github_url: 'https://github.com',
    address: 'Axis Craft Studio, Pakistan',
    resume_url: ''
  };

  const { error: siteError } = await supabase
    .from('site_settings')
    .upsert(siteSettings);

  if (siteError) console.error("❌ Error seeding site_settings:", siteError.message);
  else console.log("✅ 'site_settings' seeded successfully.");


  // =========================================================================
  // 2. SEED HERO SETTINGS
  // =========================================================================
  console.log("🎬 Seeding 'hero_settings'...");
  const heroSettings = {
    id: 'hero_settings',
    badge: 'Senior Designer & CG Artist',
    name: 'Nasir Khan',
    description: "Hi, I'm Nasir Khan. Over the past 10 years, I've designed interactive user experiences and modeled immersive 3D CG visual assets. I bridge the boundary between artistic CGI rendering and functional UX architecture.",
    image_url: '/images/nasir-portrait.png',
    roles: ['Senior UI/UX Designer', 'Product Designer', 'Graphic Designer', '3D CG Artist'],
    experience_badge: '10+ Years Certified',
    rating_badge: '5.0 ⭐',
    projects_badge: '150+',
    cards_config: {
      scene_layers: {
        visible: true,
        title: 'Scene Layers',
        item1_text: 'CGI_Render_Final',
        item1_label: '3D',
        item2_text: 'UI_Layer_Kit',
        item2_label: 'Figma'
      },
      visual_score: {
        visible: true,
        title: 'Visual Score',
        value: '5.0',
        growth: '+4.2%'
      },
      studio: {
        visible: true,
        title: 'Axis Craft Studio',
        badge: '10+ Years Certified',
        reviews_label: 'REVIEWS',
        reviews_value: '5.0 ⭐',
        projects_label: 'PROJECTS',
        projects_value: '150+'
      }
    },
    social_links: [
      { icon: 'globe', url: 'https://Axis-Craft.com', visible: true },
      { icon: 'linkedin', url: 'https://www.linkedin.com/in/nasirkhan-uiux/', visible: true },
      { icon: 'mail', url: 'mailto:nasir.khan815@gmail.com', visible: true }
    ],
    status: 'published'
  };

  const { error: heroError } = await supabase
    .from('hero_settings')
    .upsert(heroSettings);

  if (heroError) console.error("❌ Error seeding hero_settings:", heroError.message);
  else console.log("✅ 'hero_settings' seeded successfully.");


  // =========================================================================
  // 3. SEED ABOUT SETTINGS
  // =========================================================================
  console.log("📖 Seeding 'about_settings'...");
  const aboutSettings = {
    id: 'about_settings',
    subtitle: 'Visual Architect',
    title: 'Bridging Artistic CGI Expression with Pixel-Perfect Product UX',
    paragraphs: [
      "Hi, I'm Nasir Khan. Over the past 10 years, I've functioned as a Senior UI/UX Designer, Product Designer, Graphic Layout Architect, and 3D CG Artist. I established my visual studio brand Artixor to build spatial interactive digital models and responsive software frameworks.",
      "My creative philosophy relies on two cores: absolute functional simplicity in user experience and hyper-realistic aesthetic rendering in visual branding. I believe a digital interface must be as responsive and accessible as it is stunning to look at.",
      "From formulating extensive typography guides and interactive design systems in Figma to building complex lighting schemas, texturing visual maps, and rendering real-time cinematic visuals in Blender and Unity 3D — I deliver a unified visual signature."
    ],
    stats: [
      { icon: "Award", value: "10+", label: "Years Experience", color: "text-neon-purple", desc: "Crafting digital systems since 2016." },
      { icon: "Layers", value: "150+", label: "Projects Finished", color: "text-neon-pink", desc: "UX interfaces, 3D CGI & graphics." },
      { icon: "Users", value: "100+", label: "Happy Clients", color: "text-neon-blue", desc: "Corporate agencies & startups globally." },
      { icon: "Zap", value: "99%", label: "Client Satisfaction", color: "text-neon-emerald", desc: "Consistently highly rated ratings." }
    ],
    status: 'published'
  };

  const { error: aboutError } = await supabase
    .from('about_settings')
    .upsert(aboutSettings);

  if (aboutError) console.error("❌ Error seeding about_settings:", aboutError.message);
  else console.log("✅ 'about_settings' seeded successfully.");


  // =========================================================================
  // 4. SEED SKILLS
  // =========================================================================
  console.log("🛠️  Seeding 'skills'...");
  
  // First, clear existing to prevent duplicates
  await supabase.from('skills').delete().neq('name', 'placeholder');

  const skillsList = [
    // UI/UX & Graphic Design
    {
      name: "Figma",
      category: "design",
      level: "Master",
      description: "UI Systems, Auto-Layout, Variables & Prototyping",
      glow: "group-hover:border-[#0ACF83]/40 group-hover:shadow-[0_0_30px_-5px_rgba(10,207,131,0.15)]",
      icon_bg: "bg-[#0ACF83]/10 text-[#0ACF83]",
      tag_color: "text-[#0ACF83] bg-[#0ACF83]/10 border-[#0ACF83]/20",
      order_number: 1,
      status: "published"
    },
    {
      name: "Photoshop",
      category: "design",
      level: "Expert",
      description: "High-end CGI texturing, masking, & graphic compositing",
      glow: "group-hover:border-[#31A8FF]/40 group-hover:shadow-[0_0_30px_-5px_rgba(49,168,255,0.15)]",
      icon_bg: "bg-[#31A8FF]/10 text-[#31A8FF]",
      tag_color: "text-[#31A8FF] bg-[#31A8FF]/10 border-[#31A8FF]/20",
      order_number: 2,
      status: "published"
    },
    {
      name: "Illustrator",
      category: "design",
      level: "Expert",
      description: "Bespoke vector illustrations, logo assets & guides",
      glow: "group-hover:border-[#FF9A00]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,154,0,0.15)]",
      icon_bg: "bg-[#FF9A00]/10 text-[#FF9A00]",
      tag_color: "text-[#FF9A00] bg-[#FF9A00]/10 border-[#FF9A00]/20",
      order_number: 3,
      status: "published"
    },
    {
      name: "InDesign",
      category: "design",
      level: "Advanced",
      description: "Editorial layout, typography scales, & print standards",
      glow: "group-hover:border-[#FF1493]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,20,147,0.15)]",
      icon_bg: "bg-[#FF1493]/10 text-[#FF1493]",
      tag_color: "text-[#FF1493] bg-[#FF1493]/10 border-[#FF1493]/20",
      order_number: 4,
      status: "published"
    },
    {
      name: "Adobe XD",
      category: "design",
      level: "Expert",
      description: "Vector layouts, wireframes & customer interaction maps",
      glow: "group-hover:border-[#FF26BE]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,38,190,0.15)]",
      icon_bg: "bg-[#FF26BE]/10 text-[#FF26BE]",
      tag_color: "text-[#FF26BE] bg-[#FF26BE]/10 border-[#FF26BE]/20",
      order_number: 5,
      status: "published"
    },
    {
      name: "CorelDRAW",
      category: "design",
      level: "Advanced",
      description: "Precision vector grids, vector tracing & layout tools",
      glow: "group-hover:border-[#00B050]/40 group-hover:shadow-[0_0_30px_-5px_rgba(0,176,80,0.15)]",
      icon_bg: "bg-[#00B050]/10 text-[#00B050]",
      tag_color: "text-[#00B050] bg-[#00B050]/10 border-[#00B050]/20",
      order_number: 6,
      status: "published"
    },
    // 3D CGI & Motion
    {
      name: "Blender 3D",
      category: "cgi",
      level: "Master",
      description: "3D hard-surface modeling, CGI texturing & lighting",
      glow: "group-hover:border-[#EA7600]/40 group-hover:shadow-[0_0_30px_-5px_rgba(234,118,0,0.15)]",
      icon_bg: "bg-[#EA7600]/10 text-[#EA7600]",
      tag_color: "text-[#EA7600] bg-[#EA7600]/10 border-[#EA7600]/20",
      order_number: 7,
      status: "published"
    },
    {
      name: "Unity 3D",
      category: "cgi",
      level: "Advanced",
      description: "Real-time visual setups, shaders, & XR simulations",
      glow: "group-hover:border-[#222c37]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.08)]",
      icon_bg: "bg-white/10 text-white",
      tag_color: "text-white bg-white/5 border-white/10",
      order_number: 8,
      status: "published"
    },
    {
      name: "After Effects",
      category: "cgi",
      level: "Expert",
      description: "Keyframe motion choreography & dynamic UI animations",
      glow: "group-hover:border-[#cf96fd]/40 group-hover:shadow-[0_0_30px_-5px_rgba(207,150,253,0.15)]",
      icon_bg: "bg-[#cf96fd]/10 text-[#cf96fd]",
      tag_color: "text-[#cf96fd] bg-[#cf96fd]/10 border-[#cf96fd]/20",
      order_number: 9,
      status: "published"
    },
    {
      name: "Premiere Pro",
      category: "cgi",
      level: "Expert",
      description: "Cinematic cuts, sound tracks, & video presentation",
      glow: "group-hover:border-[#ea7bfa]/40 group-hover:shadow-[0_0_30px_-5px_rgba(234,123,250,0.15)]",
      icon_bg: "bg-[#ea7bfa]/10 text-[#ea7bfa]",
      tag_color: "text-[#ea7bfa] bg-[#ea7bfa]/10 border-[#ea7bfa]/20",
      order_number: 10,
      status: "published"
    },
    // Web Development
    {
      name: "HTML",
      category: "web",
      level: "Expert",
      description: "Semantic structures, SEO layouts & DOM standards",
      glow: "group-hover:border-[#E34F26]/40 group-hover:shadow-[0_0_30px_-5px_rgba(227,79,38,0.15)]",
      icon_bg: "bg-[#E34F26]/10 text-[#E34F26]",
      tag_color: "text-[#E34F26] bg-[#E34F26]/10 border-[#E34F26]/20",
      order_number: 11,
      status: "published"
    },
    {
      name: "CSS",
      category: "web",
      level: "Expert",
      description: "Responsive CSS variable architectures & animations",
      glow: "group-hover:border-[#1572B6]/40 group-hover:shadow-[0_0_30px_-5px_rgba(21,114,182,0.15)]",
      icon_bg: "bg-[#1572B6]/10 text-[#1572B6]",
      tag_color: "text-[#1572B6] bg-[#1572B6]/10 border-[#1572B6]/20",
      order_number: 12,
      status: "published"
    },
    // Productivity & Collaboration
    {
      name: "Notion",
      category: "collab",
      level: "Expert",
      description: "Database setup, project tracking, & design templates",
      glow: "group-hover:border-[#ffffff]/20 group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.05)]",
      icon_bg: "bg-white/10 text-white",
      tag_color: "text-white bg-white/5 border-white/10",
      order_number: 13,
      status: "published"
    },
    {
      name: "Trello",
      category: "collab",
      level: "Expert",
      description: "Kanban task boards, design workflow, & team hand-offs",
      glow: "group-hover:border-[#0079BF]/40 group-hover:shadow-[0_0_30px_-5px_rgba(0,121,191,0.15)]",
      icon_bg: "bg-[#0079BF]/10 text-[#0079BF]",
      tag_color: "text-[#0079BF] bg-[#0079BF]/10 border-[#0079BF]/20",
      order_number: 14,
      status: "published"
    },
    {
      name: "Google Slides",
      category: "collab",
      level: "Master",
      description: "High-end corporate layouts, pitch decks & guidelines",
      glow: "group-hover:border-[#FBBC05]/40 group-hover:shadow-[0_0_30px_-5px_rgba(251,188,5,0.15)]",
      icon_bg: "bg-[#FBBC05]/10 text-[#FBBC05]",
      tag_color: "text-[#FBBC05] bg-[#FBBC05]/10 border-[#FBBC05]/20",
      order_number: 15,
      status: "published"
    },
    {
      name: "Miro",
      category: "collab",
      level: "Expert",
      description: "User journey flowcharts, mind maps & brainstorming",
      glow: "group-hover:border-[#FFD02F]/40 group-hover:shadow-[0_0_30px_-5px_rgba(255,208,47,0.15)]",
      icon_bg: "bg-[#FFD02F]/10 text-[#FFD02F]",
      tag_color: "text-[#FFD02F] bg-[#FFD02F]/10 border-[#FFD02F]/20",
      order_number: 16,
      status: "published"
    }
  ];

  const { error: skillsError } = await supabase
    .from('skills')
    .insert(skillsList);

  if (skillsError) console.error("❌ Error seeding skills:", skillsError.message);
  else console.log(`✅ ${skillsList.length} skills seeded successfully.`);


  // =========================================================================
  // 5. SEED PROJECTS
  // =========================================================================
  console.log("🎨 Seeding 'projects'...");
  
  // Clear existing
  await supabase.from('projects').delete().neq('title', 'placeholder');

  const projectsList = [
    {
      title: "Artixor Design Services Website",
      category: "web",
      description: "A premium responsive web application built to showcase design systems, high-fidelity layouts, CGI render portfolios, and responsive interfaces with deep obsidian styles.",
      tools: ["Figma", "Next.js", "Framer Motion", "Tailwind CSS"],
      image_url: "/images/ai-crm.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: true,
      order_number: 1,
      status: "published"
    },
    {
      title: "ZNMR.pk Fashion Store",
      category: "web",
      description: "An elegant, luxurious e-commerce storefront for a modern high-end fashion brand. Implements responsive grids, seamless visual transitions, and conversion checkout structures.",
      tools: ["Figma", "Shopify Engine", "Responsive CSS", "Photoshop"],
      image_url: "/images/spatial-map.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: true,
      order_number: 2,
      status: "published"
    },
    {
      title: "247_365 Muslim App",
      category: "uiux",
      description: "A serene, highly accessible daily companion mobile application interface featuring prayer tracks, Quranic layout systems, and clean Islamic minimalist elements.",
      tools: ["Figma UI Library", "Adobe Illustrator", "Journey Maps"],
      image_url: "/images/web3-vault.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: true,
      order_number: 3,
      status: "published"
    },
    {
      title: "Laundry App UI Design",
      category: "uiux",
      description: "A modern, vibrant mobile interface for an on-demand dry cleaning services application. Incorporates map order tracking, step-progress stages, and micro-animations.",
      tools: ["Figma Prototyping", "Adobe XD", "After Effects Motion"],
      image_url: "/images/ai-crm.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: false,
      order_number: 4,
      status: "published"
    },
    {
      title: "AI Background Remover App",
      category: "uiux",
      description: "A utility application mockup displaying automatic neural image cutouts, active crop layers, custom background presets, and vector layout configurations.",
      tools: ["Figma UI Components", "Adobe Photoshop CC", "Visual Grids"],
      image_url: "/images/spatial-map.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: false,
      order_number: 5,
      status: "published"
    },
    {
      title: "Real Estate Marketing Designs",
      category: "graphics",
      description: "High-impact visual promotional identity bundles, social media banners, vector print collateral, and advertising structures crafted for real estate projects.",
      tools: ["Adobe Photoshop CC", "Adobe Illustrator", "InDesign Layouts"],
      image_url: "/images/web3-vault.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: false,
      order_number: 6,
      status: "published"
    },
    {
      title: "Brand Identity Systems",
      category: "graphics",
      description: "Cohesive brand visual styling kits, responsive logo blueprints, custom stationery mockups, typography palettes, and unified collateral matrices for corporate firms.",
      tools: ["Adobe Illustrator", "Photoshop", "Brand Guidelines"],
      image_url: "/images/ai-crm.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: false,
      order_number: 7,
      status: "published"
    },
    {
      title: "Packaging Design Portfolio",
      category: "graphics",
      description: "Bespoke structural box packaging shapes, textured 3D product rendering coordinates, procedural shaders, and tactile label assets for natural organic items.",
      tools: ["Blender 3D", "Cinema 4D Rendering", "Photoshop Shaders"],
      image_url: "/images/spatial-map.png",
      case_study_url: "https://artixor.com",
      live_url: "https://artixor.com",
      featured: false,
      order_number: 8,
      status: "published"
    }
  ];

  const { error: projectsError } = await supabase
    .from('projects')
    .insert(projectsList);

  if (projectsError) console.error("❌ Error seeding projects:", projectsError.message);
  else console.log(`&amp;amp;amp;amp;#9989; ${projectsList.length} projects seeded successfully.`);


  // =========================================================================
  // 6. SEED SERVICES
  // =========================================================================
  console.log("💼 Seeding 'services'...");
  
  // Clear existing
  await supabase.from('services').delete().neq('title', 'placeholder');

  const servicesList = [
    {
      title: "UI/UX & Product Design",
      description: "Crafting beautiful high-fidelity component layouts, interactive micro-animations, design system kits, and accessible digital architectures built to convert.",
      icon: "Layout",
      features: ["Figma & FigJam Prototyping", "Design System Development", "User Flows & Wireframing", "Conversion Rate Optimization"],
      glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)] group-hover:border-neon-purple/40",
      order_number: 1,
      status: "published"
    },
    {
      title: "3D CGI & Cinematic Art",
      description: "Designing hyper-realistic 3D CGI visual models, detailed lighting setups, textured environments, and high-impact cinematic rendering outputs.",
      icon: "Palette",
      features: ["High-fidelity 3D Modeling (Blender/C4D)", "Advanced Shading & Texturing", "Cinematic CGI Lighting", "Unreal Engine 5 Real-Time Rendering"],
      glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] group-hover:border-neon-blue/40",
      order_number: 2,
      status: "published"
    },
    {
      title: "Brand Identity & Layouts",
      description: "Establishing robust, cohesive brand identity kits, modern typography standards, typography guides, and vector graphic layouts that stand the test of time.",
      icon: "Sparkles",
      features: ["Brand Logo & Style Guides", "Modern Typography Layouts", "Marketing Layouts & Visuals", "Vector Illustration Suites"],
      glow_color: "group-hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] group-hover:border-neon-pink/40",
      order_number: 3,
      status: "published"
    }
  ];

  const { error: servicesError } = await supabase
    .from('services')
    .insert(servicesList);

  if (servicesError) console.error("❌ Error seeding services:", servicesError.message);
  else console.log(`✅ ${servicesList.length} services seeded successfully.`);


  // =========================================================================
  // 7. SEED EXPERIENCE
  // =========================================================================
  console.log("⏳ Seeding 'experience'...");
  
  // Clear existing
  await supabase.from('experience').delete().neq('company', 'placeholder');

  const experienceList = [
    {
      year: "2024 - Present",
      role: "Senior UX/UI & Product Designer",
      company: "Artixor Studio",
      description: "Directing high-fidelity mobile & desktop interactive user experience layouts. Managed brand architecture projects for international clients, designed comprehensive enterprise dashboard grids, and oversaw 3D visual campaigns.",
      type: "work",
      tech: ["Figma", "FigJam", "Web Design", "Brand Identity", "Interaction Design"],
      order_number: 1,
      status: "published"
    },
    {
      year: "2021 - 2024",
      role: "Lead 3D CG Artist & Graphic Designer",
      company: "Apex Vision Agency",
      description: "Designed realistic 3D CGI product environments and cinematic models. Authored visual layouts for advertising networks, generated lighting/texture visual maps, and constructed optimized real-time visual modules in Blender/Unreal Engine.",
      type: "work",
      tech: ["Blender", "Cinema 4D", "Unreal Engine 5", "After Effects", "Photoshop"],
      order_number: 2,
      status: "published"
    },
    {
      year: "2018 - 2021",
      role: "Product & Interface Designer",
      company: "Creative Flow Labs",
      description: "Engineered responsive website mockups, visual graphics, and typography libraries. Collaborated with front-end developers to transition Figma mockups to pixel-perfect responsive HTML/CSS structures.",
      type: "work",
      tech: ["Figma", "Adobe Illustrator", "HTML/CSS", "Typography", "Wireframing"],
      order_number: 3,
      status: "published"
    },
    {
      year: "2014 - 2018",
      role: "B.A. in Visual Communication & Digital Art",
      company: "National Academy of Arts",
      description: "Graduated with first-class honors. Specialized coursework in typography layout theories, human-centered UI principles, 3D graphics rendering, and cinema production.",
      type: "education",
      tech: [],
      order_number: 4,
      status: "published"
    }
  ];

  const { error: expError } = await supabase
    .from('experience')
    .insert(experienceList);

  if (expError) console.error("❌ Error seeding experience:", expError.message);
  else console.log(`✅ ${experienceList.length} experience entries seeded successfully.`);


  // =========================================================================
  // 8. SEED TESTIMONIALS
  // =========================================================================
  console.log("💬 Seeding 'testimonials'...");
  
  // Clear existing
  await supabase.from('testimonials').delete().neq('name', 'placeholder');

  const testimonialsList = [
    {
      quote: "Nasir Khan's capability to orchestrate high-fidelity interface systems in Figma while modeling cinematic 3D CGI renderings in Blender has completely transformed our product visual signature. He blends functional UX with stunning graphics.",
      name: "Sarah Jenkins",
      role: "Creative Design Director",
      company: "Apex Creative Agencies",
      initials: "SJ",
      color: "from-neon-purple to-neon-pink",
      order_number: 1,
      status: "published"
    },
    {
      quote: "Working with Nasir on our SaaS dashboard redesign was exceptionally fluid. His wireframing methodology, typography hierarchy systems, and comprehensive hand-off guidelines saved our engineering team weeks of implementation time.",
      name: "David Chen",
      role: "Product Co-Founder",
      company: "VibeFlow Tech Systems",
      initials: "DC",
      color: "from-neon-blue to-neon-purple",
      order_number: 2,
      status: "published"
    },
    {
      quote: "The 3D product rendering loops Nasir modeled in Unreal Engine 5 were stunning. He has an eye for lighting, texture, and procedural shading. He is a multi-disciplinary design force who respects project hand-off guidelines.",
      name: "Marcus Vance",
      role: "Creative Visual Lead",
      company: "CyberLabs Studio Agency",
      initials: "MV",
      color: "from-neon-pink to-neon-blue",
      order_number: 3,
      status: "published"
    }
  ];

  const { error: testError } = await supabase
    .from('testimonials')
    .insert(testimonialsList);

  if (testError) console.error("❌ Error seeding testimonials:", testError.message);
  else console.log(`✅ ${testimonialsList.length} testimonials seeded successfully.`);

  console.log("\n💎 Database Seeding Finished Successfully! Your portfolio website is ready. 💎\n");
}

seedDatabase();
