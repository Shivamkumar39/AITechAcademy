import axios from "axios";
const url = process.env.REACT_APP_API_URL || "http://localhost:8000";
export const registerUser = async (body) => {
  try {
    return await axios.post(`${url}/register`, body);
  } catch (error) {
    // Error in registerUser api
  }
};

export const loginUser = async (data) => {
  try {
    return await axios.post(`${url}/login`, data, { withCredentials: true });
  } catch (error) {
    // Error
  }
};
export const getUserById = async (id) => {
  try {
    return await axios.get(`${url}/userById/${id}`);
  } catch (error) {
    // Error
  }
};
export const updateUser = async (id, body) => {
  try {
    return await axios.patch(`${url}/updateUser/${id}`, body);
  } catch (error) {
    // Error
  }
};
export const followUser = async (id, body) => {
  try {
    return await axios.patch(`${url}/${id}/follow`, body);
  } catch (error) {
    // Error in follow user api
  }
};
export const userFollowers = async (id) => {
  try {
    return await axios.get(`${url}/${id}/followers`);
  } catch (error) {
    // Error in userfollowers api
  }
};
export const userFollowings = async (id) => {
  try {
    return await axios.get(`${url}/${id}/followings`);
  } catch (error) {
    // Error in userfollowings api
  }
};
export const blogsCount = async () => {
  try {
    return await axios.get(`${url}/blogscount`);
  } catch (error) {
    // Error in blogscount
  }
};
export const usersCount = async () => {
  try {
    return await axios.get(`${url}/userscount`);
  } catch (error) {
    // Error in userscount
  }
};
