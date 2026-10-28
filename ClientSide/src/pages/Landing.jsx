import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Command,
  Image as ImageIcon,
  Layers3,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  Video,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: WandSparkles, number: '01', title: 'One creative workspace', text: 'Move from the first idea to a polished result without juggling disconnected tools.', tone: 'lime' },
  { icon: ImageIcon, number: '02', title: 'AI image studio', text: 'Explore original visual concepts from a prompt, then refine the direction that feels right.', tone: 'coral' },
  { icon: Video, number: '03', title: 'Video generation', text: 'Bring motion into your creative process from the same focused workspace.', tone: 'blue' },
  { icon: Code2, number: '04', title: 'Build with AI', text: 'Shape ideas into useful code and bring the pieces of your project together.', tone: 'yellow' },
  { icon: Layers3, number: '05', title: 'Projects that stay organized', text: 'Keep your creative work together, so the next step is always easy to find.', tone: 'purple' },
  { icon: ShieldCheck, number: '06', title: 'A workspace that stays yours', text: 'Your projects live in your account, in a workspace built around your work.', tone: 'lime' },
];

const steps = [
  { number: '01', title: 'Bring an idea', text: "Start with a prompt, a project, or a rough direction. It doesn't need to be perfect." },
  { number: '02', title: 'Make it yours', text: 'Generate, explore, and refine your work in one place, at your own pace.' },
  { number: '03', title: 'Keep building', text: "Save your work in projects and return whenever you're ready for the next iteration." },
];

const plans = [
  { name: 'Starter', detail: 'A focused start for exploring your ideas.', callout: 'Start free', features: ['Your creative workspace', 'Project organization', 'AI creative tools', 'Standard generation queue'] },
  { name: 'Pro', detail: 'More room for ambitious creative work.', callout: 'For creators', features: ['Everything in Starter', 'More generation capacity', 'Faster generation queue', 'Early access to new features'], popular: true },
  { name: 'Enterprise', detail: 'A flexible workspace for your team.', callout: 'For teams', features: ['Everything in Pro', 'Team-ready workspace', 'Flexible usage options', 'Dedicated onboarding'] },
];

const faqs = [
  { question: 'What is SketchFlow AI?', answer: 'SketchFlow AI is a creative workspace for managing projects and exploring AI-assisted images, videos, and code.' },
  { question: 'Do I need design or coding experience?', answer: 'No. Start with a prompt or project idea, then refine it as you go. You can use the workspace without being a designer or developer.' },
  { question: 'Can I use it for different kinds of projects?', answer: 'Yes. Organize multiple projects and use the creative tools that fit each one, from visual concepts to code.' },
  { question: 'Can I change my plan later?', answer: 'Plan details and availability can change. Sign in to see the options currently available for your account.' },
];

function Reveal({ children, direction = 'left', className = '' }) {
  return <div className={`reveal reveal-${direction} ${className}`}>{children}</div>;
}

