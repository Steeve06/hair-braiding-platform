import React from "react";
import { motion as Motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-brand-black overflow-hidden">

            {/* Background grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true"></div>

            {/*Radial Gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] pointer-events-none" />

            <Motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 max-w-4xl"
            >
                {/* Top label */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className="h-px w-8 bg-brand-gold/40" />
                    <span className="text-[10px] tracking-[0.4rem] uppercase text-brand-gold font-medium ">Luxury Braiding Studio · Atlanta, GA</span>
                    <div className="h-px w-8 bg-brand-gold/40" />
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-8xl font-serif text-brand-cream leading-tight mb-8">
                    The Art of <br />
                    <span className="italic text-brand-gold font-light">Styled Braids</span>
                </h1>

                {/* subheading */}
                <p className="max-w-xl mx-auto text-brand-cream/60 text-sm md:text-base leading-relaxed font-light mb-12 tracking-wide">
                    Precision & protective styling crafted with care — where heritage meets artistry, and every braid tells a story.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button className="bg-brand-gold text-brand-black px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors duration-300 w-full sm:w-auto">
                        Book Appointment
                    </button>
                    <button className="border border-white/20 text-brand-cream px-10 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:border-brand-gold transition-colors duration-300 w-full sm:w-auto">
                        Explore Services
                    </button>
                </div>
            </Motion.div>

            {/* Decorative vertical line at bottom center */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-px h-20 bg-linear-to-b from-brand-gold to-transparent opacity-50" />

        </section>
    );
};

export default Hero;