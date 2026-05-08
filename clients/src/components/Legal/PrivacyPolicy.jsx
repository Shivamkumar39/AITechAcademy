import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function PrivacyPolicy() {
  return (
    <>
      <Seo title="Privacy Policy | AITECHACADEMY" description="Privacy policy for AITECHACADEMY." path="/privacy-policy" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: May 7, 2026</p>
          <section className="legal-section"><h2>Information We Collect</h2><p>We may collect your name, email, profile information, and usage data when you register, publish content, or contact us.</p></section>
          <section className="legal-section"><h2>How We Use Data</h2><p>We use data to provide account access, improve content quality, secure the platform, and communicate important updates.</p></section>
          <section className="legal-section"><h2>Advertising</h2><p>We may display third-party ads including Google AdSense. Ad providers may use cookies to personalize ad experience according to applicable policies.</p></section>
          <section className="legal-section"><h2>Contact</h2><p>Email: shivamkumar098798@gmail.com<br />Phone: 9508353863<br />Address: Newarsh Lalaput Kudara, 821108</p></section>
        </div>
      </main>
    </>
  );
}
