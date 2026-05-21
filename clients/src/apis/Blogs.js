import axios from "axios"
const url = process.env.REACT_APP_API_URL || "http://localhost:8000"

axios.defaults.timeout = 60000;
axios.defaults.withCredentials = true;

export const postBlog = async (body, token) => {
  return await axios.post(`${url}/addBlog`, body, { headers: { Authorization: token } })
}

export const getAdminBlogs = async (token) => {
  return await axios.get(`${url}/admin/blogs`, { headers: { Authorization: token } })
}

export const getAdminStats = async (token) => {
  return await axios.get(`${url}/admin/stats`, { headers: { Authorization: token } })
}

export const getSiteStats = async () => {
  return await axios.get(`${url}/site-stats`)
}

export const trackSiteVisit = async () => {
  // Prevent tracking during build/pre-rendering
  if (typeof window !== 'undefined' && window.navigator.userAgent.includes('ReactSnap')) {
    return;
  }
  
  try {
    const endpoint = `${url}/site-visit`
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    })
    const data = await response.json()
    if (typeof data?.totalVisits === 'number') {
      window.dispatchEvent(new CustomEvent("site-visit-updated", { detail: { totalVisits: data.totalVisits } }))
    } else {
      window.dispatchEvent(new CustomEvent("site-visit-updated", { detail: { increment: 1 } }))
    }
  } catch (error) {
    // Error in site visit api
  }
}

export const deleteBlogById = async (id, token) => {
  return await axios.delete(`${url}/delete/blog/${id}`, { headers: { Authorization: token } })
}

export const updateBlogById = async (id, body, token) => {
  return await axios.patch(`${url}/update/blog/${id}`, body, { headers: { Authorization: token } })
}

export const getStudyMaterials = async (q = "", tag = "") => {
  let endpoint = `${url}/api/study-material`
  const params = []
  if (q) params.push(`q=${encodeURIComponent(q)}`)
  if (tag) params.push(`tag=${encodeURIComponent(tag)}`)
  if (params.length > 0) {
    endpoint += `?${params.join("&")}`
  }
  return await axios.get(endpoint)
}

export const getAllBlogs = async () => {
  return await axios.get(`${url}/blogs`)
}

export const getBlogById = async (id) => {
  return await axios.get(`${url}/blog/${id}`)
}

export const getBlogBySlug = async (slug) => {
  return await axios.get(`${url}/post/${slug}`)
}

export const getAuthorBlogs = async (id) => {
  return await axios.get(`${url}/blogsByAuthorId/${id}`)
}

export const blogByTag = async (id) => {
  return await axios.get(`${url}/tag/${id}`)
}

export const categoryCount = async () => {
  return await axios.get(`${url}/categorycount`)
}

export const searchBlog = async (value) => {
  return await axios.get(`${url}/search/title?q=${value}`)
}

export const searchAuthor = async (value) => {
  return await axios.get(`${url}/search/author?q=${value}`)
}

export const searchCategory = async (value) => {
  return await axios.get(`${url}/search/category?q=${value}`)
}

export const getCategories = async () => {
  return await axios.get(`${url}/categories`)
}

export const bookmark = async (id, body) => {
  return await axios.patch(`${url}/bookmark/${id}`, body)
}

export const unbookmark = async (id, body) => {
  return await axios.patch(`${url}/unbookmark/${id}`, body)
}

export const likeBlog = async (id, body) => {
  return await axios.patch(`${url}/like/${id}`, body)
}

export const unlikeBlog = async (id, body) => {
  return await axios.patch(`${url}/unlike/${id}`, body)
}

export const addComment = async (id, body) => {
  return await axios.patch(`${url}/comment/${id}`, body)
}

export const getSiteSettings = async () => {
  return await axios.get(`${url}/site-settings`)
}

export const updateSiteSettings = async (body, token) => {
  return await axios.patch(`${url}/site-settings`, body, { headers: { Authorization: token } })
}
