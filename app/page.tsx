'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Lenis from 'lenis';

const services = [
  { title: 'Web Development', description: 'Crafting fast, accessible, and polished digital products with modern architecture.' },
  { title: 'UI/UX Design', description: 'Elegant interfaces that look premium and feel effortless across every device.' },
  { title: 'Brand Identity', description: 'Luxury visual systems that elevate brand stories and build trust instantly.' },
  { title: 'Motion Design', description: 'Cinematic movement and micro-interactions that bring every detail to life.' },
];

const projects = [
  { label: 'Ocean Atelier', theme: 'Immersive hospitality experience', accent: 'Deep cobalt motion and editorial photography.' },
  { label: 'Luxe Residence', theme: 'Architectural narrative for modern living', accent: 'Glass, stone, and cinematic pacing.' },
  { label: 'Signature Launch', theme: 'Product storytelling with premium motion', accent: 'Bold typography and luminous accents.' },
];

const testimonials = [
  { quote: 'This site feels like a magazine launch. Every interaction is polished and cinematic.', name: 'Ava Laurent', role: 'Creative Director' },
  { quote: 'The scroll-driven video made the experience unforgettable. The transition was seamless.', name: 'Noah Barnes', role: 'Brand Strategist' },
  { quote: 'A luxury digital experience with beautiful pacing and premium motion.', name: 'Mia Chen', role: 'Founder' },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const scrollProgressRef = useRef(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ projects: 0, clients: 0, years: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [videoAvailable, setVideoAvailable] = useState(true);

  useEffect(() => {
    let lenis: any;
    let pin: any;
    let fade: any;
    let ScrollTrigger: any;
    let seekRafId = 0;
    let onResize: (() => void) | null = null;

    async function init() {
      if (!heroRef.current || !videoRef.current || !overlayRef.current) return;

      const gsapModule = (await import('gsap')).default;
      const scrollTriggerModule = await import('gsap/ScrollTrigger');
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsapModule.registerPlugin(ScrollTrigger);

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      lenis = new Lenis({ duration: 1.2, lerp: 0.14, smoothWheel: true, autoRaf: true });
      lenis.on('scroll', ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.body, {
        scrollTop(value: number) {
          return arguments.length ? window.scrollTo(0, value as number) : window.scrollY;
        },
        getBoundingClientRect() {
          return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
      });

      const pinDistance = window.innerHeight * 1.3;

      pin = ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: `+=${pinDistance}`,
        pin: true,
        scrub: 0.8,
        onUpdate(self: any) {
          scrollProgressRef.current = self.progress;
          const video = videoRef.current;
          if (!video?.duration) return;

          const targetTime = Math.min(video.duration, self.progress * video.duration);

          cancelAnimationFrame(seekRafId);
          seekRafId = requestAnimationFrame(() => {
            try {
              video.currentTime = targetTime;
            } catch (e) {
              // ignore seek errors
            }
          });
        },
      });

      fade = gsapModule.to(overlayRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'bottom bottom',
          end: `+=${window.innerHeight * 0.8}`,
          scrub: true,
        },
      });

      onResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', onResize);
      ScrollTrigger.refresh();
    }

    init();

    return () => {
      if (onResize) window.removeEventListener('resize', onResize);
      cancelAnimationFrame(seekRafId);
      pin?.kill();
      fade?.kill();
      lenis?.destroy();
      ScrollTrigger?.getAll?.()?.forEach((instance: any) => instance.kill());
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const start = performance.now();
    const duration = 1400;
    const targets = { projects: 182, clients: 48, years: 11 };

    const animateCounters = (time: number) => {
      const t = Math.min(1, (time - start) / duration);
      setCounters({
        projects: Math.round(targets.projects * t),
        clients: Math.round(targets.clients * t),
        years: Math.round(targets.years * t),
      });
      if (t < 1) requestAnimationFrame(animateCounters);
    };

    requestAnimationFrame(animateCounters);
  }, [statsVisible]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5400);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="bg-ink text-white overflow-x-hidden selection:bg-fuchsia-500/30 selection:text-white">


      <section ref={heroRef} className="relative min-h-screen bg-black">
        <div ref={overlayRef} className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 overflow-hidden">
          {videoAvailable ? (
           <video
  ref={videoRef}
  className="absolute inset-0 h-full w-full object-cover"
  src="/Home.mp4"
  preload="auto"
  playsInline
  muted
  autoPlay
  controls={false}
  loop={false}
  onLoadedMetadata={() => {
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  }}
  onError={() => setVideoAvailable(false)}
/>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-center px-6">
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">Video asset unavailable</p>
                <h2 className="mt-4 text-3xl font-semibold text-white">Premium cinematic scroll experience</h2>
                <p className="mt-3 text-sm leading-6 text-white/70">Replace <span className="font-medium text-white">public/Home.mp4</span> with the original video file for full effect.</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-20 pt-16 sm:px-10 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.2 }} className="max-w-4xl">
            <p className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 backdrop-blur-xl">
              Premium Scroll Experience</p>
            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              Crafting Digital Experiences
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70 sm:text-xl">
              Every scroll reveals the story. A luxury digital journey built for immersive brand campaigns and premium attention.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-white/5 bg-[#07080d] py-24 sm:py-28">
        <div className="container mx-auto space-y-16 px-6 sm:px-10 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9 }} className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-300/80">About the experience</p>
            <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">A refined digital narrative built to move with every scroll.</h2>
            <p className="max-w-2xl text-base leading-8 text-white/70">From the pinned hero film to the content that follows, every section is designed for premium pacing, subtle depth, and a cinematic sense of luxury.</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {['Who we are', 'Our vision', 'What we build'].map((title, index) => (
              <motion.article key={title} initial={{ opacity: 0, y: 46 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, delay: index * 0.1 }} className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
                <span className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">{title}</span>
                <h3 className="mt-4 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/70">{title === 'Who we are' ? 'A boutique studio creating premium digital identities, cinematic motion, and immersive storytelling for high-end brands.' : title === 'Our vision' ? 'To bridge timeless luxury with modern interaction, creating experiences that feel both intimate and unforgettable.' : 'Web products, motion ecosystems, and visual systems with a strong sense of atmosphere and emotional depth.'}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#05060a] py-24 sm:py-28">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-12 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300/80">Services</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Design, development, and brand motion with a premium touch.</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service, index) => (
              <motion.article key={service.title} whileHover={{ y: -8, scale: 1.01 }} initial={{ opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7, delay: index * 0.08 }} className="group rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl transition-all duration-500 hover:border-fuchsia-400/30 hover:bg-white/7">
                <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70">{service.title}</div>
                <p className="mt-6 text-sm leading-7 text-white/70">{service.description}</p>
                <div className="mt-8 flex items-center gap-3 text-sm font-medium text-cyan-300 transition group-hover:text-white">
                  <span>Discover more</span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/5 bg-[#08090f] py-24 sm:py-28">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Featured projects</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Large-format showcases with horizontal flow and rich motion.</h2>
          </div>

          <div className="no-scrollbar -mx-6 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10">
            <div className="flex min-w-[120%] gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <motion.article key={project.label} whileHover={{ scale: 1.02 }} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, delay: index * 0.08 }} className="group min-w-[280px] shrink-0 rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl transition-all duration-500 hover:border-cyan-300/30 hover:bg-white/8 sm:min-w-[360px] lg:min-w-[420px]">
                  <div className="mb-5 h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-[#111827] to-[#0d1723]">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.2),transparent_22%),linear-gradient(180deg,rgba(15,23,42,0.9),rgba(5,8,20,0.98))] transition duration-500 group-hover:scale-105" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.35em] text-white/50">Project</span>
                  <h3 className="mt-4 text-3xl font-semibold text-white">{project.label}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/70">{project.theme}</p>
                  <p className="mt-6 text-sm text-cyan-200/80">{project.accent}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="bg-[#020205] py-24 sm:py-28">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-glass backdrop-blur-xl">
              <p className="text-5xl font-semibold text-white">{counters.projects}+</p>
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/50">Projects Completed</p>
            </div>
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-glass backdrop-blur-xl">
              <p className="text-5xl font-semibold text-white">{counters.clients}+</p>
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/50">Happy Clients</p>
            </div>
            <div className="rounded-[36px] border border-white/10 bg-white/5 p-10 shadow-glass backdrop-blur-xl">
              <p className="text-5xl font-semibold text-white">{counters.years}+</p>
              <p className="mt-4 text-sm uppercase tracking-[0.35em] text-white/50">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-[#06080d] py-24 sm:py-28">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Testimonials</p>
            <h2 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">A subtle, smooth carousel for client praise.</h2>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
            {testimonials.map((item, index) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: index === activeTestimonial ? 1 : 0, y: index === activeTestimonial ? 0 : 20 }} transition={{ duration: 0.8 }} className={`${index === activeTestimonial ? 'relative' : 'absolute inset-x-0 top-8 pointer-events-none'} mx-auto max-w-3xl`}>
                <p className="text-xl leading-9 text-white/80">“{item.quote}”</p>
                <div className="mt-8 flex flex-col gap-1 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="text-cyan-300">{item.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0c1120] py-24 sm:py-28">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300/80">Contact</p>
              <h2 className="text-4xl font-semibold text-white sm:text-5xl">Begin your next premium digital experience.</h2>
              <p className="max-w-xl text-base leading-8 text-white/70">Reach out with a brief summary of your project, and we’ll create a cinematic digital presence that feels luxurious and refined.</p>
            </div>
            <form className="space-y-6 rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl">
              {[
                { label: 'Name', type: 'text', name: 'name' },
                { label: 'Email', type: 'email', name: 'email' },
                { label: 'Project details', type: 'textarea', name: 'project' },
              ].map((field) => (
                <label key={field.name} className="group block relative">
                  {field.type === 'textarea' ? (
                    <textarea required rows={5} name={field.name} className="peer w-full rounded-3xl border border-white/10 bg-black/15 px-5 py-5 text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/10" />
                  ) : (
                    <input required type={field.type} name={field.name} className="peer w-full rounded-3xl border border-white/10 bg-black/15 px-5 py-5 text-white outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/10" />
                  )}
                  <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-sm text-white/60 transition-all duration-300 peer-focus:-translate-y-7 peer-focus:text-xs peer-valid:-translate-y-7 peer-valid:text-xs">{field.label}</span>
                </label>
              ))}
              <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-8 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black transition hover:brightness-110">
                Send message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
