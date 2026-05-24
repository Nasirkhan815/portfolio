# Axis Craft | Nasir Khan — UI/UX Designer & CG Artist Portfolio

A breathtaking, high-fidelity, interactive professional portfolio built for **Nasir Khan**, a Senior UI/UX Designer, Product Designer, Graphic Designer, and CG Artist with 10+ years of certified experience. Powered by **Axis Craft Studio**, this Next.js project showcases an immersive, high-performance web experience featuring premium cinematic animations, futuristic glassmorphism UI layouts, and deep 3D cursor-coordinate parallax tracking.

Live Preview: [https://Axis-Craft.com](https://Axis-Craft.com)

---

## 🛠️ The Tech Stack

This website is engineered for speed, responsiveness, and fluid interaction using modern cutting-edge web technologies:

* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) utilizing React 19 for optimal static generation, caching, and asset preloading.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) driving a unified custom dark-neon theme with hardware-accelerated grid overlays.
* **Animations**: [Framer Motion](https://www.framer.com/motion/) powering fluid coordinate spring mechanics, scroll-linked micro-interactions, split-word text reveals, and staggered card entrances.
* **Icons**: [Lucide React](https://lucide.dev/) supplying clean, lightweight vector icons.
* **Interactive Elements**: [Canvas Confetti](https://github.com/catdad/canvas-confetti) for validated transmission success explosions.

---

## ✨ Immersive Features

The portfolio is structured into **10 premium sections** optimized for readability, performance, and international client acquisition:

1. **Hero**: Futuristic cinematic entrance featuring slow-moving mesh gradients, drifting background stars, scroll wheel indicator, and word-by-word blur-to-clear headline reveals.
2. **Transparent 3D Portrait**: Features Nasir's high-resolution transparent portrait flanked by dual concentric rotating orbit rings, glowing ambient backing overlays, and floating dashboard cards (Figma Layers, Visual Metrics) drifting on independent spring mouse parallax layers.
3. **About**: Professional biography framing Nasir's certified creative philosophy paired with a structured 2x2 stats dashboard showing success metrics.
4. **Interactive Skills**: 16 custom-designed competency cards organized across interactive category filters (UI/UX, 3D/Motion, Web, Collaboration) with dynamic ratings, hover checkmarks, and glowing border sweeps.
5. **Services**: High-fidelity capability cards featuring mouse-coordinate driven 3D tilt physics and double-stacked spotlight outlines.
6. **Creative Process**: 5-step interactive creative workflow roadmap detailing research, wireframes, high-fidelity UI design, CGI rendering, and hand-off.
7. **Experience**: A scroll-linked vertical timeline tracking senior designer tenures and creative director milestones.
8. **Filterable Projects**: A fluid layout-spring masonry grid showcasing 8 certified case studies (web, graphics, packaging, CGI) with quick links to case studies and live demos.
9. **Testimonials**: A glassmorphic comment carousel displaying verified client reviews, star ratings, and slide transitions.
10. **Validated Contact**: Mobile-responsive magnetic communication nodes (Direct Email, WhatsApp, LinkedIn) paired with a validated transmission form that shakes on validation errors and fires a confetti canvas explosion on successful email send.

---

## 🚀 Getting Started Locally

Follow these quick commands to spin up the local development environment:

### Prerequisite

Make sure you have [Node.js](https://nodejs.org/) (v18.x or newer) installed.

### 1. Clone & Navigate

```bash
git clone https://github.com/your-username/portfolio.git
cd portfolio
```

### 2. Install Dependencies

Install the optimized packages using `npm`:

```bash
npm install
```

### 3. Run Development Server

Launch the Next.js local compiler:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the active terminal port) in your browser to inspect the application. The system supports full Hot Module Replacement (HMR) for instant changes.

### 4. Build for Production

To compile a minified, fully optimized static production build:

```bash
npm run build
```

The compiler will optimize images, perform TypeScript static typing audits, bundle assets, and export pre-rendered HTML routes to ensure lighting-fast initial load speeds. You can test the production build locally via:

```bash
npm run start
```

---

## ☁️ Deploying to Vercel

The portfolio is fully optimized for single-click deployments on the **Vercel Platform**:

### Standard Git Deployment

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Log in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New Project** and select your portfolio repository.
4. Vercel will automatically detect **Next.js** and apply optimal default settings:
   * **Build Command**: `next build`
   * **Output Directory**: `.next`
   * **Install Command**: `npm install`
5. Click **Deploy**. Vercel will compile the pages, spin up global edge servers, and generate your live deployment URL instantly.

---

## 📂 Project Architecture

```font
portfolio/
├── public/                 # Static assets (portraits, case study graphics, branding logos)
│   ├── images/
│   │   ├── logo.png        # Brand calligraphic green logo
│   │   └── nasir-portrait.png
│   └── logo.png
├── src/
│   ├── app/                # Next.js App Router (Layouts, Global Styles)
│   │   ├── globals.css     # Unified CSS variables & utility layers
│   │   ├── layout.tsx      # Global layouts & metadata headers
│   │   └── page.tsx        # Splash loader & main landing assembly
│   └── components/         # Reusable interactive components
│       ├── About.tsx
│       ├── Contact.tsx     # Magnetic social triggers & secure contact form
│       ├── Experience.tsx
│       ├── Footer.tsx
│       ├── Hero.tsx        # Frameless aspect-ratio portrait & parallax cards
│       ├── Magnetic.tsx    # Magnetic button spring physics wrapper
│       ├── Navbar.tsx      # Sticky responsive navigation bar
│       ├── Process.tsx
│       ├── Projects.tsx    # Responsive filterable masonry catalog
│       ├── Services.tsx    # 3D hover-tilt capabilities
│       ├── Skills.tsx      # Tab-filterable skill charts
│       ├── SpotlightCard.tsx # GPU cursor radial shine tracker
│       └── Testimonials.tsx
├── package.json
└── tsconfig.json
```

---

## 🎨 Branding Customs

This portfolio utilizes the custom **Axis Craft** design system branding tokens:
* **Primary Accent Color**: `#c8f31d` (Bright Neon-Lime Green)
* **Secondary Shader**: `#a2db0b` (Deep Neon-Lime)
* **High-Tech Secondary Accent**: `#06b6d4` (Neon Cyan/Blue)
* **Canvas Backdrop**: `#050508` (Obsidian Deep Obsidian Black)

---

Developed with 💎 by **Axis Craft Studio** for **Nasir Khan**. All rights reserved.
