import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchAuthor } from '../../apis/Blogs'
import defaultprofile from '../../assets/defaultprofile.png'
import LazyImage from '../Common/LazyImage'

function Author({ search }) {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const searchForAuthors = async () => {
      if (!search || search.trim() === '') {
        setAuthors([])
        setSearched(false)
        return
      }
      setLoading(true)
      try {
        const res = await searchAuthor(search)
        setAuthors(Array.isArray(res?.data) ? res.data : [])
        setSearched(true)
      } catch {
        setAuthors([])
        setSearched(true)
      } finally {
        setLoading(false)
      }
    }
    searchForAuthors()
  }, [search])

  if (loading) {
    return (
      <div className="search-loading">
        <div className="search-loading-spinner"></div>
        Searching authors...
      </div>
    )
  }

  if (!search || search.trim() === '') {
    return (
      <div className="search-empty-state">
        <div className="search-empty-icon">👤</div>
        <h3>Search for Authors</h3>
        <p>Type a username to find authors</p>
      </div>
    )
  }

  if (searched && authors.length === 0) {
    return (
      <div className='noResults'>
        <p>No authors found for "<strong>{search}</strong>"<br />
          Make sure all words are spelled correctly.<br />
          Try different or more general keywords.</p>
      </div>
    )
  }

  return (
    <>
      {authors.map((e) => (
        <div key={e._id} className="search-author-card">
          <div className="search-author-left">
            <LazyImage
              className="search-author-avatar"
              src={e.profilePic || defaultprofile}
              alt={e.username}
              fallbackSrc={defaultprofile}
            />
            <div className="search-author-info">
              <p className="search-author-username">{e.username}</p>
              <p className="search-author-fullname">{e.fullname || 'No name set'}</p>
            </div>
          </div>
          <Link to={`/profile/${e._id}`}>
            <button className="search-view-btn">View Profile</button>
          </Link>
        </div>
      ))}
    </>
  )
}

export default Author
