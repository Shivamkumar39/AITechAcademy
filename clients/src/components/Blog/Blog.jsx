import React, { useEffect, useState, useContext, memo } from 'react'
import "./Blog.css"
import { BsLink45Deg } from 'react-icons/bs';
import { AiOutlineShareAlt, AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { VscComment } from "react-icons/vsc"
import { MdOutlineBookmarkAdd, MdOutlineBookmark } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import { bookmark, getAllBlogs, getBlogById, likeBlog, unbookmark, unlikeBlog, addComment } from "../../apis/Blogs.js"
import { LoginContext } from '../../contextProvider/Context';
import { RightSection } from "../Homepage/Home.jsx"
import Navbar from '../Navbar/Navbar';
import Share from '../AdditionalPages/Share';
import AdSenseSlot from '../Ads/AdSenseSlot'
import AdBanner from '../Ads/AdBanner'
import { getGuestId, useSiteSettings } from '../../utils/siteSettings'
import { SkeletonBlogDetail, SkeletonBlogCard } from '../Common/Skeletons'

const RelatedPost = memo(({ e, FALLBACK_BLOG_IMAGE }) => (
  <Link style={{ textDecoration: "none" }} to={`/blog/${e._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <div className='blog-card'>
      <div className="aspect-ratio-box" style={{ borderRadius: '8px', height: '200px', background: '#f1f5f9', overflow: 'hidden' }}>
        {e.image ? (
          <img 
            className='recent-blog-img' 
            src={e.image} 
            alt={e.title || 'Blog post'} 
            width="400"
            height="250"
            loading="lazy"
            onError={(ev) => { ev.currentTarget.src = FALLBACK_BLOG_IMAGE; ev.currentTarget.alt = e.title || 'Blog post' }} 
          />
        ) : (
          <div className="blog-placeholder-mini">
            <span className="placeholder-text-small">{e.title}</span>
          </div>
        )}
      </div>
      <div className='blogInfo'>
        <span className='category'>{e.category}</span>
        <h3 className='right-blog-title mt-2'>{e.title}</h3>
        <div className='minor-info'>
          <img 
            className='author-image' 
            src={e.authorImage || "https://via.placeholder.com/40?text=User"} 
            alt={e.authorName || 'Author image'} 
            width="40"
            height="40"
            loading="lazy"
            onError={(ev) => { ev.currentTarget.src = "https://via.placeholder.com/40?text=User"; ev.currentTarget.alt = e.authorName || 'Author image' }} 
          />
          <span className='publishdate'>&nbsp;&nbsp;{e.authorName || 'shivam_kushwaha'}</span>
          &nbsp;
          <div className='icons-flex'> &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 small-icons">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
          </svg>&nbsp;
            <p className='publishdate'>{e.publishDate}</p></div>
          &nbsp;
          <div className='icons-flex'> &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 small-icons">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
            &nbsp;
            <p className='publishdate'>{e.readtime}</p></div>
        </div>
        <div className='intro right-intro' dangerouslySetInnerHTML={{ __html: e.description.slice(0, 200) }} />
      </div>
    </div>
  </Link>
));

function Blog() {
  const FALLBACK_BLOG_IMAGE = "https://via.placeholder.com/1200x700?text=AIVista+Journal"
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlog, setRecentBlog] = useState([])

  const { loginData } = useContext(LoginContext)
  const [bookmarkSet, setBookmark] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [showCopy, setShowCopy] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState(false)
  const settings = useSiteSettings()
  const guestId = getGuestId()

  const getRecent = async () => {
    const res = await getAllBlogs()
    const allBlogs = Array.isArray(res?.data) ? res.data : []
    const sortedBlogs = [...allBlogs].sort((a, b) => (a._id < b._id ? 1 : -1))
    setRecentBlog(sortedBlogs)
  }
  const getBlog = async (isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true)
    }
    const res = await getBlogById(id)
    const data = res?.data?.message
    if (data) {
      setBlog(data)
      setLikes(data.likes || [])
    }
    if (isInitialLoad) {
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  const checkLogin = () => {
    if (!loginData || !loginData._id) {
      return false
    }
    return true
  }

  const bookmarkBlog = async () => {
    if (!checkLogin()) {
      alert("Please login first to bookmark this article")
      window.location.href = "/login"
      return
    }
    // Optimistic update
    setBookmark(true)
    await bookmark(id, { userId: loginData._id })
    getBlog(false) // Silent sync
  }
  const unbookmarkBlog = async () => {
    if (!checkLogin()) {
      alert("Please login first to manage bookmarks")
      window.location.href = "/login"
      return
    }
    // Optimistic update
    setBookmark(false)
    await unbookmark(id, { userId: loginData._id })
    getBlog(false) // Silent sync
  }
  const like = async () => {
    const currentUserId = loginData?._id || guestId
    // Optimistic update
    setLiked(true)
    setLikes(prev => prev.includes(currentUserId) ? prev : [...prev, currentUserId])
    
    await likeBlog(id, { userId: currentUserId })
    getBlog(false) // Silent sync
  }
  const unlike = async () => {
    const currentUserId = loginData?._id || guestId
    // Optimistic update
    setLiked(false)
    setLikes(prev => prev.filter(userId => userId !== currentUserId))
    
    await unlikeBlog(id, { userId: currentUserId })
    getBlog(false) // Silent sync
  }
  const submitComment = async () => {
    if (!commentText.trim()) {
      alert("Enter a comment before posting")
      return
    }
    setSubmittingComment(true)
    try {
      const newComment = {
        userId: loginData?._id || guestId,
        info: commentText.trim(),
        blogId: id,
      }
      await addComment(id, { userId: newComment.userId, info: newComment.info })
      
      // Optimistic update
      setBlog((prevBlog) => ({
        ...prevBlog,
        comments: [...(prevBlog.comments || []), newComment],
      }))
      
      setCommentText("")
      setCommentSuccess(true)
      setTimeout(() => setCommentSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to add comment:", error)
      alert("Failed to post comment. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }
  const shareToApps = () => {
    if (showApp === false) {
      setShowApp(true)
    } else {
      setShowApp(false)
    }
  }
  const copytoclipboard = () => {

    navigator.clipboard.writeText(window.location.href)
    setShowCopy(true)
    setTimeout(() => {
      setShowCopy(false)
    }, 2000);
  }
  useEffect(() => {
    getBlog(true) // Initial load with loading state and scroll
  }, [id])

  useEffect(() => {
    getRecent()
  }, [])

  useEffect(() => {
    const isBookmarked = !!loginData?.bookmarks?.includes(blog?._id)
    setBookmark(isBookmarked)
    const currentUserId = loginData?._id || guestId
    const isLiked = !!blog?.likes?.includes(currentUserId)
    setLiked(isLiked)
  }, [blog, loginData, guestId])

  return (
    <>
      <Navbar />
      <div className='blog-container'>
        <section className='blog-section'>
          {loading || !blog ? (
            <SkeletonBlogDetail />
          ) : (
            <>
              <span className='category'>{blog.category}</span>
              <div className='topBlogFlex'>
                <div className='minor-info single-info'>
                  <a href={`/profile/${blog.authorid}`}>
                    <img 
                      className='author-image single-blog-author' 
                      src={blog.authorImage} 
                      alt={blog.authorName || 'Author image'} 
                      width="60"
                      height="60"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=User"; e.currentTarget.alt = blog.authorName || 'Author image' }} 
                    />
                  </a>

                  <div className='authorProfileInfo'>
                    <a href={`/profile/${blog.authorid}`}>
                      <p className='profile-author-name pl-1'>{blog.authorName || 'shivam_kushwaha'}</p>
                    </a>

                    <div className='profileMinorInfo'>
                      <div className='icons-flex'> &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 small-icons">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                      </svg>&nbsp;
                        <p className='publishdate'>&nbsp;{blog.publishDate}&nbsp;</p></div>
                      <div><span className='dot m-1'>.</span></div>
                      <div className='icons-flex'> &nbsp;<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 small-icons">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                        &nbsp;
                        <p className='publishdate'>&nbsp;{blog.readtime}&nbsp;</p></div>

                      <div className='link-div'>
                        <MdOutlineBookmarkAdd style={{ display: bookmarkSet ? "none" : "block" }} onClick={() => bookmarkBlog()} className='bookmark-icon blog-icons' />
                        <MdOutlineBookmark style={{ display: bookmarkSet ? "block" : "none" }} onClick={() => unbookmarkBlog()} className='bookmark-icon blog-icons' />
                        <BsLink45Deg onClick={copytoclipboard} className='link-icon blog-icons' />
                        <span style={{ display: showCopy ? "block" : "none" }} className='copied'>Copied</span>
                      </div>
                    </div>
                  </div>
                  &nbsp;
                </div>
              </div>
              <AdBanner className='ads-blog-header-slot' />
              <div className='single-blog-container'>
                <h3 className='single-blog-title'>{blog.title}</h3>
                <div className="aspect-ratio-box" style={{ borderRadius: '12px', marginBottom: '30px' }}>
                  <img 
                    className='single-blog-image' 
                    src={blog.image} 
                    alt={blog.title || 'Blog image'} 
                    width="1200"
                    height="700"
                    fetchpriority="high"
                    onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_IMAGE; e.currentTarget.alt = blog.title || 'Blog image' }} 
                  />
                </div>
                <div className='description-area' dangerouslySetInnerHTML={{ __html: blog.description }}></div>
                
                {blog.pdfLinks && blog.pdfLinks.length > 0 && (
                  <div className='pdf-downloads-container'>
                    <h4 className='pdf-downloads-title'>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#ff4d4f' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      Downloads
                    </h4>
                    <div className='pdf-downloads-grid'>
                      {blog.pdfLinks.map((pdf, index) => (
                        <a key={index} href={pdf.link} target='_blank' rel='noopener noreferrer' className='pdf-download-btn'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {pdf.text || 'Download PDF'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <AdSenseSlot
                  className='ads-blog-inline-slot'
                  slot={settings.adsenseInArticleSlot}
                  fallbackText='In-article Ad Slot'
                  minHeight="250px"
                />

                <div className='appreciation'>
                  <div className='like-comment'>
                    <div>
                      <AiOutlineLike style={{ display: liked ? "none" : "block" }} onClick={like} className='appreciation-icon' />
                      <AiFillLike style={{ display: liked ? "block" : "none" }} onClick={unlike} className='appreciation-icon' />
                      <span>{likes.length}</span>
                    </div>
                    <div>
                      <VscComment className='appreciation-icon' />
                      <span>{blog?.comments?.length || 0}</span>
                    </div>
                  </div>
                  <div className='link-bookmark'>
                    <div className='sharing-div'>
                      <div style={{ display: showApp ? "" : "none" }} className='share-apps'>
                        <Share link={window.location.href} />
                      </div>
                      <AiOutlineShareAlt onClick={shareToApps} style={{ color: "black" }} className='link-icon' />
                    </div>
                    <MdOutlineBookmarkAdd style={{ display: bookmarkSet ? "none" : "block", marginTop: "2px" }} onClick={() => bookmarkBlog()} className='bookmark-icon blog-icons mt-1' />
                    <MdOutlineBookmark style={{ display: bookmarkSet ? "block" : "none", marginTop: "2px" }} onClick={() => unbookmarkBlog()} className='bookmark-icon blog-icons ' />
                  </div>
                </div>
                <div className='end-dots mt-5'>
                  <div className='enddots'></div><div className='enddots'></div><div className='enddots'></div><div className='enddots'></div>
                </div>
              </div>

              <div className='recent-blog-container'>
                <h3 className='featured pt-4 mb-5'><span className='backgroundColor'>&nbsp;See Related&nbsp;</span>&nbsp;Posts</h3>
                <AdSenseSlot
                  className='ads-related-posts-slot'
                  slot={settings.adsenseInfeedSlot}
                  fallbackText='In-feed Ad Slot'
                  minHeight="250px"
                />
                <div className='related-blogs'>
                  {recentBlog.slice(0, 10).map((e, index) => (
                    <React.Fragment key={e._id}>
                      <RelatedPost e={e} FALLBACK_BLOG_IMAGE={FALLBACK_BLOG_IMAGE} />
                      {index === 1 && (
                        <AdSenseSlot
                          className='ads-related-posts-slot'
                          slot={settings.adsenseSidebarSlot}
                          fallbackText='Ad Slot'
                          minHeight="250px"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className='comment-section'>
                <h3 className='comments-heading'>{blog?.comments?.length || 0} Comment{(blog?.comments?.length || 0) === 1 ? '' : 's'}</h3>
                <div className='comment-form-wrapper'>
                  <div className='comment-form'>
                    <textarea
                      className='comment-textarea'
                      placeholder='Share your thoughts on this article...'
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={submittingComment}
                      maxLength={500}
                    />
                    <div className='comment-form-footer'>
                      <span className='comment-char-count'>{commentText.length}/500</span>
                      <button className='comment-submit' onClick={submitComment} disabled={submittingComment || !commentText.trim()}>
                        {submittingComment ? '✓ Posting...' : '✓ Post Comment'}
                      </button>
                    </div>
                    {commentSuccess && <div className='comment-success-msg'>✓ Comment posted successfully!</div>}
                  </div>
                </div>
                <div className='comment-list'>
                  {blog?.comments && blog.comments.length > 0 ? (
                    blog.comments.map((comment, index) => (
                      <div key={`${comment.blogId}-${index}`} className='comment-item'>
                        <div className='comment-avatar'>{(comment.userId === loginData?._id ? 'You' : comment.userId || 'Visitor').charAt(0).toUpperCase()}</div>
                        <div className='comment-body'>
                          <div className='comment-header'>
                            <strong className='comment-author'>{comment.userId === loginData?._id ? 'You' : comment.userId || 'Visitor'}</strong>
                            <span className='comment-index'>#{index + 1}</span>
                          </div>
                          <p className='comment-text'>{comment.info}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='no-comments'><p>No comments yet. Be the first to share your thoughts!</p></div>
                  )}
                </div>
              </div>
              <AdSenseSlot
                className='ads-blog-footer-slot'
                slot={settings.adsenseFooterSlot}
                fallbackText='Ad Slot'
                minHeight="250px"
              />
            </>
          )}
        </section>
        <RightSection loading={loading} />
      </div>
    </>
  )
}

export default Blog
