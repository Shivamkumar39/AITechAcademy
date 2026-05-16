import React, { useEffect, useMemo, useRef, useState } from "react";
import "./LazyImage.css";
import { resolveImageUrl } from "../../utils/imageUrl";
const DEFAULT_IMAGE_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700' fill='none'><rect width='1200' height='700' fill='%23e9eef2'/><rect x='80' y='80' width='1040' height='540' rx='24' fill='%23dbe4ea'/><path d='M220 500l170-190 130 150 170-210 290 250H220z' fill='%23b9c9d6'/><circle cx='430' cy='250' r='45' fill='%239fb3c2'/></svg>";
const DEFAULT_AVATAR_SVG = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' rx='24' fill='%23e8edf2'/><circle cx='100' cy='76' r='34' fill='%2390a4b4'/><path d='M38 170c0-31 27-53 62-53s62 22 62 53' fill='%2390a4b4'/></svg>";

function LazyImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  fallbackSrc = DEFAULT_IMAGE_SVG,
  loading = "lazy",
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src || "");
  const imgRef = useRef(null);
  const isAvatar = /author-image|avatar|profile/i.test(className || "");
  const effectiveFallback = isAvatar ? DEFAULT_AVATAR_SVG : fallbackSrc;

  useEffect(() => {
    setImgSrc(resolveImageUrl(src || ""));
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setIsLoaded(true);
      setHasError(false);
    }
  }, [imgSrc]);

  const hasImage = useMemo(() => Boolean(imgSrc), [imgSrc]);

  return (
    <div className={`lazy-image-wrap ${wrapperClassName}`}>
      {!isLoaded && !hasError && <div className="lazy-image-skeleton" aria-hidden="true" />}
      {hasImage && !hasError ? (
        <img
          ref={imgRef}
          {...rest}
          src={imgSrc}
          alt={alt}
          loading={loading}
          className={`${className} lazy-image-loaded`.trim()}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            const normalizedFallback = resolveImageUrl(effectiveFallback);
            if (imgSrc !== normalizedFallback && normalizedFallback) {
              setImgSrc(normalizedFallback);
              setIsLoaded(false);
              return;
            }
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      ) : (
        <img
          {...rest}
          src={isAvatar ? DEFAULT_AVATAR_SVG : DEFAULT_IMAGE_SVG}
          alt=""
          loading={loading}
          className={`${className} lazy-image-loaded`.trim()}
        />
      )}
    </div>
  );
}

export default LazyImage;
