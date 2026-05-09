import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TiSocialFacebook, TiSocialLinkedin, TiSocialTwitter } from "react-icons/ti"
import { AiOutlineInstagram } from "react-icons/ai"
import axios from "axios"

import "./Home.css"
import loadingAnimation from "../../assets/loading.gif"
import { categoryCount, getAllBlogs, getSiteStats } from '../../apis/Blogs'
import { getUserById } from '../../apis/users'
import { LoginContext } from '../../contextProvider/Context'
import Navbar from '../Navbar/Navbar'
import Seo from '../SEO/Seo'
import StructuredData from '../SEO/StructuredData'
import AdSenseSlot from '../Ads/AdSenseSlot'
import { useSiteSettings } from '../../utils/siteSettings'

const url = process.env.REACT_APP_API_URL || "http://localhost:8000"
const FALLBACK_BLOG_IMAGE = "https://via.placeholder.com/1200x700?text=AITECHACADEMY"

function FeaturedBlogs({ blogs }) {
  const featured = blogs.slice(0, 2)
  if (!featured.length) return null

  return (
    <div className='featured-blogs'>
      {featured.map((blog) => (
        <article className='blog' key={blog._id}>
          <Link to={`/tag/${blog.category}`} className='category'>{blog.category}</Link>
          <Link to={`/blog/${blog._id}`}>
            <h2 className='title mt-2 mb-4'>{blog.title}</h2>
            {blog.image ? (
              <img className='blog-image' src={blog.image} alt={blog.title || 'Blog image'} onError={(e) => { e.currentTarget.src = FALLBACK_BLOG_IMAGE }} />
            ) : null}
          </Link>
          <div className='minor-info mt-3'>
            <Link style={{ textDecoration: 'none' }} to={`/profile/${blog.authorid}`}>
              <img className='author-image' src={blog.authorImage} alt={blog.authorName || 'Author'} onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/80?text=User" }} />
            </Link>
            <span className='publishdate'>{blog.authorName || 'Anonymous'}</span>
            <span className='publishdate'>| {blog.publishDate}</span>
            <span className='publishdate'>| {blog.readtime}</span>
          </div>
          <div className='intro' dangerouslySetInnerHTML={{ __html: (blog.description || '').slice(0, 150) }} />
        </article>
      ))}
    </div>
  )
}

function ShortBlogs({ blogs }) {
  return (
    <>
      {blogs.slice(0, 12).map((e) => (
        <article key={e._id} className='short-blog mb-5'>
          <Link to={`/tag/${e.category}`} className='category'>{e.category}</Link>
          <Link to={`/blog/${e._id}`}>
            <h3 className='right-blog-title short-blog-title mt-3'>{e.title}</h3>
          </Link>
          <div className='minor-info pt-2 mb-0'>
            <img className='author-image' src={e.authorImage} alt={e.authorName || 'Author'} onError={(ev) => { ev.currentTarget.src = "https://via.placeholder.com/80?text=User" }} />
            <p className='publishdate'>{e.publishDate}</p>
            <p className='publishdate'>| {e.readtime}</p>
          </div>
          <div className='intro right-intro' dangerouslySetInnerHTML={{ __html: (e.description || '').slice(0, 130) }} />
        </article>
      ))}
    </>
  )
}

