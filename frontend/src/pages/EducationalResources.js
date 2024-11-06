// src/pages/EducationalResources.js
import React, { useEffect, useState } from "react";
import { fetchFinancialArticles } from "../services/newsApiService";
import { fetchFinancialVideos } from "../services/youtubeApiService";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { useNavigate } from "react-router-dom";

const EducationalResources = ({ userId }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("articles");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/resources");
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      const loadResources = async () => {
        setLoading(true);
        try {
          const fetchedArticles = await fetchFinancialArticles();
          const fetchedVideos = await fetchFinancialVideos();

          setArticles(fetchedArticles);
          setVideos(fetchedVideos);
        } catch (error) {
          console.error("Error loading resources:", error);
        } finally {
          setLoading(false);
        }
      };

      loadResources();
    }
  }, [userId, navigate]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      setSearchTerm("");
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVideos = videos.filter((video) =>
    video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
        sx={{
          background: isLightMode
            ? "linear-gradient(135deg, #F5F7FA 0%, #B8C6DB 100%)"
            : "linear-gradient(135deg, #2E3B4E 0%, #212F3D 100%)",
          color: theme.palette.text.secondary,
        }}
      >
        <CircularProgress
          size={80}
          sx={{
            color: theme.palette.primary.main,
            animationDuration: "1s",
          }}
        />
        <Typography
          variant="h6"
          mt={2}
          sx={{
            fontSize: "1.2rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            mt: 3,
            animation: "fadeIn 1.2s ease-in-out infinite",
          }}
        >
          Fetching insights to help you grow financially...
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        mb={4}
        align="center"
        fontWeight={600}
        gutterBottom
      >
        Educational Resources
      </Typography>

      <Box display="flex" mb={4} alignItems="center" sx={{ width: "100%" }}>
        {/* Search Bar */}
        <Box sx={{ flex: "0 1 auto", mr: 2 }}>
          <TextField
            label="Search Resources"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              maxWidth: 400,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
              "& input": {
                paddingLeft: "48px", // Space for icon
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchTerm("")}
                    aria-label="clear search"
                    sx={{
                      visibility: searchTerm ? "visible" : "hidden",
                      "&:hover": {
                        backgroundColor: "transparent", // Remove background on hover
                      },
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Filter Toggle Buttons */}
        <Box
          sx={{ flex: "1 1 auto", display: "flex", justifyContent: "center" }}
        >
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            aria-label="filter"
            sx={{
              backgroundColor: "background.paper",
              borderRadius: "8px",
              boxShadow: isLightMode
                ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                : "0px 4px 10px rgba(255, 255, 255, 0.2)",
              "& .MuiToggleButton-root": {
                padding: "10px 20px",
                border: "none",
                fontSize: "1rem",
                textTransform: "none",
                color: "text.secondary", // Color for unselected buttons
                "&.Mui-selected": {
                  backgroundColor: "primary.main", // Background for selected button
                  color: "#fff", // Text color for selected button
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "primary.dark", // Hover color for selected button
                  },
                },
                "&:hover": {
                  backgroundColor: "background.default", // Hover color for unselected buttons
                },
              },
            }}
          >
            <ToggleButton value="articles" aria-label="articles">
              <ArticleIcon sx={{ mr: 1 }} />
              Articles
            </ToggleButton>
            <ToggleButton value="videos" aria-label="videos">
              <PlayCircleFilledIcon sx={{ mr: 1 }} />
              Videos
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {filter === "articles" && (
        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            Articles
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            {filteredArticles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.url}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    borderRadius: "10px",
                    boxShadow: isLightMode
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "0px 4px 10px rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {article.description}
                    </Typography>
                    <Button
                      variant="contained"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        mt: 2,
                        bgcolor: "primary.main",
                        color: "#fff",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {filter === "videos" && (
        <Box mb={6}>
          <Typography variant="h5" gutterBottom>
            Videos
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            {filteredVideos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    borderRadius: "10px",
                    boxShadow: isLightMode
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "0px 4px 10px rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {video.snippet.title}
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        paddingTop: "56.25%", // 16:9 aspect ratio
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${video.id.videoId}`}
                        frameBorder="0"
                        allowFullScreen
                        title={video.snippet.title}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default EducationalResources;
