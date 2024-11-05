// src/services/youtubeApiService.js
import axios from "axios";

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const fetchFinancialVideos = async () => {
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: 'snippet',
        q: 'financial literacy',
        type: 'video',
        key: API_KEY,
      },
    });
    return response.data.items || []; // Adjust based on actual API response structure
  } catch (error) {
    console.error('Error fetching videos:', error);
    return []; // Return an empty array on error
  }
};
