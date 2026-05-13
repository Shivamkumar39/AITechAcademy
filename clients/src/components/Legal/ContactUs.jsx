import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function ContactUs() {
  return (
    <>
      <Seo title="Contact Us | AITECHACADEMY" description="Get in touch with AITECHACADEMY for support, collaborations, or business inquiries." path="/contact-us" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Contact Us</h1>
          <p className="legal-subtitle">We'd love to hear from you. Reach out to us for any questions, feedback, or business opportunities.</p>

          <section className="legal-section">
            <h2>Get in Touch</h2>
            <p>Whether you have a question about our content, need technical support, or want to discuss a partnership, our team is here to help.</p>

            <div className="contact-info">
              <p><strong>General Support:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Business Inquiries:</strong> aitechacademy@aitechacademy.online</p>
              <p><strong>Phone:</strong> +91 9508353863</p>
              <p><strong>Address:</strong> Newarsh Lalapur Kudara, Rohtas, Bihar, India - 821108</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Response Time</h2>
            <p>We typically respond to all inquiries within 24-48 business hours. Thank you for your patience and for being a part of AITECHACADEMY.</p>
          </section>
        </div>
      </main>
    </>
  );
}
