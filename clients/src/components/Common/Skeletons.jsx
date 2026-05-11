import React from 'react';

export const SkeletonBlogCard = () => (
  <div className="blog-card" style={{ marginBottom: '20px' }}>
    <div className="skeleton-loader skeleton-image" style={{ height: '200px' }}></div>
    <div className="blogInfo">
      <div className="skeleton-loader skeleton-text" style={{ width: '30%', height: '20px' }}></div>
      <div className="skeleton-loader skeleton-title" style={{ width: '80%', marginTop: '10px' }}></div>
      <div className="minor-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="skeleton-loader skeleton-avatar"></div>
        <div className="skeleton-loader skeleton-text" style={{ width: '100px' }}></div>
      </div>
      <div className="skeleton-loader skeleton-text" style={{ width: '100%', height: '60px', marginTop: '10px' }}></div>
    </div>
  </div>
);

export const SkeletonBlogDetail = () => (
  <div className="blog-section">
    <div className="skeleton-loader skeleton-text" style={{ width: '100px', height: '25px', marginBottom: '20px' }}></div>
    <div className="skeleton-loader skeleton-title" style={{ width: '90%', height: '40px', marginBottom: '20px' }}></div>
    <div className="skeleton-loader skeleton-image" style={{ height: '500px', marginBottom: '30px' }}></div>
    <div className="skeleton-loader skeleton-text" style={{ width: '100%' }}></div>
    <div className="skeleton-loader skeleton-text" style={{ width: '100%' }}></div>
    <div className="skeleton-loader skeleton-text" style={{ width: '95%' }}></div>
    <div className="skeleton-loader skeleton-text" style={{ width: '90%' }}></div>
    <div className="skeleton-loader skeleton-text" style={{ width: '100%', height: '300px', marginTop: '30px' }}></div>
  </div>
);

export const SkeletonSidebar = () => (
  <div className="sec-2-right">
    <div className="skeleton-loader skeleton-title" style={{ width: '60%', marginBottom: '30px' }}></div>
    <div className="profile mb-5" style={{ display: 'flex', gap: '15px' }}>
      <div className="skeleton-loader skeleton-avatar" style={{ width: '80px', height: '80px' }}></div>
      <div style={{ flex: 1 }}>
        <div className="skeleton-loader skeleton-title" style={{ width: '70%' }}></div>
        <div className="skeleton-loader skeleton-text" style={{ width: '90%' }}></div>
      </div>
    </div>
    <div className="skeleton-loader skeleton-rect" style={{ height: '250px', marginBottom: '30px' }}></div>
    <div className="skeleton-loader skeleton-title" style={{ width: '50%' }}></div>
    <div className="skeleton-loader skeleton-rect" style={{ height: '200px' }}></div>
  </div>
);

export const SkeletonBlogList = ({ count = 3 }) => (
  <div className="recent-blogs">
    {Array(count).fill(0).map((_, i) => (
      <SkeletonBlogCard key={i} />
    ))}
  </div>
);
