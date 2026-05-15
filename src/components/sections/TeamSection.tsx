import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TeamMember {
  name: string;
  title: string;
  description: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Jenkins',
    title: 'Master Therapist',
    description: 'Expert in creative coloring and styling, known for precision, empathy, and artistry. Creates natural, camera-ready looks through advanced balayage and extensions.',
    image: '/assets/Images/headshot_1.png'
  },
  {
    name: 'David Cortez',
    title: 'Senior Colorist',
    description: 'Color specialist with 20+ years of experience in complex corrections and transformations. Combines technical mastery with aesthetic vision in full hair makeovers.',
    image: '/assets/Images/headshot_2.png'
  },
  {
    name: 'Elena Rostova',
    title: 'Wellness Director',
    description: 'Renowned expert in hair and scalp health. Merges restorative treatments and massage therapy to craft relaxing, rejuvenating, and deeply nourishing experiences.',
    image: '/assets/Images/headshot_3.png'
  }
];

export function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="bg-bg-dark py-24 lg:py-32" ref={ref}>
      <div className="w-full px-6 lg:px-12 xl:px-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-24"
        >
          <h2 className="font-serif text-section lg:text-section-lg text-white leading-tight">
            Team of Experts
          </h2>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
              className="group"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-white/50">{member.title}</p>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-20 lg:mt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Label */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="text-sm text-white/50 mb-2">Skilled professionals</p>
            <p className="text-sm text-white/70 max-w-xs">
              delivering expert care with premium products.
            </p>
          </motion.div>

          {/* Right - CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="lg:text-right"
          >
            <p className="font-serif text-2xl lg:text-3xl text-white">
              Our team is dedicated to
              <br />
              providing wonderful service
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
