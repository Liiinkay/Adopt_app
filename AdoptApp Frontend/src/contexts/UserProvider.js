import React, { createContext, useContext } from 'react';
import config from '../../config';
import { useAuth } from './AuthProvider';

const API_URL = config.API_URL;
const UsersContext = createContext();

export const useUsers = () => useContext(UsersContext);

export const UserProvider = ({ children }) => {
  const { userToken } = useAuth();

  const handleResponse = async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    return responseData;
  };

  const getAllUsers = async () => {
    const url = `${API_URL}/api/users/all`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const register = async (data) => {
    const url = `${API_URL}/api/users/${id}`;
    const response = await fetch(url, { method: 'POST', body: data});
    return handleResponse(response);
  };

  const loginUser = async (loginUserDto) => {
    const url = `${API_URL}/api/users/login`;
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginUserDto),
    });
    return handleResponse(response);
  };

  const logoutUser = async (id) => {
    const url = `${API_URL}/api/users/logout/${id}`;
    const response = await fetch(url, { method: 'POST' });
    return handleResponse(response);
  };

  const followUser = async (followerId, followingId) => {
    const url = `${API_URL}/api/users/follow`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    });
    return handleResponse(response);
  };

  const rateUser = async (userId, rating) => {
    const url = `${API_URL}/api/users/${userId}/rate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    return handleResponse(response);
  };

  const changePassword = async (changePasswordDto) => {
    const url = `${API_URL}/api/users/change-password`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changePasswordDto),
    });
    return handleResponse(response);
  };

  const requestPasswordReset = async (email) => {
    const url = `${API_URL}/api/users/request-password-reset`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  };


  const getFollowing = async (followerId) => {
    const url = `${API_URL}/api/users/following/${followerId}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };
    

  const getFollowers = async (userId) => {
    const url = `${API_URL}/api/users/followers/${userId}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };  

  const findOne = async (id) => {
    const url = `${API_URL}/api/users/${id}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const update = async (id, data) => {
    const url = `${API_URL}/api/users/update/${id}`;
    console.log(data);
    const response = await fetch(url, { method: 'PATCH', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
    return handleResponse(response);
  };

  const updateImages = async (id, data) => {
    const url = `${API_URL}/api/users/update-images/${id}`;
    console.log(data);
    const response = await fetch(url, { method: 'PATCH', body: data, headers: { 'Content-Type': 'multipart/form-data' } });
    return handleResponse(response);
  };

  const remove = async (id) => {
    const url = `${API_URL}/api/users/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  const savePost = async (savePostDto, userId) => {
    const url = `${API_URL}/api/users/saved-post`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${userToken}` },
      body: JSON.stringify({ ...savePostDto }),
    });
    return handleResponse(response);
  };

  const removeSavedPost = async (postId, userId) => {
    const url = `${API_URL}/api/users/saved-post/${postId}?userId=${userId}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  const getSavedPosts = async (idUser) => {
    const url = `${API_URL}/api/users/saved-post/${idUser}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const unfollowUser = async (followerId, followingId) => {
    const url = `${API_URL}/api/users/unfollow/${followingId}?followerId=${followerId}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  // Agrega aquí los demás métodos siguiendo un enfoque similar

  return (
    <UsersContext.Provider value={{
        getAllUsers,
        register,
        loginUser,
        logoutUser,
        rateUser,
        changePassword,
        requestPasswordReset,
        getFollowing,
        getFollowers,
        findOne,
        update,
        remove,
        savePost,
        removeSavedPost,
        getSavedPosts,
        followUser,
        unfollowUser,
        updateImages,
    }}>
      {children}
    </UsersContext.Provider>
  );
};
