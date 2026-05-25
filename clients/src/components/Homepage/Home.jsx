import React, { useContext, useEffect, useState, memo } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"

import "./Home.css"
import { categoryCount, getAllBlogs, getSiteStats } from '../../apis/Blogs'
import { LoginContext } from '../../contextProvider/Context'
import Navbar from '../Navbar/Navbar'
import Seo from '../SEO/Seo'
import { Helmet } from "react-helmet-async";
import AdSenseSlot from '../Ads/AdSenseSlot'
import AdBanner from '../Ads/AdBanner'
import { useSiteSettings } from '../../utils/siteSettings'
import { SkeletonBlogCard, SkeletonBlogList } from '../Common/Skeletons'
import LazyImage from '../Common/LazyImage'
import { resolveImageUrl } from '../../utils/imageUrl'

const url = process.env.REACT_APP_API_URL || "http://localhost:8000"
const BLOG_CACHE_KEY = "CACHE_BLOGS_V2"
const BLOG_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'><rect width='1200' height='700' fill='%23e5e7eb'/></svg>"
const AVATAR_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='none'><rect width='24' height='24' rx='6' fill='%23e8edf2'/><circle cx='12' cy='9' r='4' fill='%2390a4b4'/><path d='M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6' fill='%2390a4b4'/></svg>"
const preloadImage = (src) => new Promise((resolve) => {
  // Skip preloading during react-snap build to avoid timeouts
  if (typeof window !== 'undefined' && window.navigator.userAgent.includes('ReactSnap')) {
    return resolve();
  }
  if (!src) return resolve()
  const img = new Image()
  img.onload = () => resolve()
  img.onerror = () => resolve()
  img.src = resolveImageUrl(src)
})

// SIMPLE IMAGE COMPONENT - NO LOGIC, JUST DISPLAY
const SimpleImage = memo(({ src, alt, className }) => {
  const isAvatar = className?.includes("author-image");
  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      fallbackSrc={isAvatar ? AVATAR_FALLBACK : BLOG_FALLBACK}
    />
  );
});

// Exporting RightSection for use in Blog.jsx
export const RightSection = memo(({ catCount, loading, siteStats }) => {
  const settings = useSiteSettings();
  return (
    <div className='sec-2-right'>
      <div className='right-blog sticky-sidebar'>
        <h3 className='featured'><span className='backgroundColor'>&nbsp;Categories </span></h3>
        <div className='category-list mt-4'>
          {[
            "Educational", "News", "Latest AI News", "Innovation",
            "Study Material", "Technology", "Btech CSE Material"
          ].map((name) => {
            // Find case-insensitive match in catCount
            const countKey = Object.keys(catCount || {}).find(k => k.toLowerCase() === name.toLowerCase());
            const count = countKey ? catCount[countKey] : 0;
            return (
              <Link key={name} to={`/tag/${name}`} className='category-item'>
                <span className="cat-name">{name}</span>
                <span className='count'>{count}</span>
              </Link>
            );
          })}
        </div>

        <div className="visitor-stats-card mt-4">
          <div className="visitor-info">
            <div className="visitor-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <div className="visitor-details">
              <p className="visitor-label">Total Visits</p>
              <h4 className="visitor-count-number">{loading ? "..." : (siteStats?.totalVisits || "1,024")}</h4>
            </div>
          </div>
        </div>

        <AdSenseSlot
          className='ads-sidebar-slot mt-4'
          slot={settings.adsenseSidebarSlot}
          fallbackText='Advertisement'
          minHeight="300px"
        />
      </div>
    </div>
  )
})

