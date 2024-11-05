// src/services/newsApiService.js
import axios from "axios";

const NEWS_API_URL = "https://newsapi.org/v2/everything?q=finance&sortBy=popularity";
const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

export const fetchFinancialArticles = async () => {
  try {
    const response = await axios.get(
      `${NEWS_API_URL}&apiKey=${API_KEY}`
    );
    console.log(response.data);
    return response.data.articles || []; // Adjust based on actual API response structure
  } catch (error) {
    console.error("Error fetching articles:", error);
    return []; // Return an empty array on error
  }
};
