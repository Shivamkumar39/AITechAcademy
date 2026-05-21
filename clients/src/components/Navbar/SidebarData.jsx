import React from 'react';
import { FaSearch, FaBook } from "react-icons/fa"
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
    title: 'Study Material',
    path: '/study-material',
    icon: <FaBook />,
    cName: 'nav-text'
  }
];