const FeaturedBlogs = memo(({ blogs }) => {
  const featured = blogs.slice(0, 2)
  if (!featured.length) return null

  return (
    <div className='featured-blogs'>
      {featured.map((blog) => (
        <article className='blog' key={blog._id}>
          <Link to={`/tag/${blog.category}`} className='category'>{blog.category}</Link>
          <Link to={`/blog/${blog.slug || blog._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <h2 className='title'>{blog.title}</h2>
          </Link>
          <Link to={`/blog/${blog.slug || blog._id}`} style={{ display: 'block' }}>
            <SimpleImage src={blog.image} alt={blog.title} className='blog-image' />
          </Link>
          <div className='minor-info'>
            <Link to={`/profile/${blog.authorid}`}><SimpleImage src={blog.authorImage} alt='Author' className='author-image' /></Link>
            <span className='publishdate'>{blog.authorName}</span>
            <span className='publishdate'>| {blog.publishDate}</span>
            <span className='publishdate'>| {blog.readtime}</span>
          </div>
          <div className='intro' dangerouslySetInnerHTML={{ __html: (blog.description || '').slice(0, 160) + '...' }} />
        </article>
      ))}
    </div>
  )
})

const ShortBlogs = memo(({ blogs }) => {
  return (
    <>
      {blogs.slice(0, 12).map((e) => (
        <article key={e._id} className='short-blog'>
          <Link to={`/tag/${e.category}`} className='category'>{e.category}</Link>
          <Link to={`/blog/${e.slug || e._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            <h3 className='right-blog-title'>{e.title}</h3>
          </Link>
          <div className='minor-info'>
            <SimpleImage src={e.authorImage} alt='Author' className='author-image' />
            <p className='publishdate'>{e.authorName}</p>
            <p className='publishdate'>| {e.publishDate}</p>
          </div>
        </article>
      ))}
    </>
  )
})

const Home = () => {
  const { setLoginData } = useContext(LoginContext)
  const [allBlogs, setAllBlogs] = useState([])
  const [catCount, setCatCount] = useState({})
  const [siteStats, setSiteStats] = useState({ totalVisits: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)
  const settings = useSiteSettings()

  useEffect(() => {
    const handleVisitUpdate = (e) => {
      if (e.detail?.totalVisits) {
        setSiteStats(prev => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener('site-visit-updated', handleVisitUpdate);
    return () => window.removeEventListener('site-visit-updated', handleVisitUpdate);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch API first
        const [blogsRes, catsRes, statsRes] = await Promise.all([
          getAllBlogs().catch(() => null),
          categoryCount().catch(() => ({ data: {} })),
          getSiteStats().catch(() => ({}))
        ])

        const blogs = Array.isArray(blogsRes?.data) ? blogsRes.data : []
        
        if (blogs.length > 0) {
          await Promise.all(
            blogs.slice(0, 12).flatMap((b) => [preloadImage(b.image), preloadImage(b.authorImage)])
          )
          setAllBlogs(blogs)
          localStorage.setItem(BLOG_CACHE_KEY, JSON.stringify(blogs))
        } else {
          // If API fails or returns no data, use cache as fallback
          const cachedBlogs = JSON.parse(localStorage.getItem(BLOG_CACHE_KEY) || '[]')
          if (Array.isArray(cachedBlogs) && cachedBlogs.length) {
            setAllBlogs(cachedBlogs)
          }
        }

        setCatCount(catsRes?.data || {})

        if (statsRes?.data) {
          setSiteStats(statsRes.data)
          window.dispatchEvent(new CustomEvent('site-visit-updated', { detail: statsRes.data }));
        }

        const token = localStorage.getItem("JWTFINALTOKEN")
        if (token && token.split('.').length === 3) {
          axios.get(`${url}/validuser`, { headers: { Authorization: token } })
            .then(res => { if (res.data.status === 201) setLoginData(res.data.userValid) })
            .catch(() => { localStorage.removeItem("JWTFINALTOKEN"); setLoginData({}) });
        } else if (token) {
          localStorage.removeItem("JWTFINALTOKEN");
          setLoginData({});
        }
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <>
      <Navbar />
      {allBlogs && allBlogs.length > 0 && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '10px 20px', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}>
          Check out our latest article: <Link to={`/blog/${allBlogs[0].slug || allBlogs[0]._id}`} style={{ color: '#0056b3', textDecoration: 'underline' }}>{allBlogs[0].title}</Link> here
        </div>
      )}
      <Seo
        title="AITECHACADEMY - Home"
        description="AITECHACADEMY provides CSE notes, PYQs, assignments, AI tools, coding tutorials, and latest technology blogs for students and developers."
        path="/"
        image="https://aitechacademy.online/image.png"
        keywords="AI tools,Latest News, Breaking News, BTech CSE, Study Material, Tech News, Technology, News, AI, Innovation, AI News, PYQ, tutorials coding, CSE notes, PYQ, assignments, tech blogs, programming,  education"
        type="website"
      />
      <div className='homepage'>
        <section className='left-section'>
          <h3 className='featured'><span className='backgroundColor'>&nbsp;Featured </span>&nbsp;This Week</h3>
          {loading ? (
            <SkeletonBlogCard count={2} />
          ) : (
            <FeaturedBlogs blogs={allBlogs} />
          )}
        </section>

        <section className='right-section'>
          <div className='right-blog'>
            <h3 className='featured'><span className='backgroundColor'>&nbsp;Popular </span>&nbsp;Posted</h3>
            <div className='scroll'>
              {loading ? (
                <SkeletonBlogList count={4} />
              ) : (
                <ShortBlogs blogs={allBlogs} />
              )}
            </div>
          </div>
        </section>
      </div>

      <section className='section-2'>
        <div className='sec-2-left'>
          <h3 className='featured'><span className='backgroundColor'>&nbsp;Recently </span>&nbsp;Posted</h3>
          <div className='recent-blogs'>
            {loading ? (
              <SkeletonBlogList count={6} />
            ) : (
              allBlogs.slice(0, 10).map((e) => (
                <article key={e._id} className='blog-card'>
                  <Link to={`/blog/${e.slug || e._id}`} style={{ display: 'block' }} className='recent-blog-img-link'>
                    <SimpleImage src={e.image} alt={e.title} className='recent-blog-img' />
                  </Link>
                  <div className='blogInfo'>
                    <Link to={`/tag/${e.category}`} className='category'>{e.category}</Link>
                    <Link to={`/blog/${e.slug || e._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <h1 className='single-blog-title'>{e.title}</h1>
                    </Link>
                    <div className='minor-info'>
                      <SimpleImage src={e.authorImage} alt='Author' className='author-image' />
                      <span className='publishdate'>{e.authorName}</span>
                      <span className='publishdate'>| {e.publishDate}</span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
        <RightSection catCount={catCount} loading={loading} siteStats={siteStats} />
      </section>
      <AdBanner />
    </>
  )
}

export default Home
