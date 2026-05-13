import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function TermsAndConditions() {
  const lastUpdated = "May 13, 2026";

  return (
    <>
      <Seo title="Terms and Conditions | AITECHACADEMY" description="Read our terms and conditions for using AITECHACADEMY." path="/terms-and-conditions" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Terms and Conditions</h1>
          <p className="legal-subtitle">Last updated: {lastUpdated}</p>
          
          <section className="legal-section">
            <p>Welcome to AITECHACADEMY!</p>
            <p>These terms and conditions outline the rules and regulations for the use of AITECHACADEMY's Website, located at aitechacademy.online.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use AITECHACADEMY if you do not agree to take all of the terms and conditions stated on this page.</p>
          </section>

          <section className="legal-section">
            <h2>Cookies</h2>
            <p>We employ the use of cookies. By accessing AITECHACADEMY, you agreed to use cookies in agreement with the AITECHACADEMY's Privacy Policy.</p>
            <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>
          </section>

          <section className="legal-section">
            <h2>License</h2>
            <p>Unless otherwise stated, AITECHACADEMY and/or its licensors own the intellectual property rights for all material on AITECHACADEMY. All intellectual property rights are reserved. You may access this from AITECHACADEMY for your own personal use subjected to restrictions set in these terms and conditions.</p>
            <p>You must not:</p>
            <ul>
              <li>Republish material from AITECHACADEMY</li>
              <li>Sell, rent or sub-license material from AITECHACADEMY</li>
              <li>Reproduce, duplicate or copy material from AITECHACADEMY</li>
              <li>Redistribute content from AITECHACADEMY</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>User Comments</h2>
            <p>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. AITECHACADEMY does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of AITECHACADEMY, its agents and/or affiliates.</p>
            <p>AITECHACADEMY reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</p>
          </section>

          <section className="legal-section">
            <h2>Hyperlinking to our Content</h2>
            <p>The following organizations may link to our Website without prior written approval:</p>
            <ul>
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Content Liability</h2>
            <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>
          </section>

          <section className="legal-section">
            <h2>Disclaimer</h2>
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website.</p>
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
