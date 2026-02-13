"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  MapPin,
  Users,
  Lightbulb,
  Shield,
  ArrowRight,
  ChevronDown,
  Compass,
  Globe,
  Zap,
  Heart,
  Star,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ───────── Section label (editorial style) ───────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-[11px] md:text-xs font-mono tracking-[0.25em] uppercase text-[#FC2869] mb-4"
    >
      {children}
    </motion.p>
  );
}

/* ───────── Animated counter for stats ───────── */
function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(0);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    // Extract number from string like "45M+" or "3.5"
    const numMatch = value.match(/[\d.]+/);
    if (!numMatch) {
      setCount(0);
      return;
    }

    const targetNum = parseFloat(numMatch[0]);
    const duration = 2000;
    const steps = 60;
    const increment = targetNum / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        setCount(targetNum);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  // Format the displayed value
  const displayValue = value.replace(/[\d.]+/, count.toFixed(value.includes(".") ? 1 : 0));

  return (
    <p ref={ref} className="font-serif text-4xl md:text-5xl text-[#1a1a1a]">
      {isInView ? displayValue : value}
    </p>
  );
}

/* ───────── Feature pillar card with 3D tilt ───────── */
function PillarCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]));
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(252, 40, 105, 0.1)" }}
      className="group text-center px-6 py-10 rounded-2xl border border-[#DDD8CC]/60 bg-white/60 backdrop-blur-sm transition-all duration-300 cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 360 }}
        transition={{ duration: 0.6 }}
        className="w-16 h-16 rounded-full border-2 border-[#FC2869]/30 flex items-center justify-center mx-auto mb-6 group-hover:border-[#FC2869] group-hover:bg-[#FC2869]/5 transition-all"
      >
        <Icon className="w-7 h-7 text-[#FC2869]" strokeWidth={1.5} />
      </motion.div>
      <h3 className="font-serif text-xl text-[#1a1a1a] mb-3 text-balance">
        {title}
      </h3>
      <p className="text-sm text-[#6B6558] leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ───────── Pain point item with animation ───────── */
function PainPoint({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index || 0) * 0.08 }}
      whileHover={{ x: 5 }}
      className="flex gap-4 items-start group cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.3 }}
        className="shrink-0 w-2 h-2 rounded-full bg-[#FC2869] mt-2"
      />
      <div>
        <span className="font-semibold text-[#FC2869] text-sm group-hover:underline decoration-[#FC2869]/30 underline-offset-2 transition-all">
          {title}
        </span>
        <span className="text-[#1a1a1a] text-sm ml-1">{description}</span>
      </div>
    </motion.div>
  );
}

/* ───────── Stat block with counter ───────── */
function StatBlock({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <AnimatedCounter value={number} />
      <p className="text-xs font-mono tracking-wider uppercase text-[#6B6558] mt-2">
        {label}
      </p>
    </motion.div>
  );
}

/* ───────── Locu Logo component ───────── */
function LocuLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/locu-logo.png"
      alt="Locu - The Backpacker OS"
      width={120}
      height={48}
      className={cn("h-auto", className)}
      priority
    />
  );
}

