import React, { useEffect, useState, useContext } from 'react'
import "./Blog.css"
import { BsLink45Deg } from 'react-icons/bs';
import { AiOutlineShareAlt, AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { VscComment } from "react-icons/vsc"
import { MdOutlineBookmarkAdd, MdOutlineBookmark } from "react-icons/md"
import { Link, useParams } from "react-router-dom"
import { bookmark, getAllBlogs, getBlogById, likeBlog, unbookmark, unlikeBlog } from "../../apis/Blogs.js"
import { LoginContext } from '../../contextProvider/Context';
import { RightSection } from "../Homepage/Home.jsx"
import Navbar from '../Navbar/Navbar';
import Share from '../AdditionalPages/Share';
import loadingAnimation from "../../assets/loading.gif"
import AdSenseSlot from '../Ads/AdSenseSlot'
import { getSiteSettings } from '../../utils/siteSettings'

function PopularAuthors(props) {


  return (
    <>

      <div className='profile mb-5'>
        <img className='top-author' src={props.popularAuthorImg} alt="" />
        <div className='author-info'>
          <h4 className='authorName'>{props.popularAuthorName}</h4>
          <h5 className='designation'>{props.popularAuthorDesignation}</h5>
          <button className='follow-btn'>Follow</button>
        </div>
      </div>
    </>
  )
}
function Blog() {
  const FALLBACK_BLOG_IMAGE = "https://via.placeholder.com/1200x700?text=AIVista+Journal"
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlog, setRecentBlog] = useState([])

  const { loginData } = useContext(LoginContext)
  const [bookmarkSet, setBookmark] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(false)
  const [showApp, setShowApp] = useState(false)
  const [showCopy, setShowCopy] = useState(false)
  const settings = getSiteSettings()

  const getRecent = async () => {
    const res = await getAllBlogs()
    const allBlogs = Array.isArray(res?.data) ? res.data : []
    const sortedBlogs = [...allBlogs].sort((a, b) => (a._id < b._id ? 1 : -1))
    setRecentBlog(sortedBlogs)
  }
  const getBlog = async () => {
    setLoading(true)
    const res = await getBlogById(id)
    const data = res?.data?.message
    if (data) {
      setBlog(data)
      setLikes(data.likes || [])
    }
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const checkLogin = () => {
    if (!loginData || !loginData._id) {
      alert("Please login first to perform this action")
      window.location.href = "/login"
      return false
    }
    return true
  }

  const bookmarkBlog = async () => {
    if (!checkLogin()) return
    await bookmark(id, { userId: loginData._id })
    setBookmark(true)
  }
  const unbookmarkBlog = async () => {
    if (!checkLogin()) return
    await unbookmark(id, { userId: loginData._id })
    setBookmark(false)
  }
  const like = async () => {
    if (!checkLogin()) return
    await likeBlog(id, { userId: loginData._id })
    setLiked(true)
    getBlog()
  }
  const unlike = async () => {
    if (!checkLogin()) return
    await unlikeBlog(id, { userId: loginData._id })
    setLiked(false)
    getBlog()
  }
  const shareToApps = () => {
    if (!checkLogin()) return
    if (showApp === false) {
      setShowApp(true)
    }
    else {
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
    getBlog()
  }, [id])

  useEffect(() => {
    getRecent()
  }, [])

  useEffect(() => {
    const isBookmarked = !!loginData?.bookmarks?.includes(blog?._id)
    setBookmark(isBookmarked)
    const isLiked = !!blog?.likes?.includes(loginData?._id)
    setLiked(isLiked)
  }, [blog, loginData])

  if (loading || !blog) {
    return (
      <>
        <Navbar />
        <div className='loading-animation'>
          <div className='loading-div'>
            <img style={{ width: '200px', height: '200px' }} src={loadingAnimation} alt='Loading' />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='blog-container'>
        <section className='blog-section'>
          {
            <>
              <span className='category'>{blog.category}</span>
              <div className='topBlogFlex'>


                <div className='minor-info single-info'>
                  <a href={`/profile/${blog.authorid}`}>
                    <img className='author-image single-blog-author' src={blog.authorImage} alt='okay' onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=User"; e.currentTarget.alt = 'okay' }} />

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
              <AdSenseSlot
                className='ads-blog-header-slot'
                slot={settings.adsenseBannerSlot}
                fallbackText='Ad Slot'
              />
              <div className='single-blog-container'>
                <h3 className='single-blog-title'>{blog.title}</h3>
                <img className='single-blog-image' src={blog.image} alt="okay" onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_IMAGE; e.currentTarget.alt = 'okay' }} />
                <div className='description-area' dangerouslySetInnerHTML={{ __html: blog.description }}>

                </div>
                <AdSenseSlot
                  className='ads-blog-inline-slot'
                  slot={settings.adsenseInArticleSlot}
                  fallbackText='In-article Ad Slot'
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
                    {/* <AiOutlineShareAlt style={{ color: "black" }} className='link-icon' /> */}
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
                  <div className='enddots'></div>
                  <div className='enddots'></div>
                  <div className='enddots'></div>
                  <div className='enddots'></div>
                </div>
              </div>
              <div className='recent-blog-container'>
                <h3 className='featured pt-4 mb-5'><span className='backgroundColor'>&nbsp;See Related&nbsp;</span>&nbsp;Posts</h3>
                <AdSenseSlot
                  className='ads-related-posts-slot'
                  slot={settings.adsenseInfeedSlot}
                  fallbackText='In-feed Ad Slot'
                />
                <div className='related-blogs'>
                  {

                    recentBlog.map((e, index) => {
                      if (index < 10) {
                        return (
                          <React.Fragment key={e._id}>
                            <Link style={{ textDecoration: "none" }} to={`/blog/${e._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                              <div className='blog-card'>
                                <img className='recent-blog-img' src={e.image} alt='okay' onError={(ev) => { ev.currentTarget.src = FALLBACK_BLOG_IMAGE; ev.currentTarget.alt = 'okay' }} />
                                <div className='blogInfo'>
                                  <span className='category'>{e.category}</span>
                                  <h3 className='right-blog-title mt-2'>{e.title}</h3>
                                  <div className='minor-info'>
                                    <img className='author-image' src={e.authorImage || "https://via.placeholder.com/40?text=User"} alt='okay' onError={(ev) => { ev.currentTarget.src = "https://via.placeholder.com/40?text=User"; ev.currentTarget.alt = 'okay' }} />
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
                            {index === 1 && (
                              <AdSenseSlot
                                className='ads-related-posts-slot'
                                slot={settings.adsenseSidebarSlot}
                                fallbackText='Ad Slot'
                              />
                            )}
                          </React.Fragment>
                        )
                      }
                      return null
                    })


                  }
                </div>
              </div>
              <div className='comment-section'>
                <h3>{blog?.comments?.length || 0} Comment{(blog?.comments?.length || 0) === 1 ? '' : 's'}</h3>
              </div>
              <AdSenseSlot
                className='ads-blog-footer-slot'
                slot={settings.adsenseFooterSlot}
                fallbackText='Ad Slot'
              />
            </>

          }






        </section>
        <RightSection />
      </div>
    </>
  )
}

export default Blog
