import './App.css';
import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Homepage/Home';
import Blog from './components/Blog/Blog';
import { trackSiteVisit } from './apis/Blogs';
import { useSiteSettings } from './utils/siteSettings';
import Footer from './components/Footer/Footer';
import CookieConsent from './components/Common/CookieConsent';
import ScrollToTop from './components/Common/ScrollToTop';

// Lazy loading components for better performance
const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./components/Register/Register.jsx'));
const Navbar = lazy(() => import('./components/Navbar/Navbar'));
const Profile = lazy(() => import('./components/Profile/Profile'));
const EditProfile = lazy(() => import('./components/Editprofile/EditProfile'));
const Tag = lazy(() => import('./components/Tagwise/Tag'));
const Search = lazy(() => import('./components/Search/Search'));
const Error = lazy(() => import('./components/AdditionalPages/Error'));
const Pending = lazy(() => import('./components/AdditionalPages/Pending'));
const Bookmark = lazy(() => import('./components/Bookmark/Bookmark'));
const Write = lazy(() => import('./components/Write/Write'));
const Share = lazy(() => import('./components/AdditionalPages/Share'));
const AdminDashboard = lazy(() => import('./components/Admin/AdminDashboard'));
const PrivacyPolicy = lazy(() => import('./components/Legal/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./components/Legal/TermsAndConditions'));
const About = lazy(() => import('./components/Legal/About'));
const ContactUs = lazy(() => import('./components/Legal/ContactUs'));
const Disclaimer = lazy(() => import('./components/Legal/Disclaimer'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="loading-animation">
    <div className="loading-div">
      <div className="skeleton-loader" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
    </div>
  </div>
);

function AppRoutes() {
  const location = useLocation();

  useEffect(() => {
    trackSiteVisit();
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route exact path='/login' element={<Login/>}/>
        <Route exact path='/register' element={<Register/>}/>
        <Route exact path='/' element={<Home/>}/>
        <Route exact path='/navbar' element={<Navbar/>}/>
        <Route exact path='/edit/:id' element={<EditProfile/>}/>
        <Route exact path='/profile/:id' element={<Profile/>}/>
        <Route exact path='/tag/:id' element={<Tag/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/blog' element={<Home/>}/>
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
        <Route path='/blog/:slug' element={<Blog/>}/>
        <Route path='*' element={<Error/>}/>
      </Routes>
    </Suspense>
  )
}

function App() {
  const settings = useSiteSettings();

  useEffect(() => {
    // Disable AdSense during build/pre-rendering to avoid timeouts
    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('ReactSnap')) {
      return;
    }

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
      <ScrollToTop />
    </Router>
  );
}

export default App;
