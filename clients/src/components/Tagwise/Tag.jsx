import React from 'react'
import "./Tag.css"
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogByTag } from "../../apis/Blogs.js"
import noResults from "../../assets/no-results.svg"
import Navbar from '../Navbar/Navbar'
import { SkeletonBlogList } from '../Common/Skeletons'
import Seo from '../SEO/Seo'
import LazyImage from '../Common/LazyImage'

function Tag() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    const fetchByTag = async () => {
      // 1. Instant load from cache
      const cacheKey = `CACHE_TAG_${id}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setBlogs(JSON.parse(cached));
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const res = await blogByTag(id);
        const data = res?.data?.blogs || [];
        setBlogs(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        console.error("Tag fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchByTag();
  }, [id]);

  return (
    <>
      <Seo
        title={`${id} Blogs, Notes, PYQs & Tutorials`}
        description={`Find latest ${id} blogs, coding tutorials, CSE notes, PYQs and study material on AITECHACADEMY.`}
        path={`/tag/${id}`}
        type="website"
        keywords={`${id}, ${id} blogs, ${id} notes, ${id} tutorials, coding, AI tools, CSE`}
      />
      <Navbar />
      <div className='container mt-5'>
        {loading ? (
          <div className='mt-5'>
            <h3 className='featured mt-5 tagHeader'>&nbsp;Searching for&nbsp;<span className='backgroundColor'>&nbsp;{id}&nbsp;</span>...</h3>
            <SkeletonBlogList count={4} />
          </div>
        ) : (
          <>
            <h1 style={{ display: blogs.length === 0 ? "none" : "block" }} className='featured mt-5 tagHeader'>&nbsp;Articles about&nbsp;<span className='backgroundColor'>&nbsp;{id}&nbsp;</span></h1>
            {blogs.length === 0 ? (
              <div className='no-results'>
                <img src={noResults} alt='No results found' />
                <h3 className='featured'>&nbsp;No&nbsp;<span className='backgroundColor'>&nbsp;Results&nbsp;</span></h3>
              </div>
            ) : (
              <div className='tag-blogs-list'>
                {blogs.map((e) => (
                  <article key={e._id} className='blog-card mb-4'>
                    <Link to={`/blog/${e.slug}`} className='recent-blog-img-link'>
                      <div className="aspect-ratio-box" style={{ borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', minHeight: '180px' }}>
                        {e.image ? (
                          <LazyImage className='recent-blog-img' src={e.image} alt={e.title} />
                        ) : (
                          <div className="blog-placeholder-mini"><span className="placeholder-text-small">Loading...</span></div>
                        )}
                      </div>
                    </Link>
                    <div className='blogInfo'>
                      <span className='category'>{e.category}</span>
                      <Link to={`/blog/${e.slug}`} style={{ textDecoration: 'none' }}>
                        <h3 className='right-blog-title mt-2'>{e.title}</h3>
                      </Link>
                      <div className='minor-info'>
                        <LazyImage className='author-image' src={e.authorImage} alt={e.authorName} fallbackSrc="https://via.placeholder.com/80?text=User" />
                        <span className='publishdate'>&nbsp;&nbsp;{e.authorName}</span>
                        <span className='publishdate'>&nbsp;&nbsp;| {e.publishDate}</span>
                        <span className='publishdate'>&nbsp;&nbsp;| {e.readtime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default Tag
