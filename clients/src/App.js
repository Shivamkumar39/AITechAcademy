import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register.jsx';
import Home from './components/Homepage/Home';


import Blog from './components/Blog/Blog';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Editprofile/EditProfile';
import Tag from './components/Tagwise/Tag';
import Search from './components/Search/Search';
import Error from './components/AdditionalPages/Error';
import Pending from './components/AdditionalPages/Pending';
import Bookmark from './components/Bookmark/Bookmark';
import Write from './components/Write/Write';
import Share from './components/AdditionalPages/Share';
import AdminDashboard from './components/Admin/AdminDashboard';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import TermsAndConditions from './components/Legal/TermsAndConditions';
import About from './components/Legal/About';
import ContactUs from './components/Legal/ContactUs';
import Disclaimer from './components/Legal/Disclaimer';
import Footer from './components/Footer/Footer';
import { trackSiteVisit } from './apis/Blogs';
import { getSiteSettings } from './utils/siteSettings';
import CookieConsent from './components/Common/CookieConsent';




function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    trackSiteVisit();
  }, [location.pathname]);

  return (
    <Routes>
      <Route exact path='/login' element={<Login/>}/>
      <Route exact path='/register' element={<Register/>}/>
      <Route exact path='/' element={<Home/>}/>
      <Route path='/blog/:id' element={<Blog/>}/>
      <Route exact path='/navbar' element={<Navbar/>}/>
      <Route exact path='/edit/:id' element={<EditProfile/>}/>
      <Route exact path='/profile/:id' element={<Profile/>}/>
      <Route exact path='/tag/:id' element={<Tag/>}/>
      <Route path='/search' element={<Search/>}/>
      <Route path='/notifications' element={<Pending/>}/>
      <Route exact path='/bookmarks' element={<Bookmark/>}/>
      <Route exact path='/write' element={<Write/>}/>
      <Route exact path='/write/:id' element={<Write/>}/>
      <Route exact path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route exact path='/share' element={<Share/>}/>
      <Route exact path='/privacy-policy' element={<PrivacyPolicy/>}/>
      <Route exact path='/terms-and-conditions' element={<TermsAndConditions/>}/>
      <Route exact path='/about' element={<About/>}/>
      <Route exact path='/contact-us' element={<ContactUs/>}/>
      <Route exact path='/disclaimer' element={<Disclaimer/>}/>
      <Route path='*' element={<Error/>}/>
    </Routes>
  )
}

function App() {
  useEffect(() => {
    const settings = getSiteSettings();
    const client = settings?.adsensePublisherId?.trim();
    if (!settings?.adsenseEnabled || !client) return;
    if (document.getElementById("adsense-script")) return;
    const script = document.createElement("script");
    script.id = "adsense-script";
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, []);
 
  return (
    <Router>
      <AppRoutes />
      <Footer/>
      <CookieConsent />
    </Router>
  );
}

export default App;
