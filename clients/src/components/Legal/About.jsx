import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function About() {
  return (
    <>
      <Seo title="About Us | AITECHACADEMY" description="About AITECHACADEMY and our mission." path="/about" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">About Us</h1>
          <p className="legal-subtitle">AITECHACADEMY is a daily AI-tech publication focused on practical content, SEO growth, and reader-first writing.</p>
          <section className="legal-section"><h2>Our Mission</h2><p>We publish high-quality blogs on AI, technology, business, and digital growth in a clear and actionable format.</p></section>
          <section className="legal-section"><h2>Editorial Focus</h2><p>Every article is structured for readability, search visibility, and user trust with useful examples and real-world relevance.</p></section>
          <section className="legal-section"><h2>Founder</h2><p>Shivam Kushwaha</p></section>
          <section className="legal-section"><h2>Contact</h2><p>Email: shivamkumar098798@gmail.com<br />Phone: 9508353863<br />Address: Newarsh Lalaput Kudara, 821108</p></section>
        </div>
      </main>
    </>
  );
}
