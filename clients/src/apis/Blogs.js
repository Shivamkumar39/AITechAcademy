import axios from "axios"
const url = process.env.REACT_APP_API_URL || "http://localhost:8000"
export const postBlog=async(body, token)=>{
  try {
    return await axios.post(`${url}/addBlog`, body, { headers: { Authorization: token } })
  } catch (error) {
    // Error in post blog api
  }
}
export const getAdminBlogs = async (token) => {
  try {
    return await axios.get(`${url}/admin/blogs`, { headers: { Authorization: token } })
  } catch (error) {
    // Error in admin blogs api
  }
}
export const getAdminStats = async (token) => {
  try {
    return await axios.get(`${url}/admin/stats`, { headers: { Authorization: token } })
  } catch (error) {
    // Error in admin stats api
  }
}
export const getSiteStats = async () => {
  try {
    return await axios.get(`${url}/site-stats`)
  } catch (error) {
    // Error in site stats api
  }
}
export const trackSiteVisit = async () => {
  try {
    const endpoint = `${url}/site-visit`
    const response = await fetch(endpoint, {
      method: "POST",
      keepalive: true,
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
  try {
    return await axios.delete(`${url}/delete/blog/${id}`, { headers: { Authorization: token } })
  } catch (error) {
    // Error in delete blog api
  }
}
export const updateBlogById = async (id, body, token) => {
  try {
    return await axios.patch(`${url}/update/blog/${id}`, body, { headers: { Authorization: token } })
  } catch (error) {
    // Error in update blog api
  }
}
export const getAllBlogs=async()=>{
  try {
  return await axios.get(`${url}/blogs`)
  } catch (error) {
    // Error
  }
}
export const getBlogById=async(id)=>{
  try {
    return await axios.get(`${url}/blog/${id}`)
  } catch (error) {
    // Error
  }
}
export const getBlogBySlug=async(slug)=>{
  try {
    return await axios.get(`${url}/post/${slug}`)
  } catch (error) {
    // Error
  }
}
export const getAuthorBlogs=async(id)=>{
  try {
    return await axios.get(`${url}/blogsByAuthorId/${id}`)
  } catch (error) {
    // Error
  }
}
export const blogByTag=async(id)=>{
  try {
    return await axios.get(`${url}/tag/${id}`)
  } catch (error) {
    // Error in blog by tag api
  }
}
export const categoryCount=async()=>{
  try {
    return await axios.get(`${url}/categorycount`)
  } catch (error) {
    // Error in categorycount api
  }
}
export const searchBlog=async(value)=>{
  try {
    return await axios.get(`${url}/search/title?q=${value}`)
  } catch (error) {
    console.log(error)
  }
}
export const searchAuthor=async(value)=>{
  try {
    return await axios.get(`${url}/search/author?q=${value}`)
  } catch (error) {
    console.log(error)
  }
}
export const searchCategory=async(value)=>{
  try {
    return await axios.get(`${url}/search/category?q=${value}`)
  } catch (error) {
    console.log(error)
  }
}
export const getCategories=async()=>{
  try {
    return await axios.get(`${url}/categories`)
  } catch (error) {
    console.log("error in categories api", error)
  }
}
export const bookmark=async(id,body)=>{
  try {
    return await axios.patch(`${url}/bookmark/${id}`,body)
  } catch (error) {
    console.log("error in bookmark api")
  }
}
export const unbookmark=async(id,body)=>{
  try {
    return await axios.patch(`${url}/unbookmark/${id}`,body)
  } catch (error) {
    console.log("error in unbookmark api")
  }
}
export const likeBlog=async(id,body)=>{
try {
  return await axios.patch(`${url}/like/${id}`,body)
} catch (error) {
  console.log("error in like api "+error)
}
}
export const unlikeBlog=async(id,body)=>{
  try {
    return await axios.patch(`${url}/unlike/${id}`,body)
  } catch (error) {
    console.log("error in like api "+error)
  }
}

export const addComment = async (id, body) => {
  try {
    return await axios.patch(`${url}/comment/${id}`, body)
  } catch (error) {
    console.log("error in add comment api", error)
  }
}

export const getSiteSettings = async () => {
  try {
    return await axios.get(`${url}/site-settings`)
  } catch (error) {
    console.log("error in get site settings api", error)
  }
}

export const updateSiteSettings = async (body, token) => {
  try {
    return await axios.patch(`${url}/site-settings`, body, { headers: { Authorization: token } })
  } catch (error) {
    console.log("error in update site settings api", error)
  }
}
