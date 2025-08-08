export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const API_KEY = '012345'; // The only valid API key

// Helper function to get API headers with authentication
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'knotapi': API_KEY,
});