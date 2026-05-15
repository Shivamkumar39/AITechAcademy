import React, { useContext, useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileBase64 from 'react-file-base64';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
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
    slug: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [tagMessage, setTagMessage] = useState("");

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
            slug: blog.slug || ""
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
        
        setAvailableTags(suggestions);
        setAvailableCategories(combinedCats);
      } catch (error) {
        console.log(error);
      }
    };
    loadTags();
  }, []);

  return (
    <>
      <Navbar />
      <div className='container mt-5'>
        <form onSubmit={onSubmit}>
          <input onChange={onChange} value={post.title} className='inputs' type="text" name="title" placeholder="Title" required />
          <input onChange={onChange} value={post.slug} className='inputs mt-2' type="text" name="slug" placeholder="Custom URL Slug (optional - e.g. my-cool-post)" />
          <small className="form-text text-muted thumbnailMessage mb-3">Leave blank to auto-generate from title.</small>

          {canManage ? (
            <button className="thumbnailbtn" type="button">
              <div className="thumbnaildiv">
                <FileBase64 multiple={false} onDone={({ base64 }) => setPost({ ...post, image: base64 })} />
              </div>
            </button>
          ) : (
            <div className="thumbnail-disabled"><p>Only admin can add article images.</p></div>
          )}

          <input onChange={onChange} value={post.image} className='inputs mt-3' type="text" name="image" placeholder="Or paste image URL" />
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
                  <option value="custom">Other (Custom)</option>
                </select>
                
                {(!availableCategories.includes(post.category) && post.category !== "") || post.category === "custom" ? (
                  <input 
                    onChange={onChange} 
                    value={post.category === "custom" ? "" : post.category} 
                    className='categoryInput' 
                    type="text" 
                    name="category" 
                    placeholder='Type custom category' 
                    required 
                  />
                ) : null}
              </div>
              <small className="form-text text-muted thumbnailMessage mb-3">Choose a category or type a new one</small>
            </div>
          </div>

          <div className='tag-section'>
            <div className='tag-label'>Available tags</div>
            <div className='available-tags'>
              {availableTags.length > 0 ? availableTags.map((tag, index) => (
                <button key={`${tag}-${index}`} type='button' className='tag-suggestion' onClick={() => selectSuggestedTag(tag)}>
                  {tag}
                </button>
              )) : <span className='tag-empty'>No tags available yet.</span>}
            </div>
            <div className='tag-input-row'>
              <input
                value={tagInput}
                onChange={onTagInputChange}
                className='tag-input'
                type='text'
                name='tagInput'
                placeholder='Add extra tag'
              />
              <button type='button' className='tag-add-btn' onClick={addTag}>
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
