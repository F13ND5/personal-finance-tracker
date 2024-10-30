// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Green
    },
    secondary: {
      main: '#2196F3', // Blue
    },
    error: {
      main: '#F44336', // Red
    },
    warning: {
      main: '#FF9800', // Orange
    },
    background: {
      default: '#F5F5F5', // Light Gray
    },
    text: {
      primary: '#424242', // Dark Gray
    },
  },
});

export default theme;