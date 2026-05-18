import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Seo from '../SEO/Seo';
import { getCategories } from '../../apis/Blogs';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await getCategories();
        const data = res?.data?.suggestions || [];
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Seo
        title="All Categories - AITECHACADEMY"
        description="Explore all categories and topics on AITECHACADEMY."
        path="/categories"
        type="website"
      />
      <Navbar />
      <div className="categories-container">
        <h1 className="categories-title">Explore <span className="gradient-text">Categories</span></h1>
        <p className="categories-subtitle">Find the best articles, notes, and tutorials by topic.</p>
        
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <Link key={index} to={`/tag/${cat}`} className="category-card">
                <div className="category-card-content">
                  <h3 className="category-card-title">{cat}</h3>
                  <span className="category-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Categories;
