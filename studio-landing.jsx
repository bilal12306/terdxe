import { useEffect, useRef } from "react";
import { ArrowUpRight, Play, Zap, Palette, BarChart3, Shield } from "lucide-react";
import { motion, useInView } from "motion/react";

// ── Global styles ──────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body { background: #000; color: #fff; overflow-x: hidden; }

.font-heading { font-family: 'Instrument Serif', Georgia, serif !important; }
.font-body    { font-family: 'Barlow', system-ui, sans-serif !important; }

.liquid-glass {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-strong {
  background: rgba(255,255,255,0.01);
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.5) 0%,
    rgba(255,255,255,0.2) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.2) 80%,
    rgba(255,255,255,0.5) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.nav-link:hover { background: rgba(255,255,255,0.08); }
.btn-ghost:hover { opacity: 0.85; }
a { text-decoration: none; }

video { display: block; }
`;

// ── HLS Video ──────────────────────────────────────────────────────────────────
function HLSVideo({ src, className = "", style = {}, desaturate = false }) {
  const videoRef = useRef(null);
  const hlsRef   = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    function initHls(HlsClass) {
      if (HlsClass.isSupported()) {
        const hls = new HlsClass({ autoStartLoad: true, startLevel: -1 });
        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(HlsClass.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      }
    }

    // Safari native HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.play().catch(() => {});
      return;
    }

    // Already loaded
    if (window.Hls) { initHls(window.Hls); return; }

    // Load hls.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.4.10/hls.min.js";
    script.onload = () => window.Hls && initHls(window.Hls);
    document.head.appendChild(script);

    return () => { hlsRef.current?.destroy(); };
  }, [src]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={{ ...(desaturate ? { filter: "saturate(0)" } : {}), ...style }}
    />
  );
}

// ── BlurText ───────────────────────────────────────────────────────────────────
function BlurText({ text, style = {}, className = "", delay = 100 }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });

  return (
    <span ref={ref} className={className} style={{ display: "block", ...style }}>
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.27em" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{ delay: i * (delay / 1000), duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ── Shared tokens ──────────────────────────────────────────────────────────────
const sectionPad = { padding: "80px 48px" };
const badgeStyle = {
  borderRadius: 9999, padding: "5px 14px", fontSize: 12,
  color: "white", fontWeight: 500, display: "inline-block",
};
const headingStyle = {
  fontStyle: "italic", color: "white", lineHeight: 0.88,
  letterSpacing: "-2.5px", marginTop: 16,
};
const bodyStyle = {
  color: "rgba(255,255,255,0.60)", fontWeight: 300,
  fontSize: 15, lineHeight: 1.65,
};
const glassBtn = {
  borderRadius: 9999, padding: "10px 22px", color: "white",
  fontSize: 14, fontWeight: 500, cursor: "pointer",
  display: "inline-flex", alignItems: "center", gap: 6,
  background: "transparent", border: "none",
};
const whiteBtn = {
  borderRadius: 9999, padding: "10px 22px",
  background: "white", color: "black",
  fontSize: 14, fontWeight: 500, cursor: "pointer",
  border: "none",
};
const fadeTop = {
  position: "absolute", top: 0, left: 0, right: 0, height: 200,
  background: "linear-gradient(to bottom, black, transparent)",
  zIndex: 1, pointerEvents: "none",
};
const fadeBottom = {
  position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
  background: "linear-gradient(to top, black, transparent)",
  zIndex: 1, pointerEvents: "none",
};
const centerCol = {
  display: "flex", flexDirection: "column",
  alignItems: "center", textAlign: "center",
};

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 16, left: 0, right: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 64px",
    }}>
      {/* Logo mark */}
      <div style={{
        width: 48, height: 48, borderRadius: 14, overflow: "hidden",
        background: "rgba(255,255,255,0.12)", display: "flex",
        alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
      }}>
        <span className="font-heading" style={{ fontSize: 22, fontStyle: "italic", color: "white", lineHeight: 1 }}>S</span>
      </div>

      {/* Nav pill */}
      <div className="liquid-glass" style={{ borderRadius: 9999, padding: "4px 6px", display: "flex", alignItems: "center", gap: 2 }}>
        {["Home", "Services", "Work", "Process", "Pricing"].map(l => (
          <a key={l} href="#" className="nav-link font-body"
            style={{ padding: "8px 12px", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", borderRadius: 9999, transition: "background 0.18s" }}>
            {l}
          </a>
        ))}
        <a href="#" className="font-body" style={{
          padding: "7px 16px", fontSize: 13, fontWeight: 500,
          background: "white", color: "black", borderRadius: 9999,
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
          Get Started <ArrowUpRight size={13} />
        </a>
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", height: 1000, overflow: "visible" }}>
      {/* Background video */}
      <video autoPlay loop muted playsInline
        style={{ position: "absolute", left: 0, top: "20%", width: "100%", height: "auto", objectFit: "contain", zIndex: 0 }}
        poster="/images/hero_bg.jpeg">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" />
      </video>

      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.05)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 300, background: "linear-gradient(to bottom, transparent, black)", zIndex: 1, pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, height: "100%", ...centerCol, paddingTop: 150, padding: "150px 24px 0" }}>
        {/* Badge */}
        <motion.div
          className="liquid-glass"
          style={{ borderRadius: 9999, padding: "4px", marginBottom: 36, display: "inline-flex", alignItems: "center", gap: 8 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <span className="font-body" style={{ background: "white", color: "black", borderRadius: 9999, padding: "3px 12px", fontSize: 11, fontWeight: 600 }}>New</span>
          <span className="font-body" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, paddingRight: 10 }}>Introducing AI-powered web design.</span>
        </motion.div>

        {/* Heading */}
        <BlurText text="The Website Your Brand Deserves" delay={100} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(3.2rem, 7.5vw, 5.5rem)", maxWidth: 680, textAlign: "center", marginBottom: 28, letterSpacing: "-4px" }} />

        {/* Subtext */}
        <motion.p className="font-body"
          style={{ ...bodyStyle, maxWidth: 480, textAlign: "center", marginBottom: 36, color: "rgba(255,255,255,0.80)" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.65 }}>
          Stunning design. Blazing performance. Built by AI, refined by experts. This is web design, wildly reimagined.
        </motion.p>

        {/* CTAs */}
        <motion.div style={{ display: "flex", gap: 12, alignItems: "center" }}
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.65 }}>
          <button className="liquid-glass-strong font-body" style={glassBtn}>
            Get Started <ArrowUpRight size={14} />
          </button>
          <button className="btn-ghost font-body" style={{ background: "transparent", border: "none", color: "white", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "opacity 0.2s" }}>
            <Play size={13} fill="white" strokeWidth={0} /> Watch the Film
          </button>
        </motion.div>

        {/* Partners */}
        <div style={{ marginTop: "auto", paddingBottom: 32, paddingTop: 64, ...centerCol, gap: 20 }}>
          <div className="liquid-glass font-body" style={{ ...badgeStyle, color: "rgba(255,255,255,0.60)", fontSize: 11 }}>
            Trusted by the teams behind
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            {["Stripe", "Vercel", "Linear", "Notion", "Figma"].map(n => (
              <span key={n} className="font-heading" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", fontStyle: "italic", color: "rgba(255,255,255,0.90)" }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── StartSection ───────────────────────────────────────────────────────────────
function StartSection() {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <HLSVideo src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={fadeTop} />
      <div style={fadeBottom} />

      <div style={{ position: "relative", zIndex: 10, minHeight: 560, ...centerCol, justifyContent: "center", padding: "100px 48px", gap: 22 }}>
        <div className="liquid-glass font-body" style={badgeStyle}>How It Works</div>

        <BlurText text="You dream it. We ship it." delay={110} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(2.6rem, 6vw, 4.5rem)", textAlign: "center" }} />

        <p className="font-body" style={{ ...bodyStyle, maxWidth: 460, textAlign: "center" }}>
          Share your vision. Our AI handles the rest—wireframes, design, code, launch. All in days, not quarters.
        </p>

        <button className="liquid-glass-strong font-body" style={{ ...glassBtn, padding: "12px 28px" }}>
          Get Started <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}

// ── FeaturesChess ──────────────────────────────────────────────────────────────
function FeaturesChess() {
  const rows = [
    {
      title: "Designed to convert. Built to perform.",
      body: "Every pixel is intentional. Our AI studies what works across thousands of top sites—then builds yours to outperform them all.",
      cta: "Learn more",
      gif: "https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif",
      reverse: false,
    },
    {
      title: "It gets smarter. Automatically.",
      body: "Your site evolves on its own. AI monitors every click, scroll, and conversion—then optimizes in real time. No manual updates. Ever.",
      cta: "See how it works",
      gif: "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
      reverse: true,
    },
  ];

  return (
    <section style={{ ...sectionPad, maxWidth: 1160, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ ...centerCol, gap: 12, marginBottom: 72 }}>
        <div className="liquid-glass font-body" style={badgeStyle}>Capabilities</div>
        <BlurText text="Pro features. Zero complexity." delay={100} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", textAlign: "center" }} />
      </div>

      {rows.map((row, i) => (
        <div key={i} style={{
          display: "flex", flexDirection: row.reverse ? "row-reverse" : "row",
          gap: 56, alignItems: "center", marginBottom: i === 0 ? 72 : 0,
          flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 20 }}>
            <h3 className="font-heading" style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontStyle: "italic", color: "white", lineHeight: 1.1 }}>
              {row.title}
            </h3>
            <p className="font-body" style={{ ...bodyStyle }}>{row.body}</p>
            <button className="liquid-glass-strong font-body" style={{ ...glassBtn, width: "fit-content" }}>
              {row.cta} <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="liquid-glass" style={{ flex: 1, minWidth: 280, borderRadius: 18, overflow: "hidden", minHeight: 320 }}>
            <img src={row.gif} alt="Feature preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      ))}
    </section>
  );
}

// ── FeaturesGrid ───────────────────────────────────────────────────────────────
const FEATURES = [
  { Icon: Zap,      title: "Days, Not Months",     body: "Concept to launch at a pace that redefines fast. Because waiting isn't a strategy." },
  { Icon: Palette,  title: "Obsessively Crafted",  body: "Every detail considered. Every element refined. Design so precise, it feels inevitable." },
  { Icon: BarChart3,title: "Built to Convert",     body: "Layouts informed by data. Decisions backed by performance. Results you can measure." },
  { Icon: Shield,   title: "Secure by Default",    body: "Enterprise-grade protection comes standard. SSL, DDoS mitigation, compliance. All included." },
];

function FeaturesGrid() {
  return (
    <section style={{ ...sectionPad, maxWidth: 1160, margin: "0 auto" }}>
      <div style={{ ...centerCol, gap: 12, marginBottom: 56 }}>
        <div className="liquid-glass font-body" style={badgeStyle}>Why Us</div>
        <BlurText text="The difference is everything." delay={100} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", textAlign: "center" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 22 }}>
        {FEATURES.map(({ Icon, title, body }) => (
          <div key={title} className="liquid-glass" style={{ borderRadius: 18, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="liquid-glass-strong" style={{ width: 42, height: 42, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={17} color="white" />
            </div>
            <h4 className="font-heading" style={{ fontSize: 22, fontStyle: "italic", color: "white", lineHeight: 1.15 }}>{title}</h4>
            <p className="font-body" style={{ ...bodyStyle, fontSize: 14 }}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Stats ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: "200+",   label: "Sites launched" },
  { value: "98%",    label: "Client satisfaction" },
  { value: "3.2x",   label: "More conversions" },
  { value: "5 days", label: "Average delivery" },
];

function Stats() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "80px 48px" }}>
      <HLSVideo src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        desaturate style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={fadeTop} />
      <div style={fadeBottom} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 940, margin: "0 auto" }}>
        <div className="liquid-glass" style={{ borderRadius: 28, padding: "56px 64px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, textAlign: "center" }}>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading" style={{ fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontStyle: "italic", color: "white", lineHeight: 1 }}>{value}</div>
                <div className="font-body" style={{ color: "rgba(255,255,255,0.55)", fontWeight: 300, fontSize: 13, marginTop: 10, letterSpacing: "0.02em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "A complete rebuild in five days. The result outperformed everything we'd spent months building before.", name: "Sarah Chen",  role: "CEO, Luminary" },
  { quote: "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",  name: "Marcus Webb", role: "Head of Growth, Arcline" },
  { quote: "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",        name: "Elena Voss",  role: "Brand Director, Helix" },
];

function Testimonials() {
  return (
    <section style={{ ...sectionPad, maxWidth: 1160, margin: "0 auto" }}>
      <div style={{ ...centerCol, gap: 12, marginBottom: 52 }}>
        <div className="liquid-glass font-body" style={badgeStyle}>What They Say</div>
        <BlurText text="Don't take our word for it." delay={100} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(2rem, 4.5vw, 3.5rem)", textAlign: "center" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 22 }}>
        {TESTIMONIALS.map(({ quote, name, role }) => (
          <div key={name} className="liquid-glass" style={{ borderRadius: 18, padding: "34px 30px", display: "flex", flexDirection: "column", gap: 22, justifyContent: "space-between" }}>
            <p className="font-body" style={{ color: "rgba(255,255,255,0.78)", fontWeight: 300, fontSize: 14, fontStyle: "italic", lineHeight: 1.75 }}>
              "{quote}"
            </p>
            <div>
              <div className="font-body" style={{ color: "white", fontWeight: 500, fontSize: 13 }}>{name}</div>
              <div className="font-body" style={{ color: "rgba(255,255,255,0.45)", fontWeight: 300, fontSize: 12, marginTop: 3 }}>{role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CtaFooter ──────────────────────────────────────────────────────────────────
function CtaFooter() {
  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <HLSVideo src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={fadeTop} />
      <div style={fadeBottom} />

      <div style={{ position: "relative", zIndex: 10, ...centerCol, padding: "130px 48px 60px", gap: 26 }}>
        <BlurText text="Your next website starts here." delay={110} className="font-heading"
          style={{ ...headingStyle, fontSize: "clamp(3rem, 7vw, 5.5rem)", textAlign: "center", maxWidth: 720, letterSpacing: "-3px" }} />

        <p className="font-body" style={{ ...bodyStyle, maxWidth: 460, textAlign: "center" }}>
          Book a free strategy call. See what AI-powered design can do. No commitment, no pressure. Just possibilities.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="liquid-glass-strong font-body" style={{ ...glassBtn, padding: "12px 28px" }}>
            Book a Call <ArrowUpRight size={14} />
          </button>
          <button className="font-body" style={{ ...whiteBtn, padding: "12px 28px" }}>
            View Pricing
          </button>
        </div>

        {/* Footer bar */}
        <div style={{
          marginTop: 120, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.10)",
          width: "100%", maxWidth: 1060,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <span className="font-body" style={{ color: "rgba(255,255,255,0.38)", fontSize: 12 }}>
            © 2026 Studio. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 28 }}>
            {["Privacy", "Terms", "Contact"].map(l => (
              <a key={l} href="#" className="font-body btn-ghost" style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, transition: "opacity 0.18s" }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "studio-global-css";
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);

    // Set dark background on root
    document.body.style.background = "#000";
    document.body.style.margin = "0";

    return () => {
      document.getElementById("studio-global-css")?.remove();
    };
  }, []);

  return (
    <div style={{ background: "#000", minHeight: "100vh", color: "#fff", overflowX: "hidden" }}>
      <Navbar />

      <Hero />

      {/* Below-fold sections */}
      <div style={{ background: "#000" }}>
        <StartSection />
        <FeaturesChess />
        <FeaturesGrid />
        <Stats />
        <Testimonials />
        <CtaFooter />
      </div>
    </div>
  );
}
