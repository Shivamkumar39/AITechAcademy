import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchBlog } from '../../apis/Blogs'
import LazyImage from '../Common/LazyImage'

function Blog({ search }) {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const searchForBlogs = async () => {
      if (!search || search.trim() === '') {
        setBlogs([])
        setSearched(false)
        return
      }
      setLoading(true)
      try {
        const res = await searchBlog(search)
        setBlogs(Array.isArray(res?.data) ? res.data : [])
        setSearched(true)
      } catch {
        setBlogs([])
        setSearched(true)
      } finally {
        setLoading(false)
      }
    }
    searchForBlogs()
  }, [search])

  if (loading) {
    return (
      <div className="search-loading">
        <div className="search-loading-spinner"></div>
        Searching blogs...
      </div>
    )
  }

  if (!search || search.trim() === '') {
    return (
      <div className="search-empty-state">
        <div className="search-empty-icon">🔍</div>
        <h3>Search for Blogs</h3>
        <p>Type something to find interesting blog posts</p>
      </div>
    )
  }

  if (searched && blogs.length === 0) {
    return (
      <div className='noResults'>
        <p>No blogs found for "<strong>{search}</strong>"<br />
          Make sure all words are spelled correctly.<br />
          Try different or more general keywords.</p>
      </div>
    )
  }

  return (
    <>
      {blogs.map((e) => (
        <Link key={e._id} to={`/blog/${e.slug}`} className="search-blog-card">
          <div className="search-blog-img-wrap">
            {e.image ? (
              <LazyImage
                src={e.image}
                alt={e.title || 'Blog post'}
                fallbackSrc='https://via.placeholder.com/400x250?text=Blog'
              />
            ) : (
              <div className="search-blog-placeholder">
                <span>{e.title}</span>
              </div>
            )}
          </div>
          <div className="search-blog-info">
            <span className="search-blog-category">{e.category}</span>
            <h3 className="search-blog-title">{e.title}</h3>
            <div className="search-blog-meta">
              {e.authorImage && (
                <LazyImage
                  src={e.authorImage}
                  alt={e.authorName || 'Author'}
                  fallbackSrc='https://via.placeholder.com/80?text=User'
                />
              )}
              <span>{e.authorName || 'Anonymous'}</span>
              {e.publishDate && <span>| {e.publishDate}</span>}
              {e.readtime && <span>| {e.readtime}</span>}
            </div>
            {e.description && (
              <div
                className="search-blog-desc"
                dangerouslySetInnerHTML={{ __html: (e.description || '').slice(0, 150) }}
              />
            )}
          </div>
        </Link>
      ))}
    </>
  )
}

export default Blog
