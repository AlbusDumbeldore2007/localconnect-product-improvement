import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Posts / Announcements
export const getPosts = () => axios.get(`${API_URL}/posts`);
export const createPost = (content) => axios.post(`${API_URL}/posts`, { content });

// Issues / Neighborhood Alerts
export const getIssues = () => axios.get(`${API_URL}/issues`);
export const createIssue = (title, description) => axios.post(`${API_URL}/issues`, { title, description });
export const updateIssue = (id, status) => axios.patch(`${API_URL}/issues/${id}`, { status });

// Community Events
export const getEvents = () => axios.get(`${API_URL}/events`);
export const createEvent = (data) => axios.post(`${API_URL}/events`, data);
export const rsvpEvent = (id) => axios.post(`${API_URL}/events/${id}/rsvp`);

// Local Recommendations
export const getRecommendations = () => axios.get(`${API_URL}/recommendations`);
export const createRecommendation = (data) => axios.post(`${API_URL}/recommendations`, data);
export const likeRecommendation = (id) => axios.post(`${API_URL}/recommendations/${id}/like`);

// Community Metrics / Overview
export const getMetrics = () => axios.get(`${API_URL}/metrics`);
