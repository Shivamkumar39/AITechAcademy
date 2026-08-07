import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function TermsAndConditions() {
  const lastUpdated = "August 7, 2026";

  return (
    <>
      <Seo
        title="Terms and Conditions | AITECHACADEMY"
        description="Read the full Terms and Conditions for AITECHACADEMY. These terms govern your use of our website, content, and services including account registration, user comments, and intellectual property."
        path="/terms-and-conditions"
      />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-subtitle">Last updated: {lastUpdated}</p>

          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              Welcome to AITECHACADEMY. By accessing or using our website at{" "}
              <strong>aitechacademy.online</strong>, you agree to be bound by these Terms and
              Conditions ("Terms"). These Terms apply to all visitors, users, and others who access
              or use the Service.
            </p>
            <p>
              If you disagree with any part of these Terms, you must not use our website. We reserve
              the right to update these Terms at any time. Continued use of the website after changes
              are published constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Use of Our Website</h2>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>2.1 Permitted Use</h3>
            <p>You may use our website for personal, non-commercial educational purposes, subject to these Terms. Specifically, you may:</p>
            <ul>
              <li>Browse and read articles, tutorials, and study materials.</li>
              <li>Register for a free account to access additional features (bookmarks, comments).</li>
              <li>Share links to our articles on social media and other platforms.</li>
              <li>Download content that we explicitly designate as downloadable.</li>
            </ul>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>2.2 Prohibited Use</h3>
            <p>You must not:</p>
            <ul>
              <li>Republish, reproduce, duplicate, copy, or sell any material from AITECHACADEMY without express written permission.</li>
              <li>Use our website in any way that violates any applicable local, national, or international law or regulation.</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website.</li>
              <li>Use automated tools (bots, scrapers, spiders) to harvest data from the website without our prior consent.</li>
              <li>Transmit any unsolicited or unauthorised advertising or promotional material (spam).</li>
              <li>Attempt to gain unauthorised access to any part of the website, server, or database.</li>
              <li>Submit content that is false, misleading, defamatory, offensive, hateful, or in violation of any third-party rights.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration</h2>
            <p>
              To access certain features (such as commenting and bookmarking), you must register for an account.
              When registering, you agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information.</li>
              <li>Maintain and promptly update your account information.</li>
              <li>Keep your password confidential and not share it with others.</li>
              <li>Immediately notify us of any unauthorised use of your account.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms, engage in
              fraudulent activity, or remain inactive for an extended period.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Intellectual Property</h2>
            <p>
              Unless otherwise stated, all content published on AITECHACADEMY — including but not limited to
              articles, tutorials, study notes, images, graphics, logos, and code snippets — is the exclusive
              intellectual property of AITECHACADEMY or its content creators and is protected by applicable
              copyright laws.
            </p>
            <p>You are granted a limited, non-exclusive, non-transferable licence to:</p>
            <ul>
              <li>Access and view the content for personal, non-commercial educational use.</li>
              <li>Print or save single copies of articles for personal reference.</li>
            </ul>
            <p>You must not:</p>
            <ul>
              <li>Republish, redistribute, or commercially exploit any content without express written permission.</li>
              <li>Remove or alter any copyright, trademark, or proprietary notices.</li>
              <li>Create derivative works based on our content without written consent.</li>
            </ul>
            <p>
              To request permission to reproduce our content, please contact us at{" "}
              <a href="mailto:aitechacademy@aitechacademy.online" style={{ color: "#00aaa1" }}>
                aitechacademy@aitechacademy.online
              </a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. User-Generated Content (Comments)</h2>
            <p>
              Our website allows visitors to post comments on articles. By submitting a comment, you grant
              AITECHACADEMY a non-exclusive, royalty-free, perpetual licence to use, reproduce, modify,
              and display that content on our website.
            </p>
            <p>You are solely responsible for the content of your comments. You agree that your comments will not:</p>
            <ul>
              <li>Contain defamatory, obscene, abusive, offensive, or hateful language.</li>
              <li>Infringe on any third party's intellectual property, privacy, or other rights.</li>
              <li>Include spam, advertising, or solicitations.</li>
              <li>Contain malicious code, links to malware, or phishing content.</li>
              <li>Violate any applicable law or regulation.</li>
            </ul>
            <p>
              AITECHACADEMY reserves the right (but is not obligated) to monitor, edit, or remove comments
              that we determine, in our sole discretion, to be in violation of these Terms or otherwise
              objectionable. Comments do not reflect the views or opinions of AITECHACADEMY.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Cookies and Advertising</h2>
            <p>
              By using our website, you consent to our use of cookies in accordance with our{" "}
              <a href="/privacy-policy" style={{ color: "#00aaa1" }}>Privacy Policy</a>.
            </p>
            <p>
              We use Google AdSense to display advertisements on our website. Google may use cookies and web
              beacons to collect data about your browsing behaviour for the purpose of serving personalised
              advertisements. You can opt out of personalised advertising by visiting{" "}
              <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>
                Google's Ad Settings
              </a>.
            </p>
            <p>
              Advertisement content is provided by third-party advertisers. We do not endorse or take
              responsibility for the products, services, or content advertised on our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites for reference, additional reading, or
              resource download purposes. These links are provided for your convenience only and do not
              signify our endorsement of those websites or their content.
            </p>
            <p>
              We have no control over the content, privacy policies, or practices of third-party websites.
              We encourage you to review the terms and privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Disclaimer of Warranties</h2>
            <p>
              The information on AITECHACADEMY is provided "as is" without any warranties of any kind, either
              express or implied, including but not limited to warranties of accuracy, completeness, reliability,
              suitability, or availability with respect to the website or the information, products, services,
              or related graphics contained on the website for any purpose.
            </p>
            <p>
              While we strive to keep all content accurate and up to date, technology changes rapidly. We make
              no guarantee that our articles, tutorials, or study materials are error-free or will produce any
              specific outcome when applied.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, AITECHACADEMY shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not limited to
              loss of profits, data, use, or goodwill, arising out of or in connection with:
            </p>
            <ul>
              <li>Your use of or inability to use the website.</li>
              <li>Any errors, inaccuracies, or omissions in our content.</li>
              <li>Any unauthorised access to or alteration of your data.</li>
              <li>Any third-party conduct or content on or accessed through our website.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any
              disputes arising under or in connection with these Terms shall be subject to the exclusive
              jurisdiction of the courts of Bihar, India.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, please contact us:</p>
            <div className="contact-info">
              <p><strong>Website:</strong> aitechacademy.online</p>
              <p><strong>Email:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Official:</strong> aitechacademy@aitechacademy.online</p>
              <p><strong>Address:</strong> Newarsh Lalapur Kudara, Rohtas, Bihar, India — 821108</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
