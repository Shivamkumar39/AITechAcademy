import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { useSiteSettings } from "../../utils/siteSettings";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaGithub } from "react-icons/fa";

export default function Footer() {
  const social = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="footer-row">
        <div className="footer-left">
          <div className="footer-brand">{social.websiteName || "AITECHACADEMY"}</div>
          <div className="footer-tagline">Fresh AI, technology and lifestyle ideas — built for readers who want clean, fast, modern content.</div>
        </div>
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/about">About</Link>
          <Link to="/contact-us">Contact Us</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>
      </div>

      <div className="footer-social">
        {social.facebook && (
          <a href={social.facebook} target="_blank" rel="noreferrer" title="Facebook" className="footer-social-icon">
            <FaFacebook />
          </a>
        )}
        {social.instagram && (
          <a href={social.instagram} target="_blank" rel="noreferrer" title="Instagram" className="footer-social-icon">
            <FaInstagram />
          </a>
        )}
        {social.twitter && (
          <a href={social.twitter} target="_blank" rel="noreferrer" title="Twitter" className="footer-social-icon">
            <FaTwitter />
          </a>
        )}
        {social.linkedin && (
          <a href={social.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" className="footer-social-icon">
            <FaLinkedin />
          </a>
        )}
        {social.youtube && (
          <a href={social.youtube} target="_blank" rel="noreferrer" title="YouTube" className="footer-social-icon">
            <FaYoutube />
          </a>
        )}
        {social.github && (
          <a href={social.github} target="_blank" rel="noreferrer" title="GitHub" className="footer-social-icon">
            <FaGithub />
          </a>
        )}
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} {social.websiteDomain || "aitechacademy.online"}. All rights reserved.</div>
    </footer>
  );
}

