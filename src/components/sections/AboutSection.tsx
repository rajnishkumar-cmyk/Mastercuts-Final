import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { useRef, useState } from 'react';

const LONG_TEXT_WORDS = "to deliver world-class salon and wellness care through advanced techniques, customized treatments, and a bespoke level of service that makes every client feel valued.".split(' ');

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
  // Description + avatars exit upward fast — clear the rising body text
  const teamInfoY   = useTransform(scrollYProgress, [0, 1], ["0vh", "-40vh"]);
  const avatarY     = useTransform(scrollYProgress, [0, 1], ["0vh", "-35vh"]);
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
    <section ref={sectionRef} id="about" className="relative z-10 w-full bg-bg-primary lg:-mt-[100vh]">

      {/* ── Desktop: sticky scroll-driven layout ── */}
      <div className="hidden lg:block h-[300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Description text — between portrait and avatars */}
          <motion.div
            style={{ y: teamInfoY }}
            className="absolute top-[9%] left-[54%] w-[18%] z-10"
          >
            <p className="text-sm text-text-secondary">
              With decades of combined experience and ongoing advanced education, our
              team delivers care rooted in knowledge, precision, and an unwavering
              dedication to excellence.
            </p>
          </motion.div>

          {/* Avatar group — far right, slightly slower parallax */}
          <motion.div
            style={{ y: avatarY }}
            className="absolute top-[9%] right-[3%] z-10"
          >
            <div className="flex items-center gap-5">
              <div className="flex -space-x-6">
                <img
                  src="/assets/Images/headshot_1.png"
                  alt="Team member"
                  className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover"
                />
                <img
                  src="/assets/Images/headshot_2.png"
                  alt="Team member"
                  className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover"
                />
                <img
                  src="/assets/Images/headshot_3.png"
                  alt="Team member"
                  className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover"
                />
              </div>
              <div className="w-20 h-20 rounded-full bg-circle-dark flex items-center justify-center text-white text-lg font-medium">
                +20
              </div>
            </div>
          </motion.div>

          {/* Doctor portrait — scroll-driven: moves down+left and scales up */}
          <motion.div
            style={{ y: portraitY, x: portraitX, scale: portraitScale }}
            className="absolute top-[12%] left-[28%] w-[16vw] z-10"
          >
            <div className="aspect-[3/4] flex items-center justify-center">
              <img
                src="/assets/Logo/mastercutlogo.png"
                alt="Ra by Mastercuts"
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
              Ra goal is
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
                  {word === 'advanced' ? <em>{word}</em> : word}{' '}
                </span>
              ))}
            </p>
          </motion.div>

        </div>
      </div>

      {/* ── Mobile: simple stacked layout ── */}
      <div className="lg:hidden px-6 py-24 space-y-12">
        <div className="flex items-center gap-6">
          <div className="flex -space-x-6">
            <img src="/assets/Images/headshot_1.png" alt="Team member" className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover" />
            <img src="/assets/Images/headshot_2.png" alt="Team member" className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover" />
            <img src="/assets/Images/headshot_3.png" alt="Team member" className="w-20 h-20 rounded-full border-4 border-bg-primary object-cover" />
          </div>
          <div className="w-20 h-20 rounded-full bg-circle-dark flex items-center justify-center text-white text-lg font-medium">
            +20
          </div>
        </div>

        <p className="text-sm text-text-secondary">
          With decades of combined experience and ongoing advanced education, our
          team delivers care rooted in knowledge, precision, and an unwavering
          dedication to excellence.
        </p>

        <div className="aspect-[3/4] flex items-center justify-center w-full max-w-xs mx-auto">
          <img src="/assets/Logo/mastercutlogo.png" alt="Ra by Mastercuts" className="w-full h-full object-contain" />
        </div>

        <h2 className="font-serif text-5xl text-text-primary leading-tight">
          Ra goal is
        </h2>

        <p className="font-serif text-3xl text-text-primary leading-tight">
          to deliver world-class salon and wellness care through{' '}
          <em>advanced</em> techniques, customized treatments, and a bespoke
          level of service that makes every client feel valued.
        </p>
      </div>

    </section>
  );
}

