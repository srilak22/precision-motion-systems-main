import React, { useState } from "react";
import { getProductImageUrl } from "@/lib/images";

export interface ProductImageProps {
  /** Can be product ID, image key, or product object */
  product?:
    string | { id?: string; slug?: string; image?: string; categorySlug?: string; name?: string };
  /** Explicit fallback or primary src */
  src?: string;
  /** Descriptive alt text */
  alt: string;
  /** Aspect ratio class (defaults to aspect-[16/10]) */
  aspectRatioClass?: string;
  /** Optional container class overrides */
  containerClassName?: string;
  /** Image class overrides */
  className?: string;
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Priority flag for above-the-fold heroes */
  priority?: boolean;
}

export function ProductImage({
  product,
  src,
  alt,
  aspectRatioClass = "aspect-[16/10]",
  containerClassName = "",
  className = "",
  loading = "lazy",
  priority = false,
}: ProductImageProps) {
  const resolvedPrimarySrc = src || getProductImageUrl(product);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedPrimarySrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If the primary image fails, safely fallback once to our branded SVG without looping
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallbackSrc = getProductImageUrl("fallback");
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0e1628] ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* Product Image */}
      <img
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`h-full w-full object-cover transition-all duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />

      {/* Subtle Bottom Technical Gradient for Contrast */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/40 to-transparent opacity-60"
        aria-hidden="true"
      />
    </div>
  );
}
