import React, { useEffect, useState, useContext, memo } from 'react'
import "./Profile.css"
import { BsFacebook } from 'react-icons/bs';
import defaultprofile from "../../assets/defaultprofile.png"
import { AiFillTwitterCircle, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import { getUserById, userFollowers, userFollowings } from '../../apis/users';
import { getAuthorBlogs } from '../../apis/Blogs';
import { LoginContext } from '../../contextProvider/Context';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import { Link } from "react-router-dom"
import Navbar from '../Navbar/Navbar';
import { SkeletonBlogCard } from '../Common/Skeletons'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  p: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const ProfileBlogCard = memo(({ e }) => (
  <Link style={{ textDecoration: "none" }} to={`/blog/${e._id}`}>
    <div className='blog my-blog-single'>
      <div className="profile-blog-image-wrapper">
        <img className='blog-image' src={e.image} alt={e.title} loading="lazy" />
        <div className="blog-category-badge">{e.category}</div>
      </div>
      <div className="blog-content-wrapper">
        <h2 className='profile-blog-title'>{e.title}</h2>
        <div className='blog-meta-footer'>
          <div className='author-small'>
            <img className='author-image-small' src={e.authorImage} alt={e.authorName} />
            <span>{e.authorName}</span>
          </div>
          <div className='read-time-small'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{e.readtime}</span>
          </div>
        </div>
      </div>
    </div>
  </Link>
));

function Profile() {
  const [user, setUser] = useState({})
  const [userBlogs, setUserBlogs] = useState([])
  const { loginData } = useContext(LoginContext)
  const [userBlogsExist, setUserBlogsExist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const [spinner, setSpinner] = useState(false)
  const [open, setOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false)
  const [followingsProf, setFollowingsProf] = useState([])
  const [followersProf, setFollowersProf] = useState([])
  const [followingSpinner, setFollowingSpinner] = useState(false)
  const [followerSpinner, setFollowerSpinner] = useState(false)

  const url = process.env.REACT_APP_API_URL || "http://localhost:8000"
  const { id } = useParams()
  const userId = loginData?._id

  const getUserData = async () => {
    setLoading(true)
    try {
      const res = await getUserById(id)
      setUser(res.data.success || {})
      
      const blogRes = await getAuthorBlogs(id)
      if (blogRes.data.Blogs && blogRes.data.Blogs.length > 0) {
        setUserBlogsExist(true)
        setUserBlogs(blogRes.data.Blogs)
      } else {
        setUserBlogsExist(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const profileUpdate = async () => {
    try {
      const res1 = await userFollowers(id)
      const res2 = await userFollowings(id)
      setFollowers(res1.data.followers || [])
      setFollowings(res2.data.followings || [])
    } catch (err) {
      console.error(err)
    }
  }

  const followBtn = async () => {
    if (!userId) return alert("Please login to follow authors")
    setSpinner(true)
    try {
      await axios.patch(`${url}/${id}/follow`, { userId })
      await profileUpdate()
    } finally {
      setSpinner(false)
    }
  }

  const unfollowBtn = async () => {
    setSpinner(true)
    try {
      await axios.patch(`${url}/${id}/unfollow`, { userId })
      await profileUpdate()
    } finally {
      setSpinner(false)
    }
  }

  const fetchFollowings = async () => {
    if (followings.length === 0) return
    setFollowingSpinner(true)
    try {
      const res = await Promise.all(followings.map(fid => getUserById(fid)))
      setFollowingsProf(res.map(r => r.data.success))
    } finally {
      setFollowingSpinner(false)
    }
  }

  const fetchFollowers = async () => {
    if (followers.length === 0) return
    setFollowerSpinner(true)
    try {
      const res = await Promise.all(followers.map(fid => getUserById(fid)))
      setFollowersProf(res.map(r => r.data.success))
    } finally {
      setFollowerSpinner(false)
    }
  }

  useEffect(() => {
    getUserData()
    profileUpdate()
    window.scrollTo(0, 0)
  }, [id])

  return (
    <div className="profile-page-root">
      <Navbar />
      
      {/* Modals for Followers/Following */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header-custom">
            <h3>Following</h3>
            <button onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="modal-body-custom">
            {followingSpinner ? (
              <div className='modal-loading'>Fetching Following...</div>
            ) : followings.length === 0 ? (
              <div className='modal-empty'>No Followings Yet</div>
            ) : (
              followingsProf.map(e => (
                <div key={e._id} className='user-follow-item'>
                  <div className='user-follow-info'>
                    <img className='user-follow-avatar' src={e.profilePic || defaultprofile} alt={e.username} />
                    <div>
                      <p className='user-follow-name'>{e.fullname || e.username}</p>
                      <p className='user-follow-handle'>@{e.username}</p>
                    </div>
                  </div>
                  <Link to={`/profile/${e._id}`} onClick={() => setOpen(false)}>
                    <button className='user-follow-view-btn'>View</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Box>
      </Modal>

      <Modal open={followersOpen} onClose={() => setFollowersOpen(false)}>
        <Box sx={modalStyle}>
          <div className="modal-header-custom">
            <h3>Followers</h3>
            <button onClick={() => setFollowersOpen(false)}>&times;</button>
          </div>
          <div className="modal-body-custom">
            {followerSpinner ? (
              <div className='modal-loading'>Fetching Followers...</div>
            ) : followers.length === 0 ? (
              <div className='modal-empty'>No Followers Yet</div>
            ) : (
              followersProf.map(e => (
                <div key={e._id} className='user-follow-item'>
                  <div className='user-follow-info'>
                    <img className='user-follow-avatar' src={e.profilePic || defaultprofile} alt={e.username} />
                    <div>
                      <p className='user-follow-name'>{e.fullname || e.username}</p>
                      <p className='user-follow-handle'>@{e.username}</p>
                    </div>
                  </div>
                  <Link to={`/profile/${e._id}`} onClick={() => setFollowersOpen(false)}>
                    <button className='user-follow-view-btn'>View</button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </Box>
      </Modal>

      <div className='profile-main-wrapper'>
        {/* Profile Hero Section */}
        <section className='profile-hero-section'>
          <div className='profile-cover-v2'>
            <div className='cover-gradient-overlay'></div>
          </div>
          
          <div className='profile-content-container'>
            <div className='profile-identity-card'>
              <div className='profile-avatar-container'>
                <div className='avatar-ring'>
                  {loading ? (
                    <div className="skeleton-avatar-large"></div>
                  ) : (
                    <img className='profile-avatar-img' src={user.profilePic || defaultprofile} alt={user.username} />
                  )}
                </div>
              </div>
              
              <div className='profile-text-content'>
                <div className='profile-header-actions'>
                  <div className='name-handle-group'>
                    <h1 className='profile-full-name'>{loading ? "Loading Author..." : user.fullname || user.username}</h1>
                    <span className='profile-username-tag'>@{user.username}</span>
                  </div>
                  
                  <div className='profile-primary-actions'>
                    {user._id === userId ? (
                      <Link to={`/edit/${user._id}`}>
                        <button className='btn-premium-outline'>Edit Profile</button>
                      </Link>
                    ) : (
                      <button 
                        onClick={followers.includes(userId) ? unfollowBtn : followBtn} 
                        className={`btn-premium ${followers.includes(userId) ? 'btn-unfollow' : 'btn-follow'}`}
                        disabled={spinner}
                      >
                        {spinner ? "Processing..." : followers.includes(userId) ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
                
                <p className='profile-biography'>{user.bio || "Crafting stories and sharing knowledge with the community."}</p>
                
                <div className='profile-metrics-bar'>
                  <div className='metric-pill' onClick={() => { setFollowersOpen(true); fetchFollowers(); }}>
                    <span className='metric-count'>{followers.length}</span>
                    <span className='metric-label'>Followers</span>
                  </div>
                  <div className='metric-pill' onClick={() => { setOpen(true); fetchFollowings(); }}>
                    <span className='metric-count'>{followings.length}</span>
                    <span className='metric-label'>Following</span>
                  </div>
                  <div className='metric-pill'>
                    <span className='metric-count'>{userBlogs.length}</span>
                    <span className='metric-label'>Publications</span>
                  </div>
                </div>

                {(user.instagram || user.linkedin || user.facebook || user.twitter) && (
                  <div className='profile-social-dock'>
                    {user.instagram && <a href={user.instagram} target="_blank" rel="noreferrer" title="Instagram"><AiFillInstagram /></a>}
                    {user.twitter && <a href={user.twitter} target="_blank" rel="noreferrer" title="Twitter"><AiFillTwitterCircle /></a>}
                    {user.facebook && <a href={user.facebook} target="_blank" rel="noreferrer" title="Facebook"><BsFacebook /></a>}
                    {user.linkedin && <a href={user.linkedin} target="_blank" rel="noreferrer" title="LinkedIn"><AiFillLinkedin /></a>}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* User Blogs Section */}
        <section className='profile-blogs-grid-section'>
          <div className='content-max-width'>
            <div className='section-header-v2'>
              <h2 className='v2-title'>
                {user._id === userId ? "My Stories" : `Latest from ${user.fullname || user.username}`}
              </h2>
              <div className='v2-divider'></div>
            </div>

            <div className='v2-blogs-grid'>
              {loading ? (
                Array(6).fill(0).map((_, i) => <SkeletonBlogCard key={i} />)
              ) : userBlogsExist ? (
                userBlogs.map(blog => <ProfileBlogCard key={blog._id} e={blog} />)
              ) : (
                <div className='v2-empty-state'>
                  <div className='empty-illustration'>
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/sorry-item-not-found-3328225-2809510.png" alt="Empty" />
                  </div>
                  <h3>No Stories Found</h3>
                  <p>This author hasn't published any stories yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile