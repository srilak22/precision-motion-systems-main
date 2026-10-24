import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import heroProductionLine from "@/assets/hero/hero-production-line.jpg";
import heroWeldingCell from "@/assets/hero/hero-welding-cell.jpg";
import armImage from "@/assets/robotic-arm-cell.jpg";
import mobileImage from "@/assets/mobile-robotics.jpg";
import heroImage from "@/assets/robotics-hero.jpg";

export interface HeroSlide {
  id: string;
  image: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  focalPoint: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "production-line",
    image: heroProductionLine,
    alt: "Synchronized multi-axis industrial robotic arms along automated factory assembly line",
    category: "APPLICATION 01 · INDUSTRIAL ROBOTIC ARMS",
    title: "Synchronized Multi-Axis Robotics in Modern Manufacturing",
    description: "High-speed assembly and synchronized kinematics across integrated automotive and discrete manufacturing lines.",
    focalPoint: "object-[65%_center] sm:object-[68%_center] lg:object-[65%_center]",
  },
  {
    id: "cnc-machine-tending",
    image: armImage,
    alt: "Precision articulated industrial robot tending high-tolerance CNC machining center",
    category: "APPLICATION 02 · PRECISION AUTOMATION",
    title: "Precision Automation & Machine Tending Workcells",
    description: "Continuous unstaffed spindle utilization with dual pneumatic grippers and integrated safety interlocks.",
    focalPoint: "object-[68%_center] sm:object-[65%_center] lg:object-[62%_center]",
  },
  {
    id: "robotic-welding-assembly",
    image: heroWeldingCell,
    alt: "Precision 6-axis industrial robot performing assembly and arc welding with active seam tracking",
    category: "APPLICATION 03 · ROBOTIC ASSEMBLY & WELDING",
    title: "Automated Robotic Assembly & Laser Welding Cells",
    description: "Continuous trajectory control with real-time optical seam tracking and spatter shielding.",
    focalPoint: "object-[72%_center] sm:object-[70%_center] lg:object-[68%_center]",
  },
  {
    id: "intralogistics-material-handling",
    image: mobileImage,
    alt: "Autonomous mobile robots and industrial material handling platforms navigating smart facility",
    category: "APPLICATION 04 · MATERIAL HANDLING",
    title: "Industrial Material Handling & Autonomous Mobile Robotics",
    description: "Deterministic AMR fleet navigation with omnidirectional vector drive units and LiDAR safety zones.",
    focalPoint: "object-[70%_center] sm:object-[68%_center] lg:object-[65%_center]",
  },
  {
    id: "smart-factory-kinematics",
    image: heroImage,
    alt: "High-payload articulated robot operating in high-tech smart factory robotics cell",
    category: "APPLICATION 05 · SMART FACTORY",
    title: "Wide-Angle Smart Factory Automation & Articulated Robotics",
    description: "ISO 9283-verified path repeatability and L10h >= 20,000h bearing life under heavy duty cycles.",
    focalPoint: "object-[78%_center] sm:object-[74%_center] lg:object-[70%_center]",
  },
];

const SLIDE_DURATION_MS = 6000; // 6 seconds per slide
const TRANSITION_DURATION_MS = 1200; // 1.2 second cinematic horizontal slide

interface HeroBackgroundSliderProps {
  onSlideChange?: (index: number) => void;
  className?: string;
}

