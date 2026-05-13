import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function About() {
  return (
    <>
      <Seo title="About Us | AITECHACADEMY" description="Learn about AITECHACADEMY, our mission, and our commitment to providing high-quality tech content." path="/about" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">About Us</h1>
          <p className="legal-subtitle">Empowering the next generation of tech enthusiasts through high-quality, actionable, and insightful content.</p>

          <section className="legal-section">
            <h2>Our Mission</h2>
            <p>At AITECHACADEMY, our mission is to demystify complex technologies and provide clear, practical knowledge in the fields of Artificial Intelligence, Software Development, SEO, and Digital Growth. We believe in the power of education and strive to create a platform where learners can stay ahead in the rapidly evolving tech landscape.</p>
          </section>

          <section className="legal-section">
            <h2>What We Offer</h2>
            <p>We publish deep-dive articles, tutorials, and industry insights designed for both beginners and experienced professionals. Every piece of content is meticulously researched and structured to ensure maximum readability and real-world applicability.</p>
          </section>

          <section className="legal-section">
            <h2>Our Values</h2>
            <ul>
              <li><strong>Quality First:</strong> We prioritize accurate and well-researched information over quantity.</li>
              <li><strong>Integrity:</strong> We maintain transparency and editorial independence in all our publications.</li>
              <li><strong>Community:</strong> We foster a collaborative environment for continuous learning and growth.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Founder</h2>
            <p><strong>Shivam Kushwaha</strong> — Tech Enthusiast, Developer, and Content Strategist dedicated to sharing knowledge and building a better digital future.</p>
          </section>

          <section className="legal-section">
            <h2>Contact Information</h2>
            <div className="contact-info">
              <p><strong>Support:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Business:</strong> aitechacademy@aitechacademy.online</p>
              <p><strong>Location:</strong> Newarsh Lalapur Kudara, 821108</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
