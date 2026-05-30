import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileBase64 from 'react-file-base64';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Seo from '../SEO/Seo';
import { LoginContext } from '../../contextProvider/Context';
import { postBlog, getBlogById, updateBlogById, getCategories } from '../../apis/Blogs';
import "./Write.css";

function Write() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { loginData } = useContext(LoginContext);
  const pageRoute = useNavigate();
  const token = localStorage.getItem("JWTFINALTOKEN");

  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    readtime: "",
    authorName: "shivam_kushwaha",
    authorImage: "",
    tags: [],
    pdfLinks: [],
    slug: "",
    metaTitle: "",
    metaDescription: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [tagMessage, setTagMessage] = useState("");
  // Persist hidden tags in localStorage so they don't reappear on reload
  const [hiddenTags, setHiddenTags] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_hidden_tags');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (_) {
      return new Set();
    }
  });

  const canManage = useMemo(() => loginData?._id && loginData?.role === 'admin', [loginData]);

  useEffect(() => {
    if (!isEditMode) return;
    const loadArticle = async () => {
      setLoading(true);
      try {
        const res = await getBlogById(id);
        const blog = res?.data?.message;
        if (blog) {
          setPost({
            title: blog.title || "",
            image: blog.image || "",
            description: blog.description || "",
            category: blog.category || "",
            readtime: blog.readtime || "",
            authorName: blog.authorName || "shivam_kushwaha",
            authorImage: blog.authorImage || "",
            tags: Array.isArray(blog.tags) ? blog.tags : [],
            pdfLinks: Array.isArray(blog.pdfLinks) ? blog.pdfLinks : [],
            slug: blog.slug || "",
            metaTitle: blog.metaTitle || "",
            metaDescription: blog.metaDescription || ""
          });
        }
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id, isEditMode]);

  const onChange = (e) => setPost({ ...post, [e.target.name]: e.target.value });
  const onEditorChange = (value) => setPost({ ...post, description: value });
  const onTagInputChange = (e) => {
    setTagInput(e.target.value);
    if (tagMessage) setTagMessage("");
  };
  const selectSuggestedTag = (tag) => {
    const alreadySelected = post.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (alreadySelected) {
      setTagMessage("This tag is already added.");
      return;
    }
    setPost((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setTagMessage(`Added tag: ${tag}`);
  };
  const addTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    const normalized = value.toLowerCase();
    const alreadySelected = post.tags.some((tag) => tag.toLowerCase() === normalized);
    const isExistingTag = availableTags.some((tag) => tag.toLowerCase() === normalized);
    if (alreadySelected) {
      setTagMessage("This tag is already added.");
      return;
    }
    if (isExistingTag) {
      setTagMessage("This tag already exists in available tags.");
    }
    setPost((prev) => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput("");
  };
  const removeTag = (removeIndex) => {
    setPost((prev) => ({ ...prev, tags: prev.tags.filter((_, index) => index !== removeIndex) }));
  };
  const removeAvailableTag = (tagToRemove) => {
    // Save to localStorage so it persists across page reloads
    setHiddenTags((prev) => {
      const updated = new Set(prev);
      updated.add(tagToRemove);
      try {
        localStorage.setItem('admin_hidden_tags', JSON.stringify([...updated]));
      } catch (_) {}
      return updated;
    });
    setAvailableTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handlePdfLinkChange = (index, field, value) => {
    const updated = [...post.pdfLinks];
    updated[index][field] = value;
    setPost({ ...post, pdfLinks: updated });
  };
  const addPdfLink = () => {
    if (post.pdfLinks.length < 10) {
      setPost({ ...post, pdfLinks: [...post.pdfLinks, { text: '', link: '' }] });
    }
  };
  const removePdfLink = (index) => {
    const updated = [...post.pdfLinks];
    updated.splice(index, 1);
    setPost({ ...post, pdfLinks: updated });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canManage) {
      alert("Only admin can publish or update articles.");
      return;
    }
    const body = { ...post, authorid: loginData?._id || null, authorName: post.authorName || "shivam_kushwaha", tags: post.tags, pdfLinks: post.pdfLinks };
    if (isEditMode) {
      await updateBlogById(id, body, token);
      alert("Article updated successfully.");
    } else {
      await postBlog(body, token);
      alert("Article published successfully.");
    }
    pageRoute('/admin/dashboard');
  };

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await getCategories();
        const suggestions = response?.data?.suggestions || [];
        const cats = response?.data?.categories || [];
        // Combine default requested categories with any dynamic ones
        const defaultCats = ["Educational", "News", "Latest AI News", "Innovation", "Study Material", "Technology", "Btech CSE Material"];
        const combinedCats = Array.from(new Set([...defaultCats, ...cats]));

        // Load persisted hidden tags from localStorage and filter them out
        let currentHidden = hiddenTags;
        try {
          const stored = localStorage.getItem('admin_hidden_tags');
          if (stored) currentHidden = new Set(JSON.parse(stored));
        } catch (_) {}

        const filteredSuggestions = suggestions.filter(tag => !currentHidden.has(tag));

        setAvailableTags(filteredSuggestions);
        setAvailableCategories(combinedCats);
      } catch (error) {
        console.log(error);
      }
    };
    loadTags();
  }, []);

  return (
    <>
      <Seo title={isEditMode ? "Edit Article" : "Write Article"} noIndex={true} />
      <Navbar />
      <div className='container mt-5'>
        <form onSubmit={onSubmit}>
          <input onChange={onChange} value={post.title} className='inputs' type="text" name="title" placeholder="Title" required />
          <input onChange={onChange} value={post.slug} className='inputs mt-2' type="text" name="slug" placeholder="Custom URL Slug (optional - e.g. my-cool-post)" />
          <small className="form-text text-muted thumbnailMessage mb-3">Leave blank to auto-generate from title.</small>

          <input onChange={onChange} value={post.metaTitle} className='inputs mt-3' type="text" name="metaTitle" placeholder="Meta Title (SEO)" />
          <small className="form-text text-muted thumbnailMessage mb-3">Optimized title for search engines. Leave blank to use main title.</small>

          <textarea onChange={onChange} value={post.metaDescription} className='inputs mt-3' name="metaDescription" placeholder="Meta Description (SEO)" rows="3" style={{ resize: "vertical", minHeight: "80px" }} />
          <small className="form-text text-muted thumbnailMessage mb-3">Brief summary for search results. Helps with SEO ranking.</small>

          {canManage ? (
            <button className="thumbnailbtn" type="button">
              <div className="thumbnaildiv">
                <FileBase64 multiple={false} onDone={({ base64 }) => setPost({ ...post, image: base64 })} />
              </div>
            </button>
          ) : (
            <div className="thumbnail-disabled"><p>Only admin can add article images.</p></div>
          )}

          {post.image && post.image.startsWith('/blog-image/') ? (
            <div className='mt-3 mb-2 p-2' style={{ backgroundColor: '#f0f9ff', border: '1px solid #b6e3ff', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#0369a1', fontSize: '14px', fontWeight: '500' }}>✓ Image is already uploaded and saved.</span>
              <button type="button" style={{ border: 'none', background: 'transparent', color: '#e11d48', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }} onClick={() => setPost({...post, image: ""})}>Remove / Change</button>
            </div>
          ) : (
            <input onChange={onChange} value={post.image} className='inputs mt-3' type="text" name="image" placeholder="Or paste image URL" />
          )}
          <input onChange={onChange} value={post.authorName} className='inputs mt-3' type="text" name="authorName" placeholder="Author name" />
          <input onChange={onChange} value={post.authorImage} className='inputs mt-3' type="text" name="authorImage" placeholder="Author image URL" />

          <small className="form-text text-muted thumbnailMessage mb-3">Use original or license-safe images only.</small>

          <ReactQuill
            id='editor'
            modules={Write.modules}
            theme="snow"
            value={post.description}
            onChange={onEditorChange}
            placeholder="Start writing from here"
            style={{ marginTop: "-14px" }}
          />

          <div className='write-flex'>
            <div>
              <input onChange={onChange} value={post.readtime} className='readtimeInput' type="text" name="readtime" placeholder='Enter read time' required />
              <small className="form-text text-muted thumbnailMessage mb-3">Eg: 7 min read</small>
            </div>
            <div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  className='categoryInput' 
                  onChange={(e) => setPost({ ...post, category: e.target.value })} 
                  value={availableCategories.includes(post.category) ? post.category : "custom"}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="custom">New Category</option>
                </select>
                
                {(!availableCategories.includes(post.category) && post.category !== "") || post.category === "custom" ? (
                  <input 
                    onChange={(e) => {
                      const val = e.target.value;
                      setPost({ ...post, category: val });
                    }} 
                    value={post.category === "custom" ? "" : post.category} 
                    className='categoryInput' 
                    type="text" 
                    name="category" 
                    placeholder='Type custom category' 
                    required 
                    onBlur={(e) => {
                      const val = e.target.value.trim();
                      if (val && !availableCategories.includes(val)) {
                        setAvailableCategories((prev) => [...prev, val]);
                      }
                    }}
                  />
                ) : null}
              </div>
              <small className="form-text text-muted thumbnailMessage mb-3">Choose a category or type a new one (it will be added to the list)</small>
            </div>
          </div>

          <div className='tag-section'>
            <div className='tag-label'>Meta Tags (Max 20)</div>
            <div className='available-tags' style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.length > 0 ? availableTags.map((tag, index) => (
                <div key={`${tag}-${index}`} className='tag-suggestion-wrapper' style={{ display: 'inline-flex', alignItems: 'center', background: '#f0f0f0', borderRadius: '15px', overflow: 'hidden', border: '1px solid #ccc' }}>
                  <button type='button' className='tag-suggestion' style={{ border: 'none', background: 'transparent', padding: '5px 10px', margin: 0, cursor: 'pointer' }} onClick={() => {
                    if (post.tags.length >= 20) {
                      setTagMessage("Maximum 20 tags allowed.");
                      return;
                    }
                    selectSuggestedTag(tag);
                  }}>
                    {tag}
                  </button>
                  <button type='button' style={{ border: 'none', background: '#e0e0e0', padding: '5px 8px', cursor: 'pointer', color: '#666', fontWeight: 'bold' }} onClick={(e) => {
                    e.stopPropagation();
                    removeAvailableTag(tag);
                  }}>
                    &times;
                  </button>
                </div>
              )) : <span className='tag-empty'>No tags available yet.</span>}
            </div>
            <div className='tag-input-row'>
              <input
                value={tagInput}
                onChange={onTagInputChange}
                className='tag-input'
                type='text'
                name='tagInput'
                placeholder='Add Meta Tag'
                disabled={post.tags.length >= 20}
              />
              <button type='button' className='tag-add-btn' disabled={post.tags.length >= 20} onClick={() => {
                if (post.tags.length >= 20) {
                  setTagMessage("Maximum 20 tags allowed.");
                  return;
                }
                addTag();
              }}>
                Add Tag
              </button>
            </div>
            {tagMessage && <p className='tag-warning'>{tagMessage}</p>}
            <div className='selected-tags'>
              {post.tags.map((tag, index) => (
                <span key={`${tag}-${index}`} className='tag-chip'>
                  {tag}
                  <button type='button' className='tag-remove' onClick={() => removeTag(index)}>&times;</button>
                </span>
              ))}
            </div>
          </div>

          <div className='pdf-links-section mt-4'>
            <div className='tag-label'>PDF Download Buttons (Max 10)</div>
            {post.pdfLinks.map((pdf, index) => (
              <div key={index} className='pdf-link-row' style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type='text'
                  className='inputs'
                  placeholder='Button Text (e.g., Download PDF)'
                  value={pdf.text}
                  onChange={(e) => handlePdfLinkChange(index, 'text', e.target.value)}
                  style={{ flex: 1 }}
                />
                <input
                  type='text'
                  className='inputs'
                  placeholder='Google Drive Link'
                  value={pdf.link}
                  onChange={(e) => handlePdfLinkChange(index, 'link', e.target.value)}
                  style={{ flex: 2 }}
                />
                <button type='button' className='publish-btn' onClick={() => removePdfLink(index)} style={{ backgroundColor: '#ff4d4f', width: 'auto', padding: '0 15px' }}>
                  Remove
                </button>
              </div>
            ))}
            {post.pdfLinks.length < 10 && (
              <button type='button' className='publish-btn mt-2' onClick={addPdfLink} style={{ backgroundColor: '#28a745', width: 'auto', padding: '10px 20px', borderRadius: '5px' }}>
                + Add PDF Button
              </button>
            )}
          </div>

          <button className='publish-btn mt-3' type='submit' disabled={loading}>
            {isEditMode ? "Update Article" : "Publish"}
          </button>
        </form>
      </div>
    </>
  );
}

Write.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }],
    ["bold", "italic", "underline"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }, { align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

export default Write;
