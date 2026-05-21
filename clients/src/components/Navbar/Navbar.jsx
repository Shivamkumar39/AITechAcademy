import React, { useContext, useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { BiLogOut, BiLogIn } from 'react-icons/bi';
import { MdDashboard } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import { BsPencilSquare, BsBookmarks } from "react-icons/bs"
import './Navbar.css';
import { IconContext } from 'react-icons';
import { LoginContext } from '../../contextProvider/Context';
import defaultimage from '../../assets/defaultprofile.png';
import axios from 'axios';
import { useSiteSettings } from '../../utils/siteSettings';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const social = useSiteSettings();
  const { loginData, setLoginData } = useContext(LoginContext);
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const logout = async () => {
    const token = localStorage.getItem('JWTFINALTOKEN');
    try {
      const res = await axios.get(`${API_URL}/logout`, { headers: { Authorization: token } });
      if (res.data.status === 201) {
        localStorage.removeItem('JWTFINALTOKEN');
        setLoginData({});
        navigate('/');
      }
    } catch (error) {
      localStorage.removeItem('JWTFINALTOKEN');
      setLoginData({});
      navigate('/');
    }
  };

  const homeValid = async () => {
    const token = localStorage.getItem('JWTFINALTOKEN');
    if (!token || token.split('.').length !== 3) {
      if (token) localStorage.removeItem('JWTFINALTOKEN');
      setLoginData({});
      return;
    }
    try {
      const res = await axios.get(`${API_URL}/validuser`, { headers: { Authorization: token } });
      if (res.data.status === 201) {
        setLoginData(res.data.userValid);
      } else {
        localStorage.removeItem('JWTFINALTOKEN');
        setLoginData({});
      }
    } catch (error) {
      localStorage.removeItem('JWTFINALTOKEN');
      setLoginData({});
    }
  };

  useEffect(() => {
    homeValid();
  }, []);

  return (
    <>
      <IconContext.Provider value={{ color: 'rgba(51, 51, 51, 1)' }}>
        <header className='main-navbar'>
          <button type='button' className='menu-bars' onClick={showSidebar} aria-label='Open menu'>
            <FaIcons.FaBars />
          </button>
          <Link to='/' className='navbar-text-logo' data-text={social.websiteName || 'AITechAcademy'}>
            {social.websiteName || 'AITechAcademy'}
          </Link>
          <div className='navbar-social-icons'>
            {social.facebook && (
              <a href={social.facebook} target='_blank' rel='noreferrer' title='Facebook' className='navbar-social-link'>
                <FaIcons.FaFacebook />
              </a>
            )}
            {social.instagram && (
              <a href={social.instagram} target='_blank' rel='noreferrer' title='Instagram' className='navbar-social-link'>
                <FaIcons.FaInstagram />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target='_blank' rel='noreferrer' title='Twitter' className='navbar-social-link'>
                <FaIcons.FaTwitter />
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target='_blank' rel='noreferrer' title='LinkedIn' className='navbar-social-link'>
                <FaIcons.FaLinkedin />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target='_blank' rel='noreferrer' title='YouTube' className='navbar-social-link'>
                <FaIcons.FaYoutube />
              </a>
            )}
            {social.github && (
              <a href={social.github} target='_blank' rel='noreferrer' title='GitHub' className='navbar-social-link'>
                <FaIcons.FaGithub />
              </a>
            )}
          </div>
          <div className='top-links'>
            <Link to='/study-material'>Study Material</Link>
            <Link to='/privacy-policy'>Policy</Link>
            <Link to='/terms-and-conditions'>Terms</Link>
            <Link to='/about'>About</Link>
            <Link to='/contact-us'>Contact</Link>
          </div>
        </header>

        <nav onClick={showSidebar} className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <button type='button' className='menu-bars close-menu' aria-label='Close menu'>
                <AiIcons.AiOutlineClose />
              </button>
            </li>

            {loginData?._id ? (
              <Link to={`/profile/${loginData._id}`} className='profile-link'>
                <div className='profileSection'>
                  <img className='userProfile' src={loginData.profilePic || defaultimage} alt='Profile' />
                  <div className='user-bio'>
                    <h4 className='user-name'>{loginData.username || 'User'}</h4>
                  </div>
                </div>
              </Link>
            ) : null}

            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path} className='nav-link'>
                  {item.icon}
                  <span className='nav-icons'>{item.title}</span>
                </Link>
              </li>
            ))}

            {loginData?._id ? (
              <li className='nav-text'>
                <Link to='/bookmarks' className='nav-link'>
                  <BsBookmarks />
                  <span className='nav-icons'>Bookmarks</span>
                </Link>
              </li>
            ) : null}

            {loginData?.role === 'admin' ? (
              <li className='nav-text'>
                <Link to='/write' className='nav-link'>
                  <BsPencilSquare />
                  <span className='nav-icons'>Write</span>
                </Link>
              </li>
            ) : null}

            <li className='nav-text sidebar-social-section'>
              <div className='sidebar-social-header'>Follow Us</div>
              <div className='sidebar-social-icons'>
                {social.facebook && (
                  <a href={social.facebook} target='_blank' rel='noreferrer' title='Facebook' className='sidebar-social-link'>
                    <FaIcons.FaFacebook />
                  </a>
                )}
                {social.instagram && (
                  <a href={social.instagram} target='_blank' rel='noreferrer' title='Instagram' className='sidebar-social-link'>
                    <FaIcons.FaInstagram />
                  </a>
                )}
                {social.twitter && (
                  <a href={social.twitter} target='_blank' rel='noreferrer' title='Twitter' className='sidebar-social-link'>
                    <FaIcons.FaTwitter />
                  </a>
                )}
                {social.linkedin && (
                  <a href={social.linkedin} target='_blank' rel='noreferrer' title='LinkedIn' className='sidebar-social-link'>
                    <FaIcons.FaLinkedin />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} target='_blank' rel='noreferrer' title='YouTube' className='sidebar-social-link'>
                    <FaIcons.FaYoutube />
                  </a>
                )}
                {social.github && (
                  <a href={social.github} target='_blank' rel='noreferrer' title='GitHub' className='sidebar-social-link'>
                    <FaIcons.FaGithub />
                  </a>
                )}
              </div>
            </li>

            {loginData?.role === 'admin' ? (
              <li className='nav-text'>
                <Link to='/admin/dashboard' className='nav-link'>
                  <MdDashboard />
                  <span className='nav-icons'>Admin Dashboard</span>
                </Link>
              </li>
            ) : null}

            {loginData?._id ? (
              <li className='nav-text'>
                <button type='button' onClick={logout} className='nav-link nav-link-button'>
                  <BiLogOut />
                  <span className='nav-icons'>Logout</span>
                </button>
              </li>
            ) : (
              <li className='nav-text'>
                <Link to='/login' className='nav-link'>
                  <BiLogIn />
                  <span className='nav-icons'>Login</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;