// ═══════════════════════════════════════════════
// NEW ROBOT VISUAL (Replaces WorkspaceArtwork)
// ═══════════════════════════════════════════════
function RobotVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto flex w-full max-w-[500px] items-center justify-center lg:max-w-[600px]"
    >
      <div className="absolute inset-0 rounded-full bg-[#00E5FF]/20 blur-[100px]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute h-[300px] w-[300px] rounded-full border border-[#00E5FF]/20 border-t-[#00E5FF] border-r-transparent sm:h-[400px] sm:w-[400px]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute h-[360px] w-[360px] rounded-full border border-[#38BDF8]/10 border-b-[#38BDF8] border-l-transparent sm:h-[480px] sm:w-[480px]"
      />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
          style={{ top: `${20 + i * 15}%`, left: `${15 + (i % 2) * 70}%` }}
        />
      ))}

      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-2 flex flex-col items-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-3 w-3 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]"
          />
          <div className="h-6 w-1 bg-gradient-to-b from-[#00E5FF] to-transparent" />
        </div>

        <div className="relative flex h-[180px] w-[200px] flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#1A1A1A] to-[#050505] p-6 shadow-2xl shadow-[#00E5FF]/20">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="relative flex h-[100px] w-[140px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#0A0A0A]">
            <motion.div
              animate={{ y: [-50, 50, -50] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#00E5FF]/20 to-transparent"
            />
            <div className="relative flex gap-6">
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
                className="h-6 w-3 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]"
              />
              <motion.div
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2] }}
                className="h-6 w-3 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]"
              />
            </div>
          </div>
          <div className="absolute left-0 top-1/2 h-10 w-2 -translate-y-1/2 rounded-r-md bg-[#00E5FF]/40" />
          <div className="absolute right-0 top-1/2 h-10 w-2 -translate-y-1/2 rounded-l-md bg-[#00E5FF]/40" />
        </div>

        <div className="relative mt-2 flex h-12 w-[120px] items-center justify-center rounded-b-2xl border border-t-0 border-white/10 bg-[#0A0A0A]">
          <div className="h-1.5 w-12 rounded-full bg-white/10" />
          <div className="absolute -left-6 h-8 w-4 rounded-full border border-white/10 bg-[#050505]" />
          <div className="absolute -right-6 h-8 w-4 rounded-full border border-white/10 bg-[#050505]" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute -right-4 bottom-10 z-20 flex w-56 flex-col gap-3 rounded-2xl border border-white/10 bg-[#0A0A0A]/90 p-4 shadow-2xl backdrop-blur-xl sm:-right-12 sm:bottom-20"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00E5FF]/20">
            <Sparkles size={12} className="text-[#00E5FF]" />
          </div>
          <span className="text-[10px] font-bold text-white">SketchBot AI</span>
          <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
        <div className="rounded-xl rounded-tl-sm border border-white/5 bg-white/[0.03] p-2.5 text-[11px] leading-relaxed text-gray-300">
          I've generated the brand assets for you. Want to see the variations?
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 items-center rounded-full bg-white/5 px-2 text-[9px] text-gray-400">Yes, show me</div>
          <div className="flex h-5 items-center rounded-full bg-white/5 px-2 text-[9px] text-gray-400">Edit prompt</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -left-4 top-10 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0A0A0A]/90 px-3 py-2 shadow-xl backdrop-blur-xl sm:-left-12 sm:top-20"
      >
        <Zap size={14} className="text-[#00E5FF]" />
        <span className="text-[10px] font-bold text-white">Generating...</span>
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const targets = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <main className="site-shell">
      <header className="site-header">
        <nav className="nav-wrap">
          <Link to="/" className="wordmark">
            <span className="brand-mark"><Sparkles size={17} strokeWidth={2.2} /></span>
            <span>SketchFlow<span className="wordmark-ai"> AI</span></span>
          </Link>

          {/* ✅ Navbar links font size barha aur font weight medium kiya */}
          <div className="desktop-links" style={{ fontSize: '17px', fontWeight: '500' }}>
            <a href="#features">The workspace</a>
            <a href="#how-it-works">How it works</a>
            <a href="#pricing">Plans</a>
            <a href="#faq">FAQ</a>
          </div>

          <Link to="/login" className="nav-cta">
            Explore plans <ArrowRight size={15} />
          </Link>

          <button type="button" className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {mobileOpen && (
          <div className="mobile-menu">
            <a href="#features" onClick={closeMenu}>The workspace <ArrowRight size={16} /></a>
            <a href="#how-it-works" onClick={closeMenu}>How it works <ArrowRight size={16} /></a>
            <a href="#pricing" onClick={closeMenu}>Plans <ArrowRight size={16} /></a>
            <a href="#faq" onClick={closeMenu}>FAQ <ArrowRight size={16} /></a>
            <Link to="/register" className="mobile-menu-cta" onClick={closeMenu}>Find your plan <ArrowRight size={16} /></Link>
          </div>
        )}
      </header>

      <section className="hero-section" id="top">
        <div className="hero-grid" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow hero-enter-left">
              <span className="eyebrow-dot" /> THE CREATIVE SPACE BETWEEN IDEA & DONE
            </div>
            <h1 className="hero-title hero-enter-left">
              Make room<br />for <em>what’s next.</em>
            </h1>
            <p className="hero-description hero-enter-left">
              One place to think it, make it, and keep it moving. Turn rough ideas into images, video, and code without breaking your creative flow.
            </p>
            <div className="hero-actions hero-enter-left">
              <a href="#how-it-works" className="button-primary">Find your flow <ArrowRight size={17} /></a>
              <a href="#features" className="text-link">
                <span className="play-icon"><Play size={12} fill="currentColor" /></span> Take a look around
              </a>
            </div>
            <div className="hero-footnote hero-enter-left">
              <span className="footnote-line" /> For the curious, the makers, the work-in-progress people.
            </div>
          </div>

          <div className="hero-visual hero-enter-right flex items-center justify-center">
            <RobotVisual />
          </div>

          <div className="hero-index">SF—01 <span>CREATIVE SYSTEM</span></div>
        </div>

        <a className="scroll-cue" href="#features">
          <span>SCROLL TO EXPLORE</span> <ArrowDownRight size={17} />
        </a>
      </section>

      <div className="marquee-band">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <span className="marquee-group" key={group}>
              <span>IDEAS INTO IMAGES</span><i />
              <span>MOTION WITH MEANING</span><i />
              <span>CODE THAT CONNECTS</span><i />
              <span>ONE PLACE TO MAKE</span><i />
            </span>
          ))}
        </div>
      </div>

      <section className="feature-section section-wrap" id="features">
        <div className="section-heading feature-heading">
          <Reveal direction="left">
            <div className="section-kicker"><span>01</span> THE WHOLE PROCESS</div>
            <h2>Less switching.<br /><em>More making.</em></h2>
          </Reveal>
          <Reveal direction="right" className="heading-aside">
            <p>Good ideas rarely stay in one medium. SketchFlow brings your creative tools and thinking into one focused workspace, from the first spark through the next iteration.</p>
            <a href="#how-it-works" className="arrow-link">See the process <ArrowRight size={16} /></a>
          </Reveal>
        </div>

        <div className="feature-showcase">
          <Reveal direction="left" className="showcase-visual">
            <div className="showcase-window">
              <div className="window-top">
                <div className="window-controls"><i /><i /><i /></div>
                <span className="window-path"><Command size={11} /> studio / workspace</span>
                <span className="window-live"><i /> IN FLOW</span>
              </div>
              <div className="prompt-bar">
                <WandSparkles size={14} /> <span>A warm modern identity for a tiny field journal</span> <span className="prompt-arrow">↗</span>
              </div>
              <div className="showcase-collage">
                <div className="collage-image">
                  <span className="collage-tag">IMAGE STUDY / 01</span>
                  <div className="collage-sun" /><div className="collage-arc" /><div className="collage-horizon" /><div className="collage-plant" />
                  <span className="collage-phrase">A slower<br />kind of day</span>
                </div>
                <div className="collage-video">
                  <span className="video-play"><Play size={15} fill="currentColor" /></span>
                  <span className="video-label">MOTION STUDY <b>0:08</b></span>
                </div>
                <div className="collage-code">
                  <div className="code-dots"><i /><i /><i /></div>
                  <code><b>const</b> FieldNote = () =&gt; (<br /><span> &lt;Moment /&gt;</span><br />);</code>
                  <span className="code-label">CODE SNIPPET / 02</span>
                </div>
              </div>
              <div className="window-footer">
                <span><i /> 3 directions in progress</span>
                <span>field-journal / project</span>
              </div>
            </div>
            <div className="showcase-stamp"><Sparkles size={14} /> ALL YOUR TOOLS, IN THEIR ELEMENT</div>
          </Reveal>

          <div className="feature-list">
            {features.map((feature, index) => (
              <Reveal key={feature.title} direction={index % 2 === 0 ? 'right' : 'left'} className={`feature-row feature-${feature.tone}`}>
                <span className="feature-number">{feature.number}</span>
                <span className="feature-icon"><feature.icon size={19} strokeWidth={1.7} /></span>
                <div className="feature-copy">
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
                <ArrowRight className="feature-arrow" size={16} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="feature-ribbon">
          <span>01 <b>One creative workspace</b></span>
          <span>02 <b>Tools that think together</b></span>
          <span>03 <b>Room for the next idea</b></span>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="workflow-inner section-wrap">
          <Reveal direction="left" className="workflow-intro">
            <div className="section-kicker"><span>02</span> A SIMPLER CREATIVE LOOP</div>
            <h2>Start anywhere.<br /><em>Keep moving.</em></h2>
            <p>No perfect brief required. SketchFlow gives your half-formed ideas a place to become something real.</p>
            <a href="#pricing" className="button-dark">Find your starting point <ArrowRight size={16} /></a>
          </Reveal>

          <div className="steps-list">
            {steps.map((step, index) => (
              <Reveal key={step.number} direction={index % 2 ? 'left' : 'right'} className="step-item">
                <div className="step-top"><span>{step.number}</span><span className="step-connector" /></div>
                {/* ✅ Step items ko clean sans-serif font diya */}
                <h3 style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '15px', lineHeight: '1.6' }}>
                  {step.text}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="workflow-quote">
            <span>Rough is a place<br />to <em>begin.</em></span><span className="quote-doodle">↗</span>
          </div>
        </div>
      </section>

      <section className="plans-section section-wrap" id="pricing">
        <Reveal direction="left" className="plans-heading">
          <div>
            <div className="section-kicker"><span>03</span> ROOM TO GROW</div>
            <h2>Choose your<br /><em>kind of making.</em></h2>
          </div>
          <p>Start with the space you need today. There’s a plan for a first experiment, a bigger creative practice, and a team finding its rhythm.</p>
        </Reveal>

        <div className="plan-grid">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} direction={index === 1 ? 'up' : index === 0 ? 'left' : 'right'} className={`plan-card ${plan.popular ? 'plan-featured' : ''}`}>
              {plan.popular && <span className="plan-ribbon"><Sparkles size={12} /> THE CREATOR’S PICK</span>}
              <div className="plan-topline"><span>PLAN / {String(index + 1).padStart(2, '0')}</span><span>{plan.name.toUpperCase()}</span></div>
              <h3>{plan.name}</h3>
              <p className="plan-detail">{plan.detail}</p>
              
              {/* ✅ Start free text ko bold aur italic kiya */}
              <div className="plan-callout" style={{ fontStyle: 'italic', fontWeight: '800', fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.01em' }}>
                {plan.callout}<ArrowRight size={15} />
              </div>
              
              <div className="plan-divider" />
              <ul>{plan.features.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              <a className={`plan-button ${plan.popular ? 'plan-button-dark' : ''}`} href="#faq">Explore {plan.name} <ArrowRight size={15} /></a>
            </Reveal>
          ))}
        </div>
        <p className="plan-note">Plan details and availability may change. See what’s available for your account.</p>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-inner section-wrap">
          <Reveal direction="left" className="faq-intro">
            <div className="section-kicker"><span>04</span> A FEW GOOD QUESTIONS</div>
            <h2>Before you<br /><em>make a move.</em></h2>
            <p>Wondering where to begin? Here are a few things worth knowing.</p>
            <a href="#top" className="arrow-link">Back to the beginning <ArrowRight size={16} /></a>
          </Reveal>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const expanded = openFaq === index;
              return (
                <div className={`faq-item ${expanded ? 'faq-open' : ''}`} key={faq.question}>
                  <button type="button" className="faq-question" onClick={() => setOpenFaq(expanded ? null : index)}>
                    <span className="faq-index">0{index + 1}</span>
                    <span>{faq.question}</span>
                    <ChevronDown size={18} className="faq-chevron" />
                  </button>
                  {expanded && <div className="faq-answer"><p>{faq.answer}</p></div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-mark"><Sparkles size={27} /></div>
        <Reveal direction="up">
          <div className="section-kicker"><span>THE NEXT THING STARTS HERE</span></div>
          <h2>Your ideas<br />have <em>somewhere to go.</em></h2>
          <p>Bring the rough draft. Leave with a next step.</p>
          <Link to="/register" className="button-primary closing-button">Make space to create <ArrowRight size={17} /></Link>
        </Reveal>
        <span className="closing-orbit orbit-a" /><span className="closing-orbit orbit-b" />
      </section>

      <footer className="site-footer">
        <Link to="/" className="wordmark footer-wordmark">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>SketchFlow<span className="wordmark-ai"> AI</span></span>
        </Link>
        <span className="footer-note">A little space for the big idea.</span>
        <div className="footer-links">
          <a href="#features">Workspace</a>
          <a href="#pricing">Plans</a>
          <a href="#faq">FAQ</a>
        </div>
        <span className="footer-copyright">© {new Date().getFullYear()} SketchFlow AI</span>
      </footer>
    </main>
  );
}