// App.jsx
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Hls from "hls.js";
import { ArrowUpRight, Play, Zap, Palette, BarChart3, Shield } from "lucide-react";

export default function App() {
  return (
    <div className="bg-black text-white font-body">
      <Navbar />
      <Hero />
      <StartSection />
      <FeaturesChess />
      <FeaturesGrid />
      <Stats />
      <Testimonials />
      <CtaFooter />
    </div>
  );
}

function Navbar() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between">
      <img src="/logo-icon.png" className="h-12 w-12" />
      <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1 gap-2">
        {["Home", "Services", "Work", "Process", "Pricing"].map((item) => (
          <span key={item} className="px-3 py-2 text-sm text-white/90">{item}</span>
        ))}
        <button className="bg-white text-black rounded-full px-3.5 py-1.5 text-sm flex items-center gap-1">
          Get Started <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative h-[1000px] overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute top-[20%] w-full">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" />
      </video>

      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute bottom-0 h-[300px] w-full bg-gradient-to-b from-transparent to-black" />

      <div className="relative z-10 pt-[150px] text-center max-w-4xl mx-auto">
        <div className="liquid-glass rounded-full px-3 py-1 inline-block text-xs mb-6">
          Introducing AI-powered web design
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic leading-[0.8]">
          The Website Your Brand Deserves
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-white/70"
        >
          Stunning design. Blazing performance. Built by AI.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.1 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button className="liquid-glass-strong rounded-full px-6 py-3 flex gap-2 items-center">
            Get Started <ArrowUpRight />
          </button>
          <button className="flex items-center gap-2">
            <Play size={16} /> Watch the Film
          </button>
        </motion.div>
      </div>
    </section>
  );
}

function StartSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource("https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8");
      hls.attachMedia(videoRef.current);
    }
  }, []);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center text-center">
      <video ref={videoRef} autoPlay muted loop className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10">
        <h2 className="text-5xl font-heading italic">You dream it. We ship it.</h2>
        <p className="text-white/60 mt-4">AI builds everything in days.</p>
        <button className="liquid-glass-strong mt-6 px-6 py-3 rounded-full">Get Started</button>
      </div>
    </section>
  );
}

function FeaturesChess() {
  return (
    <section className="py-20 px-8 lg:px-16 space-y-20">
      <FeatureRow
        title="Designed to convert"
        text="AI builds high-performing sites"
        img="/feature-1.gif"
      />
      <FeatureRow
        reverse
        title="Gets smarter"
        text="Auto optimization"
        img="/feature-2.gif"
      />
    </section>
  );
}

function FeatureRow({ title, text, img, reverse }) {
  return (
    <div className={`flex flex-col lg:flex-row ${reverse && "lg:flex-row-reverse"} gap-12 items-center`}>
      <div className="flex-1">
        <h3 className="text-4xl font-heading italic">{title}</h3>
        <p className="text-white/60 mt-4">{text}</p>
      </div>
      <div className="flex-1 liquid-glass rounded-2xl overflow-hidden">
        <img src={img} />
      </div>
    </div>
  );
}

function FeaturesGrid() {
  const items = [
    { icon: Zap, title: "Days, Not Months" },
    { icon: Palette, title: "Obsessively Crafted" },
    { icon: BarChart3, title: "Built to Convert" },
    { icon: Shield, title: "Secure" },
  ];

  return (
    <section className="py-20 px-8 lg:px-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, i) => (
        <div key={i} className="liquid-glass rounded-2xl p-6">
          <div className="liquid-glass-strong w-10 h-10 rounded-full flex items-center justify-center mb-4">
            <item.icon size={16} />
          </div>
          <h4 className="font-heading italic text-xl">{item.title}</h4>
        </div>
      ))}
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 px-8 lg:px-16">
      <div className="liquid-glass rounded-3xl p-12 grid md:grid-cols-4 gap-6 text-center">
        {["200+", "98%", "3.2x", "5 days"].map((s) => (
          <div key={s}>
            <div className="text-5xl font-heading italic">{s}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 px-8 lg:px-16 grid md:grid-cols-3 gap-6">
      {["Amazing work", "4x conversions", "World-class"].map((t) => (
        <div key={t} className="liquid-glass rounded-2xl p-8 text-white/80 italic">
          {t}
        </div>
      ))}
    </section>
  );
}

function CtaFooter() {
  return (
    <section className="py-32 text-center">
      <h2 className="text-6xl font-heading italic">Your next website starts here.</h2>
      <div className="mt-8 flex justify-center gap-4">
        <button className="liquid-glass-strong px-6 py-3 rounded-full">Book a Call</button>
        <button className="bg-white text-black px-6 py-3 rounded-full">View Pricing</button>
      </div>
    </section>
  );
}
