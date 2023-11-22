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


  const createFormAdopt = async (idPost, idApplicant, formData) => {
    const url = `${API_URL}/api/posts/adopt/${idPost}/form/${idApplicant}`;
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  };

  const getFormsByPostId = async (idPost) => {
    const url = `${API_URL}/api/posts/forms/${idPost}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const getPostsAppliedByUserId = async (idUser) => {
    const url = `${API_URL}/api/posts/userAppliedPosts/${idUser}`;
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
      createFormAdopt,
      getFormsByPostId,
      getPostsAppliedByUserId,
      // Agrega aquí los demás métodos
    }}>
      {children}
    </PostsContext.Provider>
  );
};
