import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

const LONG_TEXT_WORDS = "to help every guest leave looking better, feeling lighter, and living more fully — through considered rituals, attentive technique, and care offered with quiet warmth.".split(' ');

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  // Each element moves upward at a different speed — creates parallax depth
  // Portrait: moves DOWN + scales up (0→0.5), then exits upward (0.5→1)
  const portraitY     = useTransform(scrollYProgress, [0, 0.5, 1],  ["0vh",  "30vh", "22vh"]);
  const portraitX     = useTransform(scrollYProgress, [0, 0.5],     ["0vw",  "-19vw"]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5],     [1,      1.35]);
  // Description exits upward fast — clear the rising body text
  const teamInfoY   = useTransform(scrollYProgress, [0, 1], ["0vh", "-40vh"]);
  const goalTextY   = useTransform(scrollYProgress, [0, 1], ["0vh", "-70vh"]);
  const contentY    = useTransform(scrollYProgress, [0, 1], ["0vh", "-80vh"]);

  // Word reveal — single listener, avoids calling hooks in a loop
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const total = LONG_TEXT_WORDS.length;
    setRevealedCount(Math.max(0, Math.min(total,
      Math.floor((latest - 0.05) / 0.85 * total)
    )));
  });

  return (
    <section ref={sectionRef} id="about" className="relative z-10 w-full bg-bg-primary">

      {/* ── Desktop: sticky scroll-driven layout ── */}
      <div className="hidden lg:block h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Description text — between portrait and avatars */}
          <motion.div
            style={{ y: teamInfoY }}
            className="absolute top-[9%] left-[54%] w-[18%] z-10"
          >
            <p className="text-sm text-text-secondary">
              Decades of considered care, offered with warmth, discretion, and a
              quiet attention to detail — so every appointment feels less like a
              service and more like being looked after.
            </p>
          </motion.div>

          {/* Doctor portrait — scroll-driven: moves down+left and scales up */}
          <motion.div
            style={{ y: portraitY, x: portraitX, scale: portraitScale }}
            className="absolute top-[12%] left-[28%] w-[16vw] z-10"
          >
            <div className="aspect-[3/4] flex items-center justify-center">
              <img
                src="/assets/Logo/mastercut-mark.png"
                alt="Mastercuts"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* "Our goal is" — left side, fast parallax (exits top first) */}
          <motion.div
            style={{ y: goalTextY }}
            className="absolute top-[58%] left-[3%] z-20"
          >
            <h2 className="font-serif text-6xl lg:text-8xl text-text-primary leading-tight">
              Our goal is
            </h2>
          </motion.div>

          {/* Long text + CTA — right half, word-by-word reveal */}
          <motion.div
            style={{ y: contentY }}
            className="absolute top-[58%] left-[50%] w-[46%] z-10"
          >
            <p className="font-serif text-section lg:text-section-lg leading-tight">
              {LONG_TEXT_WORDS.map((word, i) => (
                <span
                  key={i}
                  className={`transition-colors duration-200 ${
                    i < revealedCount ? 'text-text-primary' : 'text-text-primary/20'
                  }`}
                >
                  {word === 'considered' ? <em>{word}</em> : word}{' '}
                </span>
              ))}
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Mobile: simple stacked layout ── */}
      <div className="lg:hidden px-6 py-24 space-y-12">
        <p className="text-sm text-text-secondary">
          With decades of combined experience and ongoing advanced education, our
          team delivers care rooted in knowledge, precision, and an unwavering
          dedication to excellence.
        </p>

        <div className="aspect-[3/4] flex items-center justify-center w-full max-w-xs mx-auto">
          <img src="/assets/Logo/mastercut-mark.png" alt="Mastercuts" className="w-full h-full object-contain" />
        </div>

        <h2 className="font-serif text-5xl text-text-primary leading-tight">
          Our goal is
        </h2>

        <p className="font-serif text-3xl text-text-primary leading-tight">
          to help every guest leave looking better, feeling lighter, and living
          more fully — through <em>considered</em> rituals, attentive technique,
          and care offered with quiet warmth.
        </p>
      </div>

    </section>
  );
}

