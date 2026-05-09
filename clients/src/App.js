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
import CookieConsent from './components/Common/CookieConsent';
import { useSiteSettings } from './utils/siteSettings';




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
  const settings = useSiteSettings();

  useEffect(() => {
    if (settings.adsenseEnabled && settings.adsensePublisherId?.trim()) {
      if (!document.getElementById("adsense-script")) {
        const script = document.createElement("script");
        script.id = "adsense-script";
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsensePublisherId.trim()}`;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
        script.addEventListener("error", () => {
          console.log("Adsense script failed to load.");
        });
      }
    }
  }, [settings.adsenseEnabled, settings.adsensePublisherId]);
 
  return (
    <Router>
      <AppRoutes />
      <Footer/>
      <CookieConsent />
    </Router>
  );
}

export default App;
