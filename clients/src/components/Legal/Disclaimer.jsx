import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function Disclaimer() {
  return (
    <>
      <Seo title="Disclaimer | AITECHACADEMY" description="Disclaimer policy for AITECHACADEMY." path="/disclaimer" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-subtitle">Last updated: May 7, 2026</p>
          <section className="legal-section">
            <h2>General Information</h2>
            <p>All content on AITECHACADEMY is published for informational and educational purposes only.</p>
          </section>
          <section className="legal-section">
            <h2>External Links</h2>
            <p>Our website may contain links to external websites. We do not guarantee completeness or reliability of third-party content.</p>
          </section>
          <section className="legal-section">
            <h2>Advertising Disclaimer</h2>
            <p>We may display ads through Google AdSense and other networks. Ad providers may use cookies and similar technologies according to their policies.</p>
          </section>
        </div>
      </main>
    </>
  );
}
