import React, { useState, useEffect, useRef, useCallback } from "react";
import { getProductImageUrl } from "@/lib/images";

export interface ProductImageProps {
  /** Can be product ID, image key, or product object */
  product?:
    | string
    | { id?: string; slug?: string; image?: string; categorySlug?: string; category?: string; name?: string };
  /** Explicit fallback or primary src */
  src?: string;
  /** Descriptive alt text */
  alt: string;
  /** Aspect ratio class (defaults to 4:3 landscape aspect-[4/3]) */
  aspectRatioClass?: string;
  /** Optional container class overrides */
  containerClassName?: string;
  /** Image class overrides */
  className?: string;
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Priority flag for above-the-fold heroes */
  priority?: boolean;
  /**
   * Fit mode:
   * 'contain' (default) for isolated mechanical components, actuators, reducers, motors, sensors
   * 'cover' for industrial scenes, facilities, or contextual photography
   */
  fitMode?: "contain" | "cover";
}

export function ProductImage({
  product,
  src,
  alt,
  aspectRatioClass = "aspect-[4/3]",
  containerClassName = "",
  className = "",
  loading = "lazy",
  priority = false,
  fitMode = "contain",
}: ProductImageProps) {
  const resolvedPrimarySrc = src || getProductImageUrl(product);
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedPrimarySrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Sync state if incoming prop changes
  useEffect(() => {
    const nextSrc = src || getProductImageUrl(product);
    setCurrentSrc(nextSrc);
    setHasError(false);
    setIsLoaded(false);
  }, [src, typeof product === "string" ? product : `${product?.id || ""}-${product?.slug || ""}`]);

  // Handle immediate browser cache / SSR hydration readiness
  const checkImageReadiness = useCallback((node: HTMLImageElement | null) => {
    if (node && node.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const handleRef = useCallback(
    (node: HTMLImageElement | null) => {
      imgRef.current = node;
      checkImageReadiness(node);
    },
    [checkImageReadiness],
  );

  useEffect(() => {
    if (imgRef.current) {
      checkImageReadiness(imgRef.current);
    }
  }, [currentSrc, checkImageReadiness]);

  // Graceful fallback to light-theme technical SVG without looping
  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallbackSrc = getProductImageUrl("fallback");
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
      }
      setIsLoaded(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const fitClasses =
    fitMode === "cover"
      ? "object-cover"
      : "object-contain p-4 drop-shadow-[0_4px_12px_rgba(15,23,42,0.06)]";

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-50/80 flex items-center justify-center select-none ${aspectRatioClass} ${containerClassName}`}
    >
      {/* Subtle Technical Grid Overlay for engineering aesthetic */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(#0F172A 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* Loading Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200/60 to-slate-100" />
      )}

      {/* Product Photographic Asset */}
      <img
        ref={handleRef}
        src={currentSrc}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={`h-full w-full ${fitClasses} transition-all duration-300 ease-out group-hover:scale-[1.025] ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
        } ${className}`}
      />
    </div>
  );
}
