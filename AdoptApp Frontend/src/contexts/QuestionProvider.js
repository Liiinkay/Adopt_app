import React, { createContext, useContext } from 'react';
import config from '../../config';

const API_URL = config.API_URL;
const QuestionsContext = createContext();

export const useQuestions = () => useContext(QuestionsContext);

export const QuestionProvider = ({ children }) => {
  const handleResponse = async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    return responseData;
  };

  const createQuestion = async (postId, createQuestionDto) => {
    const url = `${API_URL}/api/question/${postId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createQuestionDto),
    });
    return handleResponse(response);
  };

  const answerQuestion = async (questionId, answer) => {
    const url = `${API_URL}/api/question/answer/${questionId}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    });
    return handleResponse(response);
  };

  const getQuestionsByPostId = async (postId) => {
    const url = `${API_URL}/api/question/${postId}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const deleteQuestion = async (questionId) => {
    const url = `${API_URL}/api/question/${questionId}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };


  return (
    <QuestionsContext.Provider value={{
      createQuestion,
      answerQuestion,
      getQuestionsByPostId,
      deleteQuestion,
    }}>
      {children}
    </QuestionsContext.Provider>
  );
};

