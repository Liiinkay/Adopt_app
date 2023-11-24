import React, { createContext, useContext } from 'react';
import config from '../../config';

const API_URL = config.API_URL;
const CommentsContext = createContext();

export const useComments = () => useContext(CommentsContext);

export const CommentsProvider = ({ children }) => {

  const createComment = async (postId, commentData, postType) => {
    const url = `${API_URL}/api/comments/${postType}/${postId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    return handleResponse(response);
  };

  const createReply = async (commentId, replyData) => {
    const url = `${API_URL}/api//comments/reply/${commentId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData),
    });
    return handleResponse(response);
  };

  const getCommentsByPost = async (postId) => {
    const url = `${API_URL}/api/comments/${postId}/comments`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const deleteComment = async (commentId) => {
    const url = `${API_URL}/api//comments/${commentId}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  const handleResponse = async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    return responseData;
  };

  // Aquí podrías añadir más funciones como actualizar comentario, etc.

  return (
    <CommentsContext.Provider value={{
      createComment,
      createReply,
      getCommentsByPost,
      deleteComment,
      // Agrega aquí los demás métodos según sean necesarios
    }}>
      {children}
    </CommentsContext.Provider>
  );
};
