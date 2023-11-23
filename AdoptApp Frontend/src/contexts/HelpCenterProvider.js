import React, { createContext, useContext } from 'react';
import config from '../../config';

const API_URL = config.API_URL;
const CoordinatesContext = createContext();

export const useHelpCenters = () => useContext(CoordinatesContext);

export const HelpCenterProvider = ({ children }) => {
  const handleResponse = async (response) => {
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || 'Error en la petición');
    }
    return responseData;
  };

  const createCoordinates = async (formData) => {
    const url = `${API_URL}/api/coordinates`;
    const response = await fetch(url, { method: 'POST', body: formData });
    return handleResponse(response);
  };

  const findAllCoordinates = async () => {
    const url = `${API_URL}/api/coordinates`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const findOneCoordinates = async (id) => {
    const url = `${API_URL}/api/coordinates/${id}`;
    const response = await fetch(url, { method: 'GET' });
    return handleResponse(response);
  };

  const updateCoordinates = async (id, formData) => {
    const url = `${API_URL}/api/coordinates/${id}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: formData,
    });
    return handleResponse(response);
  };

  const removeCoordinates = async (id) => {
    const url = `${API_URL}/api/coordinates/${id}`;
    const response = await fetch(url, { method: 'DELETE' });
    return handleResponse(response);
  };

  // Agrega aquí los demás métodos siguiendo un enfoque similar

  return (
    <CoordinatesContext.Provider value={{
      createCoordinates,
      findAllCoordinates,
      findOneCoordinates,
      updateCoordinates,
      removeCoordinates,
    }}>
      {children}
    </CoordinatesContext.Provider>
  );
};
