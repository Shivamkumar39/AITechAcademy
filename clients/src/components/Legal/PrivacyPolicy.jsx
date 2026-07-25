import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function PrivacyPolicy() {
  const lastUpdated = "July 18, 2026";
  
  return (
    <>
      <Seo title="Privacy Policy | AITECHACADEMY" description="Privacy policy for AITECHACADEMY. We value your privacy and data security." path="/privacy-policy" />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Last updated: {lastUpdated}</p>
          
          <section className="legal-section">
            <p>At AITECHACADEMY, accessible from aitechacademy.online, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AITECHACADEMY and how we use it.</p>
            <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
          </section>

          <section className="legal-section">
            <h2>Log Files</h2>
            <p>AITECHACADEMY follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>
          </section>

          <section className="legal-section">
            <h2>Cookies and Web Beacons</h2>
            <p>Like any other website, AITECHACADEMY uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
          </section>

          <section className="legal-section">
            <h2>Google AdSense and DoubleClick Cookie</h2>
            <p>Google, as a third-party vendor, uses cookies to serve ads on our site. Specifically:</p>
            <ul>
              <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Ads Settings</a>.</li>
              <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Privacy Policies</h2>
            <p>You may consult this list to find the Privacy Policy for each of the advertising partners of AITECHACADEMY.</p>
            <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on AITECHACADEMY, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
            <p>Note that AITECHACADEMY has no access to or control over these cookies that are used by third-party advertisers.</p>
          </section>

          <section className="legal-section">
            <h2>Third Party Privacy Policies</h2>
            <p>AITECHACADEMY's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>
            <p>You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.</p>
          </section>

          <section className="legal-section">
            <h2>Children's Information</h2>
            <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
            <p>AITECHACADEMY does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>
          </section>

          <section className="legal-section">
            <h2>Online Privacy Policy Only</h2>
            <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in AITECHACADEMY. This policy is not applicable to any information collected offline or via channels other than this website.</p>
          </section>

          <section className="legal-section">
            <h2>Consent</h2>
            <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
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
