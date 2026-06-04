import React from 'react';
import { FaSearch, FaBook, FaFileAlt, FaNewspaper, FaTh, FaInfoCircle, FaEnvelope } from "react-icons/fa"
import { GoHome } from "react-icons/go"

export const SidebarData = [
  {
    title: 'Search',
    path: '/search',
    icon: <FaSearch />,
    cName: 'nav-text'
  },
  {
    title: 'Home',
    path: '/',
    icon: <GoHome />,
    cName: 'nav-text'
  },
  {
    title: 'Blog',
    path: '/blog',
    icon: <FaNewspaper />,
    cName: 'nav-text'
  },
  {
    title: 'Categories',
    path: '/categories',
    icon: <FaTh />,
    cName: 'nav-text'
  },
  {
    title: 'Study Material',
    path: '/study-material',
    icon: <FaBook />,
    cName: 'nav-text'
  },
  {
    title: 'Resume',
    path: '/resume',
    icon: <FaFileAlt />,
    cName: 'nav-text'
  },
  {
    title: 'About',
    path: '/about',
    icon: <FaInfoCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Contact',
    path: '/contact-us',
    icon: <FaEnvelope />,
    cName: 'nav-text'
  },
];