import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;
    const mailtoLink = `mailto:codewithshivam9@gmail.com?subject=${encodeURIComponent(subject || "Contact from " + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  return (
    <>
      <Seo
        title="Contact Us | AITECHACADEMY — Get in Touch"
        description="Contact AITECHACADEMY for support, content corrections, collaboration opportunities, or business inquiries. We respond within 24–48 hours."
        path="/contact-us"
      />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Contact Us</h1>
          <p className="legal-subtitle">
            Have a question, found an error, or want to collaborate? We’d love to hear from you.
            We typically respond within 24–48 business hours.
          </p>

          <section className="legal-section">
            <h2>Send Us a Message</h2>
            <p>Fill out the form below and your message will be sent directly to our team.</p>

            {submitted ? (
              <div style={{ background: '#e6f9f4', border: '1px solid #00aaa1', borderRadius: '8px', padding: '20px', marginTop: '16px', color: '#006b65' }}>
                <strong>Thank you for reaching out!</strong> Your email client should have opened with your message pre-filled.
                If it did not open, please email us directly at{" "}
                <a href="mailto:codewithshivam9@gmail.com" style={{ color: '#00aaa1' }}>codewithshivam9@gmail.com</a>.
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="contact-name" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Your Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Shivam Kushwaha"
                      style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label htmlFor="contact-email" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Email Address *</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <label htmlFor="contact-subject" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Subject *</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Content correction, Collaboration, General inquiry"
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  <label htmlFor="contact-message" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Your Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe your question, feedback, or inquiry in detail..."
                    style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ background: '#00aaa1', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Send Message
                </button>
              </form>
            )}
          </section>

          <section className="legal-section">
            <h2>Direct Contact Information</h2>
            <p>Prefer to reach us directly? Use any of the contact methods below:</p>
            <div className="contact-info">
              <p><strong>General Support:</strong> <a href="mailto:codewithshivam9@gmail.com" style={{ color: '#00aaa1' }}>codewithshivam9@gmail.com</a></p>
              <p><strong>Business Inquiries:</strong> <a href="mailto:aitechacademy@aitechacademy.online" style={{ color: '#00aaa1' }}>aitechacademy@aitechacademy.online</a></p>
              <p><strong>Phone:</strong> +91 9508353863</p>
              <p><strong>Address:</strong> Newarsh Lalapur Kudara, Rohtas, Bihar, India — 821108</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>What to Contact Us About</h2>
            <ul>
              <li><strong>Content Corrections:</strong> If you find an error or outdated information in one of our articles, please let us know. We take accuracy seriously and will update the content promptly.</li>
              <li><strong>Study Material Requests:</strong> If you need specific CSE notes, PYQ sets, or tutorials that we haven’t covered yet, send us a request and we’ll prioritize it.</li>
              <li><strong>Guest Contributions:</strong> Are you a developer, researcher, or educator who wants to contribute an article? We welcome guest posts that meet our editorial standards.</li>
              <li><strong>Sponsorship &amp; Advertising:</strong> For sponsored content or advertising opportunities beyond our standard AdSense integration, contact our business email.</li>
              <li><strong>Technical Issues:</strong> If you encounter a bug, broken page, or usability issue on our website, report it and we’ll fix it as quickly as possible.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Response Time</h2>
            <p>
              We are a small, dedicated team. We read every message and do our best to respond
              to all genuine inquiries within <strong>24–48 business hours</strong>. For urgent
              matters, please use the phone number listed above.
            </p>
            <p>
              Thank you for being part of the AITECHACADEMY community. Your feedback, questions,
              and ideas help us improve every day.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
