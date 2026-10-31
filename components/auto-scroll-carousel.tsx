"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AutoScrollCarouselProps {
  children: ReactNode;
  intervalMs?: number;
  className?: string;
  showControls?: boolean;
}

export function AutoScrollCarousel({
  children,
  intervalMs = 3500,
  className = "",
  showControls = true,
}: AutoScrollCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  const scrollByDirection = (dir: "left" | "right") => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollAmount = Math.max(container.clientWidth * 0.75, 280);
    const target =
      dir === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    // Jika di ujung kanan, kembali ke awal
    if (dir === "right" && container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      container.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  // Auto scroll effect
  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const itemWidth = Math.max(clientWidth * 0.5, 300);
        containerRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isHovered, intervalMs]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div
      className="relative group/carousel"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Panah Navigasi Kiri */}
      {showControls && (
        <button
          type="button"
          onClick={() => scrollByDirection("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll Kiri"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-0 disabled:pointer-events-none active:scale-95`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Kontainer Scroll Horizontal */}
      <div
        ref={containerRef}
        className={`flex gap-5 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 scrollbar-none snap-x snap-mandatory ${className}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* Panah Navigasi Kanan */}
      {showControls && (
        <button
          type="button"
          onClick={() => scrollByDirection("right")}
          aria-label="Scroll Kanan"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 border border-slate-200 shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:text-white transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Indikator info auto-scroll saat di mobile/hover */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
        <span>*Geser ke samping untuk melihat lainnya &bull; Otomatis bergulir</span>
        {isHovered && <span className="text-emerald-600 font-medium">Jeda (Hover)</span>}
      </div>
    </div>
  );
}

