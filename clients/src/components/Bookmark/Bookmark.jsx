import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getBlogById } from '../../apis/Blogs'
import { LoginContext } from '../../contextProvider/Context'
import Navbar from '../Navbar/Navbar'
import noResults from "../../assets/no-results.svg"
import { SkeletonBlogList } from '../Common/Skeletons'
import Seo from '../SEO/Seo'
import "./Bookmark.css"

function Bookmark() {
  const { loginData } = useContext(LoginContext)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loginData || !loginData._id) {
      // Small delay to allow context to load before redirecting
      const timer = setTimeout(() => {
        if (!loginData?._id) navigate("/login")
      }, 1000)
      return () => clearTimeout(timer)
    }

    const fetchBookmarks = async () => {
      if (!loginData.bookmarks?.length) {
        setBookmarks([])
        return
      }

      setLoading(true)
      try {
        // Fetch all bookmarked blogs in parallel for much better performance
        const blogPromises = loginData.bookmarks.map(id => 
          getBlogById(id).catch(() => null)
        )
        
        const responses = await Promise.all(blogPromises)
        const validBlogs = responses
          .filter(res => res?.data?.message)
          .map(res => res.data.message)
        
        setBookmarks(validBlogs)
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [loginData, navigate])

  return (
    <>
      <Seo 
        title="Your Bookmarks - AITECHACADEMY" 
        description="Your saved reading list on AITECHACADEMY."
        path="/bookmarks"
      />
      <Navbar />
      
      <div className='container mt-5 bookmark-page'>
        <h3 className='featured mb-5'><span className='backgroundColor'>&nbsp;Reading </span>&nbsp;List</h3>

        {loading ? (
          <SkeletonBlogList count={loginData?.bookmarks?.length || 3} />
        ) : bookmarks.length === 0 ? (
          <div className='no-results-container'>
            <img className='no-results-img' src={noResults} alt='No bookmarks found' />
            <h3 className='featured mt-4'>No <span className='backgroundColor'>Bookmarks</span> Found</h3>
            <p className='text-muted mt-2'>Start exploring and save your favorite articles!</p>
            <Link to="/" className='explore-btn mt-4'>Explore Blogs</Link>
          </div>
        ) : (
          <div className='bookmarks-grid'>
            {bookmarks.map((blog) => (
              <article className='blog-card bookmark-card' key={blog._id}>
                <Link to={`/blog/${blog._id}`} className='bookmark-img-link'>
                  <img className='recent-blog-img' src={blog.image} alt={blog.title} />
                </Link>
                <div className='blogInfo'>
                  <Link to={`/tag/${blog.category}`} className='category'>{blog.category}</Link>
                  <Link to={`/blog/${blog._id}`} style={{ textDecoration: 'none' }}>
                    <h3 className='right-blog-title mt-2'>{blog.title}</h3>
                  </Link>
                  <div className='minor-info'>
                    <Link to={`/profile/${blog.authorid}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                      <img className='author-image' src={blog.authorImage} alt={blog.authorName} />
                      <span className='publishdate'>&nbsp;&nbsp;{blog.authorName}</span>
                    </Link>
                    <span className='publishdate'>| {blog.publishDate}</span>
                    <span className='publishdate'>| {blog.readtime}</span>
                  </div>
                  <div className='intro right-intro' dangerouslySetInnerHTML={{ __html: (blog.description || '').slice(0, 180) + '...' }} />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Bookmark