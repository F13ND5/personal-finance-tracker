// src/theme.js
import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode, // 'light' or 'dark'
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    background: {
      default: mode === 'dark' ? '#303030' : '#F5F5F5',
    },
    text: {
      primary: mode === 'dark' ? '#ffffff' : '#424242',
    },
  },
});

export default getTheme;