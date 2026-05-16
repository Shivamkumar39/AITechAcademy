const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:8000").replace(/\/$/, "");

export function resolveImageUrl(value) {
  if (!value || typeof value !== "string") return "";

  const src = value.trim();
  if (!src) return "";

  if (src.startsWith("data:")) return src;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    try {
      const parsed = new URL(src);
      if (parsed.pathname.startsWith("/uploads/") || parsed.pathname.startsWith("/blog-image/")) {
        return `${API_BASE}${parsed.pathname}`;
      }
      return src;
    } catch (_) {
      return src;
    }
  }

  if (src.startsWith("/uploads/") || src.startsWith("/blog-image/")) {
    return `${API_BASE}${src}`;
  }

  if (src.startsWith("uploads/")) {
    return `${API_BASE}/${src}`;
  }

  if (src.startsWith("blog-image/")) {
    return `${API_BASE}/${src}`;
  }

  return src;
}

