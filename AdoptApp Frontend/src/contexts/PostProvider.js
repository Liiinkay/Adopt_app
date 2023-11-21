import React, { createContext, useContext } from 'react';
import config from '../../config';

const API_URL = config.API_URL;
const PostsContext = createContext();

export const usePosts = () => useContext(PostsContext);

export const PostProvider = ({ children }) => {

    const createLostPost = async (formData, id) => {
        const url = `${API_URL}/api/posts/lost/${id}`;
        const response = await fetch(url, { method: 'POST', body: formData });
        return handleResponse(response);
      };

  const createAdoptPost = async (formData, id) => {
    const url = `${API_URL}/api/posts/adopt/${id}`;
    const response = await fetch(url, { method: 'POST', body: formData });
    return handleResponse(response);
  };

  const createInformativePost = async (formData, id) => {
    const url = `${API_URL}/api/posts/informative/${id}`;
    const response = await fetch(url, { method: 'POST', body: formData });
    return handleResponse(response);
  };

  const updatePost = async (id, updatePostDto) => {
    const url = `${API_URL}/${id}`;
    const response = await fetch(url, { method: 'PATCH', body: JSON.stringify(updatePostDto), headers: { 'Content-Type': 'application/json' } });
    return handleResponse(response);
  };

  const deletePost = async (id) => {
    const url = `${API_URL}/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  const getPostById = async (id) => {
    const url = `${API_URL}/${id}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const getPostsByType = async (type) => {
    const url = `${API_URL}/api/posts/type/${type}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const getUserPostsJson = async (id) => {
    const url = `${API_URL}/user/${id}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const handleResponse = async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    return responseData;
  };

  return (
    <PostsContext.Provider value={{
      createLostPost,
      createAdoptPost,
      createInformativePost,
      updatePost,
      deletePost,
      getPostById,
      getPostsByType,
      getUserPostsJson,
      // Agrega aquí los demás métodos
    }}>
      {children}
    </PostsContext.Provider>
  );
};