/* ═══════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════ */
export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9F7F1] text-[#1a1a1a] overflow-x-hidden">
      {/* ─── STICKY NAV ─── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="fixed top-0 inset-x-0 z-50 bg-[#F9F7F1]/90 backdrop-blur-md border-b border-[#DDD8CC]/50"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.a
            href="#"
            aria-label="Locu home"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LocuLogo className="w-[100px]" />
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {[
              { label: "Why Locu", href: "#problem" },
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "Demo", href: "/app" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -2 }}
                className="text-[#6B6558] hover:text-[#1a1a1a] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#FC2869] after:transition-all hover:after:w-full"
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 16px rgba(252, 40, 105, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 rounded-full bg-[#FC2869] text-white text-sm font-semibold hover:bg-[#e01f5b] transition-colors"
            >
              Join Waitlist
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#F9F7F1] border-t border-[#DDD8CC]/50 px-6 py-4 flex flex-col gap-4"
          >
            <a href="#problem" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#6B6558]">Why Locu</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#6B6558]">Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#6B6558]">How It Works</a>
            <a href="/app" onClick={() => setMobileMenuOpen(false)} className="text-sm text-[#6B6558]">Demo</a>
            <a href="#waitlist" onClick={() => setMobileMenuOpen(false)} className="px-5 py-2 rounded-full bg-[#FC2869] text-white text-sm font-semibold text-center">Join Waitlist</a>
          </motion.div>
        )}
      </motion.nav>

      {/* ─── HERO with animated gradient background ─── */}
      <section id="waitlist" className="relative pt-28 pb-20 md:pt-36 md:pb-28 px-6 overflow-hidden scroll-mt-20" >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FC2869]/10 to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#FC2869]/10 to-transparent blur-3xl"
          />
          <Image src="/landing/hero-bg.jpg" alt="" fill className="object-cover opacity-[0.04]" priority />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <SectionLabel>The Backpacker OS</SectionLabel>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance mb-6"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-[#FC2869] inline-block"
            >
              Adventure
            </motion.span>{" "}
            is exciting.
            <br />
            Logistics{" "}
            <span className="font-serif italic text-[#6B6558]">{"aren't."}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-[#6B6558] leading-relaxed max-w-xl mx-auto mb-10"
          >
            Locu removes the admin days from the adventure. Plan routes, book
            hostels, find safe transport, and travel with friends -- all from
            one beautiful app built for the new generation of travellers.
          </motion.p>

          {/* Waitlist form -- primary CTA */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              placeholder="your@email.com"
              aria-label="Email address for waitlist"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/80 border border-[#DDD8CC] text-[#1a1a1a] placeholder:text-[#6B6558]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC2869]/40 focus:border-[#FC2869]/40 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(252, 40, 105, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-7 py-3.5 rounded-full bg-[#FC2869] text-white font-semibold hover:bg-[#e01f5b] transition-colors shadow-lg shadow-[#FC2869]/20 whitespace-nowrap flex items-center justify-center gap-2 group"
            >
              Join Waitlist
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </motion.form>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-[#6B6558]/60 mb-8"
          >
            No spam. Just updates when we launch.
          </motion.p>

          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            href="#features"
            className="inline-flex items-center gap-2 text-sm text-[#6B6558] hover:text-[#1a1a1a] transition-colors group"
          >
            See how it works
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.a>
        </div>
      </section>

      {/* ─── SCROLLING TICKER ─── */}
      <div className="border-y border-[#DDD8CC]/60 bg-white/40 overflow-hidden py-4">
        <div className="flex animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              {[
                "Route Planning",
                "Hostel Booking",
                "Travel Pods",
                "Safety Alerts",
                "Budget Tracking",
                "Local Transport",
                "Traveller Intel",
                "Border Prep",
                "Visa Reminders",
                "Trip Narrative",
              ].map((item) => (
                <span key={`${i}-${item}`} className="text-xs font-mono tracking-[0.2em] uppercase text-[#6B6558]/60">
                  {item}
                  <span className="mx-4 text-[#FC2869]">{"///"}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── PROBLEM SECTION ─── */}
      <section id="problem" className="py-20 md:py-28 px-6 scroll-mt-20" >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <SectionLabel>The Problem</SectionLabel>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif text-3xl md:text-4xl text-balance mb-6"
          >
            Nobody has built a <span className="text-[#FC2869]">platform</span> for this new generation of travellers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#6B6558] text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Millennials and Gen Z are prioritising experiences over assets.
            They are spending their savings on extended, authentic travel and
            forging memories in the here and now. But their tools are inherited
            from the old world of tourism.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              title: "Pre-Trip Overload:",
              description: "You want the excitement of planning, but instead, you waste days stitching together fragmented blogs and booking sites, feeling stressed before the trip even begins.",
            },
            {
              title: "On-the-Road Chaos:",
              description: "Your adventure is constantly interrupted by logistical hurdles: the hassle of finding safe transport, dodging ATM fees, and managing last-minute changes.",
            },
            {
              title: "The Social Disconnect:",
              description: "Traveling with new friends is the best part of the experience, but trying to coordinate plans turns into a nightmare of messy WhatsApp groups and spreadsheets.",
            },
            {
              title: "Safety Anxiety:",
              description: "You want to explore freely, but relying on ad-hoc forums and outdated blogs for personal safety and border prep leaves you second-guessing your route.",
            },
            {
              title: "Unwelcome Surprises:",
              description: "Unknowns like when to take out cash, how far to book ahead, or missing a visa requirement sour the experience and cause constant, unnecessary stress.",
            },
          ].map((item, i) => (
            <PainPoint key={item.title} {...item} index={i} />
          ))}
        </div>
      </section>

      {/* ─── PRODUCT INTRO ─── */}
      <section className="py-20 md:py-28 px-6 bg-white/50 border-y border-[#DDD8CC]/40">
        <div className="max-w-5xl mx-auto text-center">
          <SectionLabel>Introducing</SectionLabel>

          {/* Real Locu logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/locu-logo.png"
              alt="Locu"
              width={280}
              height={112}
              className="w-[220px] md:w-[280px] h-auto"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-sm tracking-[0.2em] uppercase text-[#6B6558] mb-4"
          >
            The Backpacker OS
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg text-[#6B6558] leading-relaxed max-w-2xl mx-auto mb-16"
          >
            A new category of travel tech built to remove the admin days from the
            adventure. Go from a simple idea to a visualised, flexible route on
            your map in seconds.
          </motion.p>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Simplified Trip Planning",
                description: "Go from a simple idea to a visualised, flexible route on your map in seconds. Our Guide populates it with personalised hostel and transport options tailored to your travel style.",
              },
              {
                icon: Users,
                title: "Social Logistics, Streamlined",
                description: "Meet other travellers and form a 'Pod' to travel together. Seamlessly align itineraries with a tap, taking the chaos out of group planning.",
              },
              {
                icon: Lightbulb,
                title: "Live Traveller Intelligence",
                description: "Our platform gets smarter with every trip. Get useful insights including how far ahead to book, when to take out cash, and local transit options verified by real travellers.",
              },
            ].map((pillar, i) => (
              <PillarCard key={pillar.title} {...pillar} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE DEEP-DIVE: ITINERARY ─── */}
      <section id="features" className="py-20 md:py-28 px-6 scroll-mt-20" >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Your Journey, Visualised</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl mb-6 text-balance"
            >
              A living itinerary that <span className="text-[#FC2869]">adapts</span> to you
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B6558] leading-relaxed max-w-2xl mx-auto"
            >
              Tell our Guide your rough plan and watch it come to life on a
              beautiful interactive map. Every stop is populated with
              personalised hostel and transport options tailored to your travel
              style, budget, and context in the wider trip.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              "Visual map with all destinations, routes, and durations",
              "Personalised hostel recommendations at every stop",
              "Compare transport options with real traveller insights",
              "Easy to adjust as plans change on the road",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(16, 185, 129, 0.1)" }}
                className="flex items-start gap-3 text-sm p-4 rounded-xl border border-[#DDD8CC]/60 bg-white/60 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center mt-0.5 shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                </motion.div>
                <span className="text-[#1a1a1a]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURE: SOCIAL PODS ─── */}
      <section className="py-20 md:py-28 px-6 bg-white/50 border-y border-[#DDD8CC]/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Travel Together</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl mb-6 text-balance"
            >
              Solo travel does not mean <span className="text-[#FC2869]">lonely</span> travel
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B6558] leading-relaxed max-w-2xl mx-auto"
            >
              The vast majority of solo travellers are actively seeking
              connection. They form pods, share intel, and move together,
              creating powerful real-world network effects. Locu makes this
              effortless.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              "Form travel 'Pods' with friends you meet on the road",
              "Align itineraries with a tap -- no more WhatsApp chaos",
              "Book hostels together so your whole pod stays together",
              "Shared budgets, split costs, and group alerts",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, boxShadow: "0 4px 12px rgba(252, 40, 105, 0.1)" }}
                className="flex items-start gap-3 text-sm p-4 rounded-xl border border-[#DDD8CC]/60 bg-white/60 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.3 }}
                  className="w-5 h-5 rounded-full bg-[#FC2869]/10 flex items-center justify-center mt-0.5 shrink-0"
                >
                  <Heart className="w-3 h-3 text-[#FC2869]" strokeWidth={2} />
                </motion.div>
                <span className="text-[#1a1a1a]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE TRAVEL POD EXPERIENCE ─── */}
      <section className="py-20 md:py-28 px-6 border-b border-[#DDD8CC]/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl mb-6 text-balance"
            >
              From <span className="text-[#FC2869]">"Solo"</span> to <span className="text-[#FC2869]">"Travel Pod"</span> in Seconds
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B6558] leading-relaxed max-w-2xl mx-auto"
            >
              You met amazing people at the hostel. Don't let the headache of group logistics stop the adventure. Here is how Locu removes the friction of traveling together.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Sync Up */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(252, 40, 105, 0.12)" }}
              className="p-6 rounded-2xl border border-[#DDD8CC]/60 bg-white/80 backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-[#FC2869]/10 flex items-center justify-center mb-4"
              >
                <MapPin className="w-6 h-6 text-[#FC2869]" strokeWidth={2} />
              </motion.div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                1. Sync Up, No Spreadsheets Required
              </h3>
              <p className="text-[#6B6558] leading-relaxed text-sm">
                Decided to tackle the same hike? Just tap 'Align Plans' to securely overlay your itineraries. Locu visually shows where your routes cross and intelligently suggests the best dates to travel onward together.
              </p>
            </motion.div>

            {/* Card 2: Book-Ahead Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(251, 191, 36, 0.12)" }}
              className="p-6 rounded-2xl border border-[#F59E0B]/40 bg-gradient-to-br from-[#FFFBEB] to-white backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-4"
              >
                <Bell className="w-6 h-6 text-[#F59E0B]" strokeWidth={2} />
              </motion.div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                2. Smart 'Book-Ahead' Alerts
              </h3>
              <p className="text-[#6B6558] leading-relaxed text-sm mb-4">
                Locu actively monitors local demand and hostel capacities. If you form a Pod of three heading to a popular town during a festival, the app proactively prompts you:
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative rounded-lg border border-[#F59E0B]/30 bg-white px-3 py-2.5 text-xs"
              >
                <div className="flex items-start gap-2">
                  <Bell className="w-3.5 h-3.5 text-[#F59E0B] shrink-0 mt-0.5" strokeWidth={2} />
                  <p className="text-[#1a1a1a] leading-relaxed">
                    <span className="font-semibold">Book at least 5 days in advance</span> to guarantee beds in the same room.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Card 3: Nobody Gets Left Behind */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(16, 185, 129, 0.12)" }}
              className="p-6 rounded-2xl border border-[#10B981]/40 bg-gradient-to-br from-[#ECFDF5] to-white backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4"
              >
                <Users className="w-6 h-6 text-[#10B981]" strokeWidth={2} />
              </motion.div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-3">
                3. Nobody Gets Left Behind
              </h3>
              <p className="text-[#6B6558] leading-relaxed text-sm">
                When you find the perfect dorm, one person initiates the booking for the whole Pod. Everyone gets an instant ping to pay their own share within 10 minutes to secure the beds. No more fronting the cash, and no one accidentally books the wrong hostel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE: INTELLIGENCE ─── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Traveller Intelligence</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl mb-6 text-balance"
            >
              Intel from the <span className="text-[#FC2869]">road</span>, not a desk
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B6558] leading-relaxed max-w-2xl mx-auto"
            >
              Our platform gets smarter with every trip. Get hyper-local insights from real backpackers exactly when you need them—not outdated, SEO-optimised travel blogs written by someone from a co-working space in Bali.
            </motion.p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              "How far ahead to book hostels at each destination",
              "When and where to take out cash to avoid ATM fees",
              "Local transport options that aren't on Google Maps",
              "Safety tips and border crossing preparation",
              "Users are rewarded for contributing insights",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="flex items-start gap-3 text-sm p-4 rounded-xl border border-[#DDD8CC]/60 bg-white/60 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 72 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mt-0.5 shrink-0"
                >
                  <Star className="w-3 h-3 text-[#F59E0B]" strokeWidth={2} />
                </motion.div>
                <span className="text-[#1a1a1a]">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 bg-[#1a1a1a] text-white scroll-mt-20" >
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] md:text-xs font-mono tracking-[0.25em] uppercase text-[#FC2869] mb-4"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-4xl text-balance"
          >
            From overwhelmed to <span className="text-[#FC2869]">on the road</span> in minutes
          </motion.h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-0">
          {[
            {
              step: "01",
              title: "Set Your Preferences",
              description: "Tell us your travel style -- sustainability-focused, security-conscious, highly social. Set your budget and rough timeline.",
            },
            {
              step: "02",
              title: "Watch Your Route Come Alive",
              description: "Your provisional route is instantly visualised on the map, with destinations, transit routes, and durations at each location.",
            },
            {
              step: "03",
              title: "Book With Confidence",
              description: "Locu lays out all transport options clearly, highlighting local options with traveller-verified insights. Choose the best option and save money.",
            },
            {
              step: "04",
              title: "Travel With Your Pod",
              description: "After making friends on the road, form a Pod. Locu suggests aligned itineraries and prompts you to book ahead when it matters.",
            },
            {
              step: "05",
              title: "Relive the Journey",
              description: "Months after returning home, Locu generates a beautiful, shareable Trip Narrative from your journey data -- a dynamic digital journal of your adventure.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-6 items-start relative group"
            >
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-10 h-10 rounded-full border-2 border-[#FC2869] flex items-center justify-center bg-[#1a1a1a] group-hover:bg-[#FC2869] transition-colors"
                >
                  <span className="text-xs font-mono text-[#FC2869] group-hover:text-white transition-colors">{item.step}</span>
                </motion.div>
                {i < 4 && <div className="w-px h-16 border-l-2 border-dashed border-[#FC2869]/30" />}
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                className="pb-8"
              >
                <h3 className="font-semibold text-lg text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-lg">{item.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SAFETY + BOOKING FEATURE ─── */}
      <section className="py-20 md:py-28 px-6 border-b border-[#DDD8CC]/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Safe and Smart</SectionLabel>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-3xl md:text-4xl mb-6 text-balance"
            >
              Book smarter. <span className="text-[#FC2869]">Travel safer.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6B6558] leading-relaxed max-w-2xl mx-auto"
            >
              Locu brings together hostel booking, transport comparison, budget
              tracking, and safety intelligence in one unified experience.
              No more switching between five different apps and twenty browser tabs.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Shield, label: "Safety Toolkit", desc: "Emergency contacts, local safety tips" },
              { icon: Globe, label: "Border Prep", desc: "Visa docs, crossing info ahead of time" },
              { icon: Zap, label: "Smart Alerts", desc: "Timely reminders before you need them" },
              { icon: MapPin, label: "Local Intel", desc: "Transport, ATMs, and hidden gems" },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 rounded-xl border border-[#DDD8CC]/60 bg-white/60 text-center cursor-default"
              >
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                  <Icon className="w-5 h-5 text-[#FC2869] mb-2 mx-auto" strokeWidth={1.5} />
                </motion.div>
                <p className="text-sm font-semibold text-[#1a1a1a]">{feature.label}</p>
                <p className="text-xs text-[#6B6558] mt-1">{feature.desc}</p>
              </motion.div>
            );})}
          </div>
        </div>
      </section>

      {/* ─── STATS STRIP ─── */}
      <section className="py-16 px-6 border-b border-[#DDD8CC]/40">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatBlock number="45M+" label="Backpacker trips taken annually" />
          <StatBlock number="1 App" label="To replace your tabs, maps, and spreadsheets" />
          <StatBlock number="100%" label="Built by travellers, for travellers" />
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="py-20 md:py-28 px-6 bg-[#1a1a1a] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[11px] md:text-xs font-mono tracking-[0.25em] uppercase text-[#FC2869] mb-4"
          >
            Early Access
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-3xl md:text-5xl mb-6 text-balance"
          >
            Built for travellers, <span className="text-[#FC2869]">by travellers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 leading-relaxed mb-10 max-w-lg mx-auto"
          >
            Locu is currently in development. Join the waitlist to get early
            access, shape the product, and be part of the founding community of
            backpackers building the future of travel.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address for waitlist"
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC2869]/50 focus:border-[#FC2869]/50 transition-all"
            />
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 24px rgba(252, 40, 105, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-7 py-3.5 rounded-full bg-[#FC2869] text-white font-semibold hover:bg-[#e01f5b] transition-colors shadow-lg shadow-[#FC2869]/20 whitespace-nowrap"
            >
              Join Waitlist
            </motion.button>
          </motion.form>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xs text-white/30 mt-4"
          >
            No spam. Just updates when we launch.
          </motion.p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-[#DDD8CC]/40">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <motion.a
            href="#"
            aria-label="Locu home"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LocuLogo className="w-[80px]" />
          </motion.a>
          <p className="text-xs text-[#6B6558]">Locu - The Backpacker OS. Built with love from the road.</p>
          <div className="flex items-center gap-6 text-xs text-[#6B6558]">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ y: -2, color: "#1a1a1a" }}
                className="transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </footer>

      {/* ─── Scroll animation keyframe ─── */}
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
