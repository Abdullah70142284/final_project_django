import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API
export const signup = async (username, email, password) => {
  const response = await api.post('/users/signup/', { username, email, password });
  return response.data;
};

export const login = async (identifier, password) => {
  const response = await api.post('/users/login/', { identifier, password });
  return response.data;
};

// Quiz API
export const getQuizzes = async () => {
  const response = await api.get('/quizzes/');
  return response.data;
};

export const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}/`);
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await api.post('/quizzes/', quizData);
  return response.data;
};

// Attempt API
export const submitAttempt = async (attemptData) => {
  const response = await api.post('/attempts/', attemptData);
  return response.data;
};

export const getAttempts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.username) params.append('username', filters.username);
  if (filters.quiz_title) params.append('quiz_title', filters.quiz_title);
  if (filters.start_date) params.append('start_date', filters.start_date);
  if (filters.end_date) params.append('end_date', filters.end_date);
  if (filters.min_score) params.append('min_score', filters.min_score);
  
  const response = await api.get(`/attempts/?${params.toString()}`);
  return response.data;
};

export default api;