export function HeroBackgroundSlider({
  onSlideChange,
  className = "",
}: HeroBackgroundSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload all slide images into browser cache immediately on mount
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Check user's reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const goToSlide = useCallback(
    (newIndex: number, forcedDirection?: "next" | "prev") => {
      if (newIndex === currentIndex || isTransitioning) return;

      const dir =
        forcedDirection ||
        (newIndex > currentIndex
          ? "next"
          : newIndex === 0 && currentIndex === HERO_SLIDES.length - 1
          ? "next"
          : currentIndex === 0 && newIndex === HERO_SLIDES.length - 1
          ? "prev"
          : "prev");

      setDirection(dir);
      setPrevIndex(currentIndex);
      setCurrentIndex(newIndex);
      setIsTransitioning(true);
      setProgress(0);

      onSlideChange?.(newIndex);

      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setPrevIndex(null);
      }, TRANSITION_DURATION_MS);
    },
    [currentIndex, isTransitioning, onSlideChange]
  );

  const nextSlide = useCallback(() => {
    const next = (currentIndex + 1) % HERO_SLIDES.length;
    goToSlide(next, "next");
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (currentIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToSlide(prev, "prev");
  }, [currentIndex, goToSlide]);

  // Handle automatic timer and progress ticker
  useEffect(() => {
    if (prefersReducedMotion || isPaused || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const progressIncrement = (stepMs / SLIDE_DURATION_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return Math.min(100, p + progressIncrement);
      });
    }, stepMs);

    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [prefersReducedMotion, isPaused, isHovered, nextSlide]);

  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Accessible keyboard controls (Left/Right arrow, Spacebar to toggle pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (
        e.key === " " &&
        (e.target === containerRef.current || document.activeElement === containerRef.current)
      ) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Industrial Robotics Hero Slide Showcase"
      tabIndex={0}
    >
      {/* =========================================================================
          SLIDES LAYER: Full-Width, Edge-to-Edge Industrial Robotics Photography
         ========================================================================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          const isPrev = index === prevIndex;

          if (!isActive && !isPrev) {
            return null;
          }

          let transformClass = "translate-x-0 opacity-100 z-10";

          if (isTransitioning) {
            if (isActive) {
              transformClass =
                direction === "next"
                  ? "animate-slide-in-right z-20"
                  : "animate-slide-in-left z-20";
            } else if (isPrev) {
              transformClass =
                direction === "next"
                  ? "animate-slide-out-left z-10"
                  : "animate-slide-out-right z-10";
            }
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full overflow-hidden ${transformClass}`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${HERO_SLIDES.length}: ${slide.title}`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                width={1920}
                height={1080}
                fetchPriority={index === 0 ? "high" : "low"}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== heroProductionLine) {
                    target.src = heroProductionLine;
                  }
                }}
                className={`absolute inset-0 h-full w-full object-cover ${slide.focalPoint} ${
                  !prefersReducedMotion ? "animate-ken-burns" : ""
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          TEXT CONTRAST GRADIENT OVERLAY (Subtle Left-to-Right Protection)
          Darkens only behind text on the left; the entire right 50% remains 
          natural, bright, sharp, metallic, and visually dominant!
         ========================================================================= */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,34,0.85)_0%,rgba(8,18,34,0.55)_36%,rgba(8,18,34,0.12)_62%,transparent_78%)] max-md:bg-[linear-gradient(180deg,rgba(8,18,34,0.88)_0%,rgba(8,18,34,0.55)_48%,rgba(8,18,34,0.15)_75%,transparent_100%)] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Subtle Top & Bottom Vignettes */}
      <div
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(8,18,34,0.45)] to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[rgba(8,18,34,0.55)] to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* =========================================================================
          CAROUSEL CONTROLS & APPLICATION BADGE (Bottom Anchored)
         ========================================================================= */}
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 z-30 pointer-events-none px-5 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1440px] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          {/* Active Slide Application Label & Context Badge */}
          <div className="pointer-events-auto hidden md:block max-w-sm lg:max-w-md">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#081222]/85 border border-white/10 backdrop-blur-md text-[10px] font-mono font-bold uppercase tracking-widest text-signal">
              <span className="size-1.5 rounded-full bg-signal shadow-[0_0_8px_rgba(22,199,232,0.9)] animate-pulse" />
              <span>{HERO_SLIDES[currentIndex].category}</span>
            </div>
            <p className="mt-1 text-xs sm:text-sm font-display uppercase tracking-wide text-white drop-shadow font-semibold line-clamp-1">
              {HERO_SLIDES[currentIndex].title}
            </p>
          </div>

          {/* Minimal Controls: Indicators + Navigation Chevrons + Pause/Play */}
          <div className="pointer-events-auto ml-auto sm:ml-0 flex items-center gap-3 bg-[#081222]/85 border border-white/10 backdrop-blur-md px-3.5 py-2 rounded-lg shadow-lg">
            {/* Slide Progress Pill Indicators */}
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Slide Selection Indicators"
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isSelected = idx === currentIndex;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                    className="group relative h-2 rounded-full overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                    style={{
                      width: isSelected ? "36px" : "12px",
                      backgroundColor: isSelected ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.35)",
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute inset-y-0 left-0 bg-signal transition-all duration-75 ease-linear rounded-full"
                        style={{
                          width: prefersReducedMotion || isPaused ? "100%" : `${progress}%`,
                        }}
                      />
                    )}
                    <span className="sr-only">{slide.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Slide Counter (e.g. 01 / 05) */}
            <div className="hidden sm:block text-[11px] font-mono text-slate-400 pl-2 border-l border-white/10 select-none">
              <span className="text-white font-bold">0{currentIndex + 1}</span>
              <span className="text-slate-500"> / 0{HERO_SLIDES.length}</span>
            </div>

            {/* Prev / Next & Pause Buttons */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <button
                onClick={prevSlide}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                aria-label="Previous background slide (Left Arrow)"
                title="Previous slide (Left Arrow)"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() => setIsPaused((p) => !p)}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                aria-label={isPaused ? "Resume automatic slide transition" : "Pause automatic slide transition"}
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={13} className="text-signal" /> : <Pause size={13} />}
              </button>

              <button
                onClick={nextSlide}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
                aria-label="Next background slide (Right Arrow)"
                title="Next slide (Right Arrow)"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
