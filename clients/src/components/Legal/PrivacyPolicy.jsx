import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function PrivacyPolicy() {
  const lastUpdated = "August 7, 2026";

  return (
    <>
      <Seo
        title="Privacy Policy | AITECHACADEMY"
        description="Read the full Privacy Policy for AITECHACADEMY. We explain what data we collect, how we use it, your rights under GDPR and CCPA, and how Google AdSense uses cookies on our platform."
        path="/privacy-policy"
      />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: {lastUpdated}</p>

          <section className="legal-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to AITECHACADEMY ("we", "us", or "our"). We operate the website
              <strong> aitechacademy.online</strong> (the "Service"). This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you visit our website. By
              using this website, you agree to the collection and use of information in accordance with
              this policy.
            </p>
            <p>
              If you have additional questions or require more information about our Privacy Policy,
              do not hesitate to contact us at{" "}
              <a href="mailto:codewithshivam9@gmail.com" style={{ color: "#00aaa1" }}>
                codewithshivam9@gmail.com
              </a>.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Information We Collect</h2>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>2.1 Information You Provide Directly</h3>
            <p>We may collect the following types of personal information that you provide voluntarily:</p>
            <ul>
              <li><strong>Account information</strong> — When you register for an account, we collect your name, email address, username, and password.</li>
              <li><strong>Profile information</strong> — Optional profile picture and bio that you add to your account.</li>
              <li><strong>Comments</strong> — Text content you submit in article comment sections.</li>
              <li><strong>Contact form data</strong> — Your name, email, and message when you submit our contact form.</li>
            </ul>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>2.2 Information Collected Automatically</h3>
            <p>
              When you visit our website, certain information is automatically collected from your device and browser, including:
            </p>
            <ul>
              <li><strong>Log data</strong> — IP address, browser type and version, pages visited, time and date of visits, time spent on pages, and referring/exit pages.</li>
              <li><strong>Device information</strong> — Browser type, operating system, screen resolution, and device identifiers.</li>
              <li><strong>Usage data</strong> — Clickstream data, articles read, searches performed, and bookmarks saved.</li>
              <li><strong>Cookies</strong> — We and our third-party partners use cookies and similar tracking technologies. See Section 4 for full details.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>To create and manage your account and provide personalised features (bookmarks, comments).</li>
              <li>To operate, maintain, and improve our website and services.</li>
              <li>To send you transactional emails (e.g., password resets) — <em>never marketing without consent</em>.</li>
              <li>To analyse how visitors use our site so we can improve content quality.</li>
              <li>To display relevant advertisements through Google AdSense.</li>
              <li>To detect, prevent, and address technical issues and security vulnerabilities.</li>
              <li>To comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              Like most websites, AITECHACADEMY uses cookies — small text files stored on your browser — to
              enhance your experience and enable features such as staying logged in and remembering your preferences.
            </p>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>Types of Cookies We Use</h3>
            <ul>
              <li><strong>Essential cookies</strong> — Required for the website to function correctly (login sessions, security tokens).</li>
              <li><strong>Analytics cookies</strong> — Help us understand how visitors interact with our website (e.g., Google Analytics).</li>
              <li><strong>Advertising cookies</strong> — Used by Google AdSense to serve personalised ads based on your interests and browsing history.</li>
            </ul>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>Google AdSense and DoubleClick Cookies</h3>
            <p>
              We use Google AdSense to display advertisements. Google, as a third-party vendor, uses cookies
              (including the DoubleClick cookie) to serve ads based on a user's prior visits to this website
              or other websites.
            </p>
            <ul>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and other sites on the Internet.</li>
              <li>You may opt out of personalised advertising by visiting{" "}
                <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>
                  Google's Ads Settings
                </a>.
              </li>
              <li>
                Alternatively, you can opt out of a third-party vendor's use of cookies for personalised advertising
                by visiting{" "}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>
                  www.aboutads.info
                </a>.
              </li>
              <li>
                You can also opt out via the{" "}
                <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>
                  Network Advertising Initiative opt-out page
                </a>.
              </li>
            </ul>
            <p>
              To learn more about how Google uses data from sites that use its services, visit{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>
                Google's Privacy &amp; Terms
              </a>.
            </p>
            <h3 style={{ fontWeight: "600", margin: "12px 0 6px" }}>Managing Cookies</h3>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to refuse all
              cookies, delete existing cookies, or be notified when cookies are set. Note that disabling
              cookies may affect the functionality of our website. For instructions, visit:
            </p>
            <ul>
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Apple Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Microsoft Edge</a></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Third-Party Services</h2>
            <p>
              We work with the following third-party services that may collect data independently under their own privacy policies:
            </p>
            <ul>
              <li><strong>Google AdSense</strong> — For displaying advertisements. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Google Privacy Policy</a></li>
              <li><strong>Google Analytics</strong> — For anonymised website traffic analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Google Privacy Policy</a></li>
              <li><strong>Cloudflare</strong> — For CDN and security services. <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>Cloudflare Privacy Policy</a></li>
              <li><strong>MongoDB Atlas</strong> — For database hosting. <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#00aaa1" }}>MongoDB Privacy Policy</a></li>
            </ul>
            <p>
              We do not control these third parties and are not responsible for their privacy practices.
              We encourage you to review their respective privacy policies.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal data only as long as necessary for the purposes set out in this Privacy Policy.
              Specifically:
            </p>
            <ul>
              <li><strong>Account data</strong> — Retained for as long as your account is active. You may delete your account at any time by contacting us.</li>
              <li><strong>Comment data</strong> — Retained for as long as the associated article is published.</li>
              <li><strong>Log data</strong> — Typically retained for 90 days.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Your Rights (GDPR and CCPA)</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Right to access</strong> — Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to rectification</strong> — Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to erasure</strong> — Request deletion of your personal data ("right to be forgotten").</li>
              <li><strong>Right to restrict processing</strong> — Request that we limit how we use your data.</li>
              <li><strong>Right to data portability</strong> — Receive your data in a machine-readable format.</li>
              <li><strong>Right to object</strong> — Object to our processing of your data for direct marketing.</li>
              <li><strong>Right to opt out of personalised ads</strong> — Opt out of having your data used for personalised advertising (see Section 4).</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:codewithshivam9@gmail.com" style={{ color: "#00aaa1" }}>codewithshivam9@gmail.com</a>.
              We will respond within 30 days.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              AITECHACADEMY is not intended for children under the age of 13. We do not knowingly collect
              personal information from children under 13. If you are a parent or guardian and believe that
              your child has provided us with personal information, please contact us immediately at{" "}
              <a href="mailto:codewithshivam9@gmail.com" style={{ color: "#00aaa1" }}>codewithshivam9@gmail.com</a>{" "}
              and we will promptly delete such information from our records.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Security</h2>
            <p>
              We take the security of your personal data seriously and implement appropriate technical and
              organisational measures to protect it against unauthorised access, loss, or disclosure. These
              measures include encrypted HTTPS connections, secure password hashing (bcrypt), and regular
              security reviews. However, no internet transmission is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated"
              date at the top of this page. We encourage you to review this Privacy Policy periodically to stay
              informed about how we are protecting your information. Your continued use of the website after any
              changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or your data rights, please contact us:</p>
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
