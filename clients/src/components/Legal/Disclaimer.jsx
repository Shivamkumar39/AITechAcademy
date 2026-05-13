import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function Disclaimer() {
  const lastUpdated = "May 13, 2026";

  return (
    <>
      <Seo title="Disclaimer | AITECHACADEMY" description="Disclaimer policy for AITECHACADEMY. Read our terms regarding content accuracy and liability." path="/disclaimer" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-subtitle">Last updated: {lastUpdated}</p>
          
          <section className="legal-section">
            <h2>General Information</h2>
            <p>The information provided by AITECHACADEMY on aitechacademy.online is for general informational purposes only. All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.</p>
          </section>

          <section className="legal-section">
            <h2>External Links Disclaimer</h2>
            <p>The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>
          </section>

          <section className="legal-section">
            <h2>Professional Disclaimer</h2>
            <p>The site cannot and does not contain professional advice. The tech information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>
          </section>

          <section className="legal-section">
            <h2>Advertising Disclaimer</h2>
            <p>This site may contain third-party advertisements and links to third-party sites. AITECHACADEMY does not make any representation as to the accuracy or suitability of any of the information contained in those advertisements or sites and does not accept any responsibility or liability for the conduct or content of those advertisements and sites and the offerings made by the third parties.</p>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <div className="contact-info">
              <p><strong>Email:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Official:</strong> aitechacademy@aitechacademy.online</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
