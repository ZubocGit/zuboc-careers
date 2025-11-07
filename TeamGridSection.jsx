import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Team data array
const teamData = [
  { name: "RASHI", role: "Web Developer", img: assets/Team/IMG_5861.webp },
  { name: "RASHI", role: "Creative Director", img: "REPLACE_THIS_2" },
  { name: "NAJA", role: "HR MANGER", img: "REPLACE_THIS_3" },
  { name: "YAHYA", role: "digital consultant", img: "REPLACE_THIS_4" },
  { name: "VYSHAK", role: "SEO Google Ads Specialist", img: "REPLACE_THIS_5" },
  { name: "ADHIL", role: "Graphic designer", img: "REPLACE_THIS_6" },
  { name: "ASEEM", role: "Video Editor", img: "REPLACE_THIS_7" },
  { name: "AJMAL", role: "Web developer", img: "REPLACE_THIS_8" }
];

// ProfileCard subcomponent with hover zoom + cursor-follow parallax
const ProfileCard = ({ member }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Motion values for parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring animations for smooth parallax
  const springConfig = { stiffness: 220, damping: 24, mass: 0.6 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  // Transform values for parallax translation (±12px)
  const translateX = useTransform(xSpring, [-1, 1], [-12, 12]);
  const translateY = useTransform(ySpring, [-1, 1], [-12, 12]);
  
  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Handle mouse move for parallax
  const handleMouseMove = (e) => {
    if (!cardRef.current || reducedMotion) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize pointer position (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    x.set(normalizedX);
    y.set(normalizedY);
  };
  
  // Reset parallax on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };
  
  // Handle mouse enter
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  // Animation variants for image
  const imageVariants = {
    hover: {
      scale: reducedMotion ? 1 : 1.08,
      transition: reducedMotion 
        ? { duration: 0.3, ease: "easeOut" }
        : { type: "spring", stiffness: 220, damping: 24, mass: 0.6 }
    },
    rest: {
      scale: 1,
      transition: reducedMotion 
        ? { duration: 0.3, ease: "easeOut" }
        : { type: "spring", stiffness: 220, damping: 24, mass: 0.6 }
    }
  };
  
  return (
    <div
      ref={cardRef}
      className="relative isolate rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 overflow-hidden h-full flex flex-col focus-within:ring-2 focus-within:ring-neutral-400 focus-within:outline-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="article"
      aria-label={`Team member: ${member.name}, ${member.role}`}
    >
      {/* Image area with overlay */}
      <div className="relative w-full pt-[72%] overflow-hidden bg-neutral-100">
        <motion.img
          src={member.img}
          alt={`${member.name}, ${member.role} at Zuboc`}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          style={{
            x: reducedMotion ? 0 : translateX,
            y: reducedMotion ? 0 : translateY,
            willChange: reducedMotion ? 'auto' : 'transform'
          }}
          variants={imageVariants}
          initial="rest"
          animate={isHovered ? "hover" : "rest"}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onSelectStart={(e) => e.preventDefault()}
        />
        {/* Dark overlay */}
        <div 
          className="absolute inset-0 bg-neutral-900 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.1 : 0.2 }}
          aria-hidden="true"
        />
      </div>
      
      {/* Text block */}
      <div className="bg-neutral-100 px-5 sm:px-6 pt-4 pb-6 flex-1 flex flex-col">
        <h3 className="text-lg md:text-xl font-semibold tracking-[0.12em] uppercase text-neutral-900">
          {member.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-600">
          {member.role}
        </p>
        {/* Divider */}
        <div className="mt-3 h-px w-16 bg-neutral-300/80" aria-hidden="true" />
      </div>
    </div>
  );
};

// Main TeamGridSection component
const TeamGridSection = () => {
  return (
    <section className="py-16 md:py-20" aria-labelledby="team-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <header className="text-center mb-12 md:mb-16">
          <h2 
            id="team-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4"
          >
            Meet the Team
          </h2>
          <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
            Get to know the creative minds behind Zuboc
          </p>
        </header>
        
        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {teamData.map((member, index) => (
            <ProfileCard key={`${member.name}-${index}`} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGridSection;

