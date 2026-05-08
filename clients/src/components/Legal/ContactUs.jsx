import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function ContactUs() {
  return (
    <>
      <Seo title="Contact Us | AITECHACADEMY" description="Contact details for AITECHACADEMY." path="/contact-us" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Contact Us</h1>
          <p className="legal-subtitle">Reach out for support, collaborations, and business inquiries.</p>
          <section className="legal-section"><h2>Email</h2><p>shivamkumar098798@gmail.com</p></section>
          <section className="legal-section"><h2>Phone</h2><p>9508353863</p></section>
          <section className="legal-section"><h2>Address</h2><p>Newarsh Lalaput Kudara, 821108</p></section>
        </div>
      </main>
    </>
  );
}
