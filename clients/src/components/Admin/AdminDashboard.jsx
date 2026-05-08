import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { LoginContext } from '../../contextProvider/Context'
import { getAdminBlogs, getAdminStats, deleteBlogById } from '../../apis/Blogs'
import Navbar from '../Navbar/Navbar'
import './AdminDashboard.css'
import { getSiteSettings, saveSiteSettings } from '../../utils/siteSettings'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

function AdminDashboard() {
  const { loginData, setLoginData } = useContext(LoginContext)
  const [stats, setStats] = useState({ totalBlogs: 0, totalUsers: 0, totalViews: 0 })
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState('')
  const [social, setSocial] = useState(getSiteSettings())
  const pageRoute = useNavigate()
  const token = localStorage.getItem('JWTFINALTOKEN')

  const loadAdminData = async () => {
    if (!token) {
      setError('Admin access required')
      return
    }
    try {
      const statsRes = await getAdminStats(token)
      const blogsRes = await getAdminBlogs(token)
      if (statsRes?.data) setStats(statsRes.data)
      if (blogsRes?.data?.blogs) {
        const sortedBlogs = [...blogsRes.data.blogs].sort((a, b) => {
          const aDate = new Date(a.createdAt || a.publishDate || 0).getTime()
          const bDate = new Date(b.createdAt || b.publishDate || 0).getTime()
          return bDate - aDate
        })
        setBlogs(sortedBlogs)
      }
      if (statsRes?.data?.error || blogsRes?.data?.error) {
        setError(statsRes?.data?.error || blogsRes?.data?.error)
      }
    } catch (err) {
      setError('Unable to load admin data')
      console.error(err)
    }
  }

  const removeBlog = async (id) => {
    try {
      await deleteBlogById(id, token)
      setBlogs((prev) => prev.filter((blog) => blog._id !== id))
    } catch (err) {
      setError('Could not delete blog')
      console.error(err)
    }
  }
  const saveSocial = () => {
    saveSiteSettings(social)
    alert("Social links updated")
  }

  useEffect(() => {
    loadAdminData()
  }, [loginData])

  if (!loginData?._id || loginData?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className='admin-page'>
          <div className='admin-warning'>
            <h2>Admin access only</h2>
            <p>Login with an admin account to manage articles.</p>
            <button onClick={() => pageRoute('/login')}>Go to Login</button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className='admin-page'>
        <div className='admin-header'>
          <h1>Admin Dashboard</h1>
          <button className='admin-add-btn' onClick={() => pageRoute('/write')}>Add Article</button>
        </div>
        <div className='admin-stats'>
          <div className='admin-card'>
            <h3>Total Articles</h3>
            <p>{stats.totalBlogs}</p>
          </div>
          <div className='admin-card'>
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className='admin-card'>
            <h3>Total Views</h3>
            <p>{stats.totalViews}</p>
          </div>
        </div>
        {error ? <div className='admin-error'>{error}</div> : null}
        <div className='admin-blog-list' style={{ marginBottom: '20px' }}>
          <h2>Website Branding</h2>
          <div className='admin-field-group'>
            <label className='admin-label'>Website Name</label>
            <input className='admin-input' placeholder='e.g., AITECHACADEMY' value={social.websiteName || ''} onChange={(e) => setSocial({ ...social, websiteName: e.target.value })} />
            <div className='admin-ad-description'>Displayed in navbar and footer.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>Website Domain</label>
            <input className='admin-input' placeholder='e.g., aitechacademy.online' value={social.websiteDomain || ''} onChange={(e) => setSocial({ ...social, websiteDomain: e.target.value })} />
            <div className='admin-ad-description'>Used in copyright footer text.</div>
          </div>
          <button className='admin-add-btn' onClick={saveSocial}>Save Website Branding</button>
        </div>
        <div className='admin-blog-list' style={{ marginBottom: '20px' }}>
          <h2>Social Media Links (with Icons in Footer & Navbar)</h2>
          <input className='admin-input' placeholder='Facebook URL' value={social.facebook || ''} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} />
          <input className='admin-input' placeholder='Instagram URL' value={social.instagram || ''} onChange={(e) => setSocial({ ...social, instagram: e.target.value })} />
          <input className='admin-input' placeholder='Twitter URL' value={social.twitter || ''} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} />
          <input className='admin-input' placeholder='LinkedIn URL' value={social.linkedin || ''} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} />
          <input className='admin-input' placeholder='YouTube URL' value={social.youtube || ''} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} />
          <input className='admin-input' placeholder='GitHub URL' value={social.github || ''} onChange={(e) => setSocial({ ...social, github: e.target.value })} />
          <div className='admin-ad-description'>Social media icons will display in footer and navbar when URLs are provided.</div>
          <button className='admin-add-btn' onClick={saveSocial}>Save Social Links</button>
        </div>
        <div className='admin-blog-list' style={{ marginBottom: '20px' }}>
          <h2>Google AdSense Settings</h2>
          <p className='admin-ad-note'>Update the publisher and ad slot IDs here. Ads will only render on home/blog when AdSense is enabled and valid IDs are provided.</p>
          <label className='admin-check'>
            <input
              type="checkbox"
              checked={Boolean(social.adsenseEnabled)}
              onChange={(e) => setSocial({ ...social, adsenseEnabled: e.target.checked })}
            />
            Enable AdSense Ads
          </label>
          <div className='admin-field-group'>
            <label className='admin-label'>Publisher ID (Client)</label>
            <input className='admin-input' placeholder='ca-pub-xxxxxxxxxxxx' value={social.adsensePublisherId || ''} onChange={(e) => setSocial({ ...social, adsensePublisherId: e.target.value })} />
            <div className='admin-ad-description'>Used for all AdSense ad units. Without this, no ads will load.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>Banner Ad Slot (Display)</label>
            <input className='admin-input' placeholder='Home banner / homepage top ad slot' value={social.adsenseBannerSlot || ''} onChange={(e) => setSocial({ ...social, adsenseBannerSlot: e.target.value })} />
            <div className='admin-ad-description'>Displayed at home top and blog page top if configured.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>Sidebar Ad Slot (Display / Native)</label>
            <input className='admin-input' placeholder='Sidebar ad slot' value={social.adsenseSidebarSlot || ''} onChange={(e) => setSocial({ ...social, adsenseSidebarSlot: e.target.value })} />
            <div className='admin-ad-description'>Displayed in sidebar sections on the homepage.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>In-feed Ad Slot</label>
            <input className='admin-input' placeholder='Home in-feed ad slot' value={social.adsenseInfeedSlot || ''} onChange={(e) => setSocial({ ...social, adsenseInfeedSlot: e.target.value })} />
            <div className='admin-ad-description'>Displayed as an in-feed ad between featured and recent posts.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>In-article Ad Slot</label>
            <input className='admin-input' placeholder='Blog in-article ad slot' value={social.adsenseInArticleSlot || ''} onChange={(e) => setSocial({ ...social, adsenseInArticleSlot: e.target.value })} />
            <div className='admin-ad-description'>Displayed inside articles and recent post listings.</div>
          </div>
          <div className='admin-field-group'>
            <label className='admin-label'>Footer Ad Slot (Responsive)</label>
            <input className='admin-input' placeholder='Footer / bottom-of-page ad slot' value={social.adsenseFooterSlot || ''} onChange={(e) => setSocial({ ...social, adsenseFooterSlot: e.target.value })} />
            <div className='admin-ad-description'>Rendered on page footer when available.</div>
          </div>
          <button className='admin-add-btn' onClick={saveSocial}>Save AdSense Settings</button>
        </div>
        <div className='admin-blog-list'>
          <h2>All Articles</h2>
          <table className='admin-table'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Views</th>
                <th>Published</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => {
                const displayAuthor = (!blog.authorName || !blog.authorName.trim() || /TravelBrain/i.test(blog.authorName))
                  ? 'shivam_kushwaha'
                  : blog.authorName
                return (
                  <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>{displayAuthor}</td>
                    <td>{blog.category}</td>
                    <td>{blog.views || 0}</td>
                    <td>{blog.publishDate}</td>
                    <td>
                      <button className='admin-delete' onClick={() => pageRoute(`/write/${blog._id}`)}>Edit</button>
                      <button className='admin-delete' onClick={() => removeBlog(blog._id)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
