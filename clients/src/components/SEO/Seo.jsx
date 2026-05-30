import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "AITECHACADEMY";

const DEFAULT_IMAGE =
  "https://img.freepik.com/premium-vector/funny-brain-like-lamp-vector-illustration-cartoon-brain-has-idea_562381-56.jpg?w=2000";

const DEFAULT_DESCRIPTION =
  "AITECHACADEMY provides AI tools, coding tutorials, CSE notes, PYQs, assignments, and latest technology updates for students and developers.";

function Seo({
  title,
  description,
  path = "/",
  type = "website", // website | article | profile | profile-page
  image,
  keywords,
  noIndex = false,
  publishedTime,
  updatedTime,
  author,
}) {
  const siteUrl =
    (process.env.REACT_APP_SITE_URL || "https://aitechacademy.online").replace(/\/$/, "");

  const canonicalUrl = `${siteUrl}${path}`;

  const finalTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - AI Tools, Education & Technology`;

  const finalDescription = description || DEFAULT_DESCRIPTION;

  const finalKeywords =
    keywords ||
    "AI tools, coding, CSE notes, PYQ, assignments, programming tutorials, technology news";

  const finalImage = image || DEFAULT_IMAGE;

  const isArticle = type === "article";
  const isProfile = type === "profile";

  return (
    <Helmet>
      {/* ================= BASIC SEO ================= */}
      <title>{finalTitle}</title>
      <meta charSet="utf-8" />
      <meta name="language" content="en" />
      <meta name="author" content={author || SITE_NAME} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ================= OPEN GRAPH ================= */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />

      {/* Article extra tags */}
      {isArticle && (
        <>
          <meta property="article:section" content="Technology" />
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {updatedTime && (
            <meta property="article:modified_time" content={updatedTime} />
          )}
        </>
      )}

      {/* Profile SEO support */}
      {isProfile && (
        <>
          <meta property="profile:username" content={author || ""} />
        </>
      )}

      {/* ================= TWITTER ================= */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* ================= EXTRA GOOGLE HELP ================= */}
      <meta name="theme-color" content="#0f172a" />
    </Helmet>
  );
}

export default Seo;