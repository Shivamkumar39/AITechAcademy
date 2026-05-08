import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function TermsAndConditions() {
  return (
    <>
      <Seo title="Terms and Conditions | AITECHACADEMY" description="Terms and conditions for AITECHACADEMY users." path="/terms-and-conditions" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-subtitle">Last updated: May 7, 2026</p>
          <section className="legal-section"><h2>Acceptance</h2><p>By using this website, you agree to comply with these terms and all applicable laws.</p></section>
          <section className="legal-section"><h2>Content Responsibility</h2><p>Users must post lawful, respectful, and original content. We may remove content that violates policy or law.</p></section>
          <section className="legal-section"><h2>Ads and External Links</h2><p>Third-party ads and links may appear on our site. We are not responsible for third-party website content or policies.</p></section>
          <section className="legal-section"><h2>Contact</h2><p>Email: shivamkumar098798@gmail.com<br />Phone: 9508353863<br />Address: Newarsh Lalaput Kudara, 821108</p></section>
        </div>
      </main>
    </>
  );
}
