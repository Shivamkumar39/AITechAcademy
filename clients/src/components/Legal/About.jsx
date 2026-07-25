import React from "react";
import Navbar from "../Navbar/Navbar";
import Seo from "../SEO/Seo";
import "./Legal.css";

export default function About() {
  return (
    <>
      <Seo
        title="About Us | AITECHACADEMY — AI, Tech & CSE Education"
        description="Learn about AITECHACADEMY — founded by Shivam Kushwaha, a software developer and tech educator from Bihar, India. We publish original tutorials, CSE notes, AI news, and study materials for students and professionals."
        path="/about"
      />
      <Navbar />
      <main className="legal-page">
        <div className="legal-card">
          <h1 className="legal-title">About AITECHACADEMY</h1>
          <p className="legal-subtitle">
            Empowering students and developers through original, in-depth technology education since 2024.
          </p>

          <section className="legal-section">
            <h2>Who We Are</h2>
            <p>
              AITECHACADEMY (aitechacademy.online) is an independent educational technology platform dedicated
              to providing high-quality, original content about Artificial Intelligence, Computer Science,
              Software Development, and the latest technology news. We were founded in 2024 with a clear mission:
              to make complex technology topics accessible and practical for learners at every level.
            </p>
            <p>
              Whether you are a BTech CSE student looking for study notes and previous year questions (PYQs),
              a developer seeking programming tutorials, or a professional wanting to stay current with AI
              breakthroughs — AITECHACADEMY is your trusted resource.
            </p>
          </section>

          <section className="legal-section">
            <h2>Our Mission</h2>
            <p>
              Our mission is to bridge the gap between academic theory and real-world technology practice.
              We believe every student and developer deserves access to clear, accurate, and up-to-date
              information — regardless of their background or location.
            </p>
            <p>
              We are committed to publishing content that is:
            </p>
            <ul>
              <li><strong>Original and Researched:</strong> Every article is written from scratch, thoroughly fact-checked, and reviewed before publication. We do not republish or rewrite content from other websites.</li>
              <li><strong>Practical and Actionable:</strong> Our tutorials, guides, and study materials are designed to be applied immediately — not just theoretical concepts.</li>
              <li><strong>Beginner-Friendly yet Deep:</strong> We write for students who are just starting out, but we also go deep enough to be useful for experienced engineers.</li>
              <li><strong>Regularly Updated:</strong> Technology moves fast. We review and update our articles to reflect the latest developments in AI, programming, and computer science.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>What We Cover</h2>
            <p>AITECHACADEMY publishes content across several core categories:</p>
            <ul>
              <li><strong>Artificial Intelligence &amp; Machine Learning:</strong> News, tutorials, tools, and analysis of the latest AI models, frameworks, and breakthroughs.</li>
              <li><strong>BTech CSE Study Material:</strong> Comprehensive notes, previous year question papers, assignments, and subject guides for Computer Science Engineering students.</li>
              <li><strong>Programming &amp; Software Development:</strong> Hands-on tutorials covering Python, JavaScript, web development, data structures, algorithms, and more.</li>
              <li><strong>Technology News &amp; Innovation:</strong> Curated and analyzed reporting on the latest developments in tech, startups, and digital transformation.</li>
              <li><strong>Tools &amp; Resources:</strong> Reviews and guides for AI tools, developer tools, and productivity software that help students and professionals work smarter.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Meet the Founder</h2>
            <p>
              <strong>Shivam Kushwaha</strong> is a software developer, full-stack engineer, and technology
              educator based in Bihar, India. He holds a background in Computer Science and Engineering
              and has been building web applications and teaching programming concepts since 2022.
            </p>
            <p>
              Shivam started AITECHACADEMY out of frustration with the lack of quality, India-focused
              tech education resources available to BTech students. Having personally struggled to find
              well-organized CSE notes and practical AI tutorials during his own studies, he decided to
              create the resource he wished he had.
            </p>
            <p>
              Today, he leads the editorial direction of the platform, personally writes and reviews
              the majority of articles, and manages the full-stack MERN architecture that powers the site.
            </p>
            <div className="contact-info" style={{ marginTop: '12px' }}>
              <p><strong>Skills:</strong> React, Node.js, Express, MongoDB, Python, Machine Learning, SEO</p>
              <p><strong>Email:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Location:</strong> Newarsh Lalapur Kudara, Rohtas, Bihar, India — 821108</p>
            </div>
          </section>

          <section className="legal-section">
            <h2>Our Editorial Standards</h2>
            <p>
              We take the accuracy and quality of our content seriously. Before any article is published
              on AITECHACADEMY, it goes through the following process:
            </p>
            <ol style={{ paddingLeft: '20px', lineHeight: '2' }}>
              <li><strong>Research:</strong> The topic is researched using primary sources, official documentation, and reputable academic or industry publications.</li>
              <li><strong>Writing:</strong> The article is written in original language — we never copy or paraphrase from other websites.</li>
              <li><strong>Review:</strong> The content is reviewed for technical accuracy, grammar, and readability.</li>
              <li><strong>SEO Optimization:</strong> Articles are structured to be easily discoverable by search engines without compromising content quality.</li>
              <li><strong>Updates:</strong> Published articles are revisited periodically to ensure information remains accurate and current.</li>
            </ol>
            <p style={{ marginTop: '12px' }}>
              If you notice any inaccuracies in our content, please reach out to us at
              {" "}<a href="mailto:codewithshivam9@gmail.com" style={{ color: '#00aaa1' }}>codewithshivam9@gmail.com</a>.
              We take corrections seriously and will update articles promptly.
            </p>
          </section>

          <section className="legal-section">
            <h2>Transparency &amp; Advertising</h2>
            <p>
              AITECHACADEMY is supported by advertising revenue through Google AdSense. We display
              contextually relevant advertisements to support the cost of maintaining the platform,
              including hosting, development, and content production.
            </p>
            <p>
              Our editorial content is completely independent of our advertising relationships.
              Advertisers do not influence the topics we cover, the opinions we express, or the
              recommendations we make. We clearly distinguish between editorial content and
              sponsored or advertised content.
            </p>
          </section>

          <section className="legal-section">
            <h2>Contact &amp; Collaboration</h2>
            <p>
              We welcome feedback, corrections, collaboration proposals, and business inquiries.
              If you are a student who has found our content helpful, or a professional who wants
              to contribute an article, we'd love to hear from you.
            </p>
            <div className="contact-info">
              <p><strong>General Support:</strong> codewithshivam9@gmail.com</p>
              <p><strong>Business &amp; Partnerships:</strong> aitechacademy@aitechacademy.online</p>
              <p><strong>Phone:</strong> +91 9508353863</p>
              <p><strong>Address:</strong> Newarsh Lalapur Kudara, Rohtas, Bihar, India — 821108</p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
