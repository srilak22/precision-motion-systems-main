import React from 'react';
import { Link } from '@tanstack/react-router';
import { categories } from '@/data/robotics';
import '@/styles/industrialShowcase.css';

// Utility to get image URL (placeholder implementation)
import { getProductImageUrl as getImageUrl } from '@/lib/images';

export function IndustrialShowcase() {
  // Select a handful of categories to showcase (first 6)
  const showcaseCategories = categories.slice(0, 6);

  // Split into three rows (2 items per row)
  const rows = [
    showcaseCategories.slice(0, 2),
    showcaseCategories.slice(2, 4),
    showcaseCategories.slice(4, 6),
  ];

  const animationDurations = ['30s', '40s', '35s']; // distinct speeds per row

  return (
    <section className="industrial-showcase bg-[#F4F7FB] py-16">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-10">
        <h2 className="font-display text-3xl md:text-4xl text-center font-bold uppercase mb-4">
          Explore Robotics & Motion Technologies
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse our verified product families, solutions and applications – each engineered for precision and reliability.
        </p>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`showcase-row ${rowIndex % 2 === 0 ? 'direction-ltr' : 'direction-rtl'}`}
          >
            <div className="showcase-track flex" style={{ animationDuration: animationDurations[rowIndex] }}>
              {/* Duplicate items for seamless looping */}
              {[...row, ...row].map((cat, i) => (
                <Link
                  key={`${cat.slug}-${i}`}
                  to="/products/$category"
                  params={{ category: cat.slug }}
                  className="showcase-card flex-shrink-0 w-64 md:w-72 lg:w-80 mx-2 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                >
                  <div className="p-4 flex flex-col h-full">
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.title}
                      className="h-32 w-full object-cover rounded-md mb-3"
                    />
                    <h3 className="font-medium text-sm md:text-base text-foreground truncate">
                      {cat.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2 flex-grow">
                      {cat.positioning}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
