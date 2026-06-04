import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaSearch, FaDownload, FaChevronDown, FaChevronUp, FaBookReader, FaInfoCircle } from 'react-icons/fa';
import { MdOutlineBookmarkAdd, MdOutlineBookmark } from 'react-icons/md';
import Navbar from '../components/Navbar/Navbar';
import Seo from '../components/SEO/Seo';
import StructuredData from '../components/SEO/StructuredData';
import { LoginContext } from '../contextProvider/Context';
import { getStudyMaterials, bookmark, unbookmark } from '../apis/Blogs';
import { resolveImageUrl } from '../utils/imageUrl';
import LazyImage from '../components/Common/LazyImage';
import './StudyMaterial.css';

function StudyMaterial() {
  const { loginData, setLoginData } = useContext(LoginContext);
  const [materials, setMaterials] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch initial study materials to extract all dynamic tags once (so they don't disappear when filtering)
  useEffect(() => {
    const fetchInitialTags = async () => {
      try {
        const res = await getStudyMaterials('', '');
        if (res?.data) {
          const extracted = extractTags(res.data);
          setTags(extracted);
        }
      } catch (err) {
        console.error('Error fetching initial tags:', err);
      }
    };
    fetchInitialTags();
  }, []);

  // Fetch materials whenever search query or selected tag changes (with a 300ms debounce for search query)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMaterials();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedTag]);

  // Click outside to close active PDF dropdown
  useEffect(() => {
    const handleOuterClick = () => {
      setActiveDropdown(null);
    };
    window.addEventListener('click', handleOuterClick);
    return () => window.removeEventListener('click', handleOuterClick);
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await getStudyMaterials(searchQuery, selectedTag);
      if (res?.data) {
        setMaterials(res.data);
      }
    } catch (err) {
      console.error('Error fetching study materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const extractTags = (materialsList) => {
    const allTags = new Set();
    materialsList.forEach((item) => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((t) => {
          const cleanTag = t.trim();
          // Exclude generic 'study material' tags to avoid noise/redundancy
          if (cleanTag && cleanTag.toLowerCase() !== 'study material') {
            allTags.add(cleanTag);
          }
        });
      }
    });
    return Array.from(allTags);
  };

  // Plain-text stripper for HTML description preview
  const getPlainDescription = (htmlString) => {
    if (!htmlString) return '';
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      return doc.body.textContent || '';
    } catch (_) {
      // Fallback regex in case DOMParser isn't available
      return htmlString.replace(/<[^>]+>/g, '');
    }
  };

  const handleBookmarkToggle = async (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!loginData || !loginData._id) {
      alert('Please login first to bookmark this study material');
      window.location.href = '/login';
      return;
    }

    const isCurrentlyBookmarked = loginData.bookmarks?.includes(blogId);

    // Optimistic update of local user context bookmarks
    let updatedBookmarks;
    if (isCurrentlyBookmarked) {
      updatedBookmarks = (loginData.bookmarks || []).filter((id) => id !== blogId);
      setLoginData((prev) => ({ ...prev, bookmarks: updatedBookmarks }));
      try {
        await unbookmark(blogId, { userId: loginData._id });
      } catch (err) {
        console.error('Failed to unbookmark:', err);
        // Rollback state on error
        setLoginData((prev) => ({ ...prev, bookmarks: [...(prev.bookmarks || []), blogId] }));
      }
    } else {
      updatedBookmarks = [...(loginData.bookmarks || []), blogId];
      setLoginData((prev) => ({ ...prev, bookmarks: updatedBookmarks }));
      try {
        await bookmark(blogId, { userId: loginData._id });
      } catch (err) {
        console.error('Failed to bookmark:', err);
        // Rollback state on error
        setLoginData((prev) => ({
          ...prev,
          bookmarks: (prev.bookmarks || []).filter((id) => id !== blogId),
        }));
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
  };

  // Structured Schema data for SEO
  const structuredDataPayload = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Study Material - AITECHACADEMY',
    'description': 'Access premium study materials, previous year question papers, notes, and academic files for Computer Science and Engineering courses.',
    'url': 'https://aitechacademy.online/study-material',
    'provider': {
      '@type': 'Organization',
      'name': 'AITECHACADEMY',
      'logo': 'https://aitechacademy.online/image.png'
    }
  };

  return (
    <>
      <Seo
        title="Study Material & Notes - AITECHACADEMY"
        description="Access and download high-quality reference notes, subject materials, previous year papers (PYQ), and PDF resources for B.Tech CSE students."
        path="/study-material"
        keywords="Study Material, Notes, BTech CSE, Computer Science Notes, Previous Year Papers, PYQ, AITECHACADEMY, PDF Downloads"
      />
      <StructuredData data={structuredDataPayload} />
      <Navbar />

      <div className="study-material-container">
        {/* Hero Banner Section */}
        <section className="study-material-hero">
          <h1>
            <FaBookOpen /> Study Material
          </h1>
          <p>
            Gain an academic edge with curated notes, semester question papers, and downloadable reference resources designed for excellence.
          </p>
        </section>

        {/* Copyright Disclaimer Notice */}
        <div className="study-material-disclaimer" style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          padding: '12px 18px',
          margin: '0 auto 24px auto',
          maxWidth: '1100px',
          fontSize: '0.85rem',
          color: '#92400e',
          lineHeight: '1.6'
        }}>
          <FaInfoCircle style={{ marginTop: '2px', flexShrink: 0, color: '#d97706' }} />
          <span>
            <strong>Educational Use Disclaimer:</strong> Study materials, notes, and reference resources shared on this page are intended solely for educational and academic reference purposes. Copyright of all examination papers, syllabi, and institutional documents belongs to the respective universities, boards, and authors. AITECHACADEMY does not claim ownership of any copyrighted third-party material.
          </span>
        </div>

        {/* Search & Tag Controls */}
        <section className="study-material-controls">
          <div className="search-wrapper">
            <div className="search-icon-wrapper">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search by subject, title or syllabus topic..."
              className="study-material-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {tags.length > 0 && (
            <div className="tags-filter-section">
              <span className="tags-filter-title">Filter by syllabus tag</span>
              <div className="tags-carousel-container">
                <button
                  className={`filter-tag-chip ${selectedTag === '' ? 'active' : ''}`}
                  onClick={() => setSelectedTag('')}
                >
                  All Topics
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    className={`filter-tag-chip ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Materials Grid / Loaders */}
        {loading ? (
          <div className="study-material-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="material-card skeleton" key={i}>
                <div className="card-thumbnail-container skeleton-loader" style={{ height: '200px' }}></div>
                <div className="card-content-area" style={{ gap: '8px' }}>
                  <div className="skeleton-loader" style={{ width: '40%', height: '16px', borderRadius: '4px' }}></div>
                  <div className="skeleton-loader" style={{ width: '80%', height: '22px', borderRadius: '4px', marginTop: '4px' }}></div>
                  <div className="skeleton-loader" style={{ width: '100%', height: '48px', borderRadius: '4px', marginTop: '4px' }}></div>
                  <div className="skeleton-loader" style={{ width: '100%', height: '1px', margin: '8px 0' }}></div>
                  <div className="skeleton-loader" style={{ width: '55%', height: '16px', borderRadius: '4px' }}></div>
                  <div className="skeleton-loader" style={{ width: '100%', height: '40px', borderRadius: '10px', marginTop: '12px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : materials.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBookReader />
            </div>
            <h3>No Materials Found</h3>
            <p>We couldn't find any resources matching your search queries. Try checking for general terms or clearing your filters.</p>
            <button className="clear-search-btn" onClick={clearFilters}>
              Clear Search & Filters
            </button>
          </div>
        ) : (
          <div className="study-material-grid">
            {materials.map((item) => {
              const isBookmarked = !!loginData?.bookmarks?.includes(item._id);
              const customTags = (item.tags || []).filter(
                (t) => t.trim().toLowerCase() !== 'study material'
              );
              const firstCustomTag = customTags[0] || null;
              const plainDesc = getPlainDescription(item.description);

              return (
                <article className="material-card" key={item._id}>
                  {/* Card Thumbnail / Header */}
                  <div className="card-thumbnail-container">
                    {/* Badge System */}
                    <div className="badge-container">
                      <span className="category-badge">{item.category}</span>
                      {firstCustomTag && <span className="material-badge">{firstCustomTag}</span>}
                    </div>

                    {/* Bookmark Icon */}
                    <button
                      className={`bookmark-overlay-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={(e) => handleBookmarkToggle(e, item._id)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Save Material'}
                    >
                      {isBookmarked ? <MdOutlineBookmark size={20} /> : <MdOutlineBookmarkAdd size={20} />}
                    </button>

                    <Link to={`/blog/${item.slug}`}>
                      <LazyImage
                        className="card-thumbnail"
                        src={item.image}
                        alt={item.title}
                        fallbackSrc="https://via.placeholder.com/600x400?text=Study+Material"
                      />
                    </Link>
                  </div>

                  {/* Card Body */}
                  <div className="card-content-area">
                    <Link to={`/blog/${item.slug}`} className="card-title-link">
                      <h3 className="card-title">{item.title}</h3>
                    </Link>
                    <p className="card-desc">
                      {plainDesc.slice(0, 140)}
                      {plainDesc.length > 140 ? '...' : ''}
                    </p>

                    {/* Meta Section */}
                    <div className="card-meta">
                      <LazyImage
                        className="meta-author-img"
                        src={item.authorImage}
                        alt={item.authorName}
                        fallbackSrc="https://via.placeholder.com/80?text=User"
                      />
                      <span>{item.authorName || 'Academy Contributor'}</span>
                      <span>•</span>
                      <span>{item.publishDate || 'Recent'}</span>
                    </div>

                    {/* Internal Tags list */}
                    {customTags.length > 0 && (
                      <div className="card-tags-pills">
                        {customTags.slice(0, 3).map((tag, idx) => (
                          <span
                            className="card-tag-pill"
                            key={idx}
                            onClick={() => setSelectedTag(tag)}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Download Button Section */}
                    {item.pdfLinks && item.pdfLinks.length > 0 && (
                      <div className="card-action-bar">
                        {item.pdfLinks.length === 1 ? (
                          <a
                            href={item.pdfLinks[0].link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pdf-download-btn"
                          >
                            <FaDownload /> {item.pdfLinks[0].text || 'Download PDF'}
                          </a>
                        ) : (
                          <div className="pdf-links-dropdown">
                            <button
                              className="pdf-download-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveDropdown(
                                  activeDropdown === item._id ? null : item._id
                                );
                              }}
                            >
                              <FaDownload /> Download Part{' '}
                              {activeDropdown === item._id ? <FaChevronUp /> : <FaChevronDown />}
                            </button>
                            {activeDropdown === item._id && (
                              <ul className="dropdown-list" onClick={(e) => e.stopPropagation()}>
                                {item.pdfLinks.map((pdf, idx) => (
                                  <li key={idx}>
                                    <a
                                      href={pdf.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="dropdown-item-link"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <FaDownload style={{ color: '#0f8f87' }} />{' '}
                                      {pdf.text || `PDF Part ${idx + 1}`}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default StudyMaterial;
