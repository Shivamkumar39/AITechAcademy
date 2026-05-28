import React from 'react';
import { useSiteSettings } from '../../utils/siteSettings';
import Navbar from '../Navbar/Navbar';
import './Resume.css';

import Seo from '../SEO/Seo';

function Resume() {
  const settings = useSiteSettings();
  const resumeUrl = settings?.resumePdf || "";

  // Helper function to format the URL for embedding
  const getEmbedUrl = (url) => {
    if (!url) return "";
    // Convert Google Drive share links to preview links
    if (url.includes("drive.google.com/file/d/")) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    return url;
  };

  const embedUrl = getEmbedUrl(resumeUrl);

  return (
    <>
      <Seo
        title="My Resume - AITECHACADEMY"
        description="View and download my professional resume and portfolio directly from AITECHACADEMY."
        path="/resume"
        keywords="Resume, CV, Portfolio, AITECHACADEMY, Professional Profile"
      />
      <Navbar />
      <div className="resume-page-container">
        <h1 className="resume-heading">My Resume</h1>
        
        {resumeUrl ? (
          <div className="resume-content-wrapper">
            <div className="resume-actions">
              <a 
                href={resumeUrl} 
                download="My_Resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resume-download-btn"
              >
                <i className="fa-solid fa-download"></i> Download Resume
              </a>
            </div>
            
            <div className="resume-viewer-container">
               <iframe 
                 src={embedUrl} 
                 title="Resume PDF Viewer"
                 className="pdf-iframe"
                 allow="autoplay"
               />
            </div>
          </div>
        ) : (
          <div className="resume-empty">
            <i className="fa-regular fa-file-pdf empty-icon"></i>
            <p>Resume is not available yet. Please check back later.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Resume;