function PopularAuthors() {
  const [author, setAuthor] = useState(null)

  useEffect(() => {
    const loadAuthor = async () => {
      try {
        const res = await getUserById("6356398360be867515164b63")
        setAuthor(res?.data?.success || null)
      } catch {
        setAuthor(null)
      }
    }
    loadAuthor()
  }, [])

  if (!author?._id) return null

  return (
    <Link to={`/profile/${author._id}`} style={{ textDecoration: 'none' }}>
      <div className='profile mb-5'>
        <img className='top-author' src={author.profilePic} alt={author.username || 'Author'} onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/120?text=Author" }} />
        <div className='author-info'>
          <h4 className='authorName'>{author.username}</h4>
          <h5 className='designation'>{(author.bio || 'Top contributor').slice(0, 60)}...</h5>
          <div className='authorSocials'>
            {author.facebook ? <a href={author.facebook} target='_blank' rel='noreferrer'><TiSocialFacebook className='social-icons' /></a> : null}
            {author.linkedin ? <a href={author.linkedin} target='_blank' rel='noreferrer'><TiSocialLinkedin className='social-icons' /></a> : null}
            {author.twitter ? <a href={author.twitter} target='_blank' rel='noreferrer'><TiSocialTwitter className='social-icons' /></a> : null}
            {author.instagram ? <a href={author.instagram} target='_blank' rel='noreferrer'><AiOutlineInstagram className='social-icons' /></a> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function RightSection({ catCount }) {
  const [totalViews, setTotalViews] = useState(0)

  useEffect(() => {
    const loadVisits = async () => {
      const siteStatsRes = await getSiteStats().catch(() => ({ data: { totalViews: 0 } }))
      setTotalViews(Number(siteStatsRes?.data?.totalViews || siteStatsRes?.data?.totalVisits || 0))
    }
    const handleVisitUpdate = (event) => {
      if (typeof event?.detail?.totalViews === 'number') {
        setTotalViews(event.detail.totalViews)
      } else if (typeof event?.detail?.totalVisits === 'number') {
        setTotalViews(event.detail.totalVisits)
      } else if (event?.detail?.increment) {
        setTotalViews((prev) => prev + event.detail.increment)
      }
    }

    loadVisits()
    window.addEventListener('site-visit-updated', handleVisitUpdate)
    return () => window.removeEventListener('site-visit-updated', handleVisitUpdate)
  }, [])

  return (
    <div className='sec-2-right'>
      <h3 className='featured mb-5'><span className='backgroundColor'>&nbsp;Top &nbsp;</span>&nbsp;Author</h3>
      <PopularAuthors />

      <div className='ad text-center center'>
        <p className='ad-title'>Ad</p>
        <div className='for-add'>
          <h6 className='adTitle'>Want To Collaborate Or Suggest Something?</h6>
          <p className='adDescription'>If someone discovers any bugs or technical concerns, please notify me.</p>
          <Link to='/contact-us'><button className='adBtn'>Contact</button></Link>
        </div>
      </div>

      <div className='categories-section'>
        <h3 className='featured mt-5'><span className='backgroundColor'>&nbsp;Categories&nbsp;</span></h3>
        <table className='table table-borderless mt-4'>
          <tbody>
            {Object.entries(catCount || {}).length > 0 ? (
              Object.entries(catCount).map(([category, count]) => (
                <tr key={category} className='border'>
                  <th className='categorie-title'>{category}</th>
                  <td className='text-right categorie-result'>{count || 0}</td>
                </tr>
              ))
            ) : (
              <tr className='border'>
                <td className='categorie-title'>No categories found</td>
                <td className='text-right categorie-result'>0</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='sticky-section'>
        <h3 className='featured mt-5 mb-5'><span className='backgroundColor'>&nbsp;Website&nbsp;</span>&nbsp;Update</h3>
        <div className='update-section'>
          <div className='updates-card'><h4 className='updates-no'>{totalViews}</h4><p className='updates-des'>Total Blog Views</p></div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [allBlogs, setAllBlogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [catCount, setCatCount] = useState({})
  const { setLoginData } = useContext(LoginContext)
  const settings = useSiteSettings()

  const homeSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AITECHACADEMY",
    url: process.env.REACT_APP_SITE_URL || "http://localhost:3000",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.REACT_APP_SITE_URL || "http://localhost:3000"}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }), [])

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("JWTFINALTOKEN")

        const [blogsRes, catRes, statsRes] = await Promise.all([
          getAllBlogs().catch(() => ({ data: [] })),
          categoryCount().catch(() => ({ data: {} })),
          getSiteStats().catch(() => ({ data: { totalViews: 0 } }))
        ])

        const blogs = Array.isArray(blogsRes?.data) ? blogsRes.data : []
        const sortedBlogs = [...blogs].sort((a, b) => (a._id < b._id ? 1 : -1))

        setAllBlogs(sortedBlogs)
        setCatCount(catRes?.data || {})
        if (statsRes?.data?.totalViews !== undefined) {
          window.dispatchEvent(new CustomEvent('site-visit-updated', { detail: { totalViews: statsRes.data.totalViews } }))
        }

        if (token) {
          try {
            const res = await axios.get(`${url}/validuser`, { headers: { Authorization: token } })
            if (res?.data?.status === 201) setLoginData(res.data.userValid)
            else setLoginData({})
          } catch {
            setLoginData({})
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadInitial()
  }, [setLoginData])

  return (
    <>
      <Seo
        title='AITECHACADEMY - Latest AI Tools, Education & Technology Updates'
        description='Get daily updates about AI tools, education, technology, coding, startups, inventions, and future innovations on AITECHACADEMY.'
        path='/'
        keywords='AITECHACADEMY, AI tools, education updates, technology news, coding tutorials, startup trends, future innovations'
      />
      <StructuredData data={homeSchema} />
      <Navbar />

      <div style={{ display: loading ? 'block' : 'none' }} className='loading-animation'>
        <div className='loading-div'>
          <img style={{ width: '200px', height: '200px' }} src={loadingAnimation} alt='Loading' />
        </div>
      </div>

      <div style={{ display: loading ? 'none' : '' }} className='container-fluid homepage'>
        <section className='left-section'>
          <AdSenseSlot
            className='ads-banner-slot'
            slot={settings.adsenseBannerSlot}
            fallbackText='Banner Ad Slot (Google AdSense)'
          />
          <h3 className='featured'><span className='backgroundColor'>&nbsp;Featured </span>&nbsp;This Week</h3>
          <FeaturedBlogs blogs={allBlogs} />
          <AdSenseSlot
            className='ads-infeed-slot'
            slot={settings.adsenseInfeedSlot}
            fallbackText='In-feed Ad Slot'
          />
        </section>

        <section className='right-section'>
          <AdSenseSlot
            className='ads-side-slot'
            slot={settings.adsenseSidebarSlot}
            fallbackText='Sidebar Ad Slot (Google AdSense)'
          />
          <div className='right-blog'>
            <h3 className='featured'><span className='backgroundColor'>&nbsp;Popular </span>&nbsp;Posted</h3>
            <div className='scroll'>
              <ShortBlogs blogs={allBlogs} />
            </div>
          </div>
        </section>
      </div>

      <section style={{ display: loading ? 'none' : '' }} className='section-2'>
        <div className='sec-2-left'>
          <h3 className='featured'><span className='backgroundColor'>&nbsp;Recently </span>&nbsp;Posted</h3>
          <div className='recent-blogs'>
            {allBlogs.slice(0, 10).map((e, index) => (
              <React.Fragment key={e._id}>
                <article className={`blog-card${e.image ? '' : ' no-image'}`}>
                  {e.image ? (
                    <Link to={`/blog/${e._id}`}>
                      <img className='recent-blog-img' src={e.image} alt={e.title || 'Blog'} onError={(event) => { event.currentTarget.src = FALLBACK_BLOG_IMAGE }} />
                    </Link>
                  ) : null}
                  <div className='blogInfo'>
                    <Link to={`/tag/${e.category}`} className='category'>{e.category}</Link>
                    <Link to={`/blog/${e._id}`} style={{ textDecoration: 'none' }}>
                      <h3 className='right-blog-title mt-2'>{e.title}</h3>
                    </Link>
                    <div className='minor-info'>
                      <Link style={{ textDecoration: 'none' }} to={`/profile/${e.authorid}`}>
                        <img className='author-image' src={e.authorImage} alt={e.authorName || 'Author'} onError={(event) => { event.currentTarget.src = "https://via.placeholder.com/80?text=User" }} />
                      </Link>
                      <span className='publishdate'>{e.authorName}</span>
                      <span className='publishdate'>| {e.publishDate}</span>
                      <span className='publishdate'>| {e.readtime}</span>
                    </div>
                    <div className='intro right-intro recent-blogs-intro' dangerouslySetInnerHTML={{ __html: `${(e.description || '').slice(0, 150)}...` }} />
                  </div>
                </article>
                {index === 1 && (
                  <AdSenseSlot
                    className='ads-in-article-slot'
                    slot={settings.adsenseInArticleSlot}
                    fallbackText='In-article Ad'
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <RightSection catCount={catCount} />
      </section>
      <AdSenseSlot
        className='ads-footer-slot'
        slot={settings.adsenseFooterSlot}
        fallbackText='Footer Ad Slot (Google AdSense)'
      />
    </>
  )
}

export default Home
