// src/pages/UserProfile.js
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Snackbar,
  Avatar,
  CircularProgress,
  Grid2,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import { getUserProfile, updateUserProfile } from "../services/userService"; // Service to manage user data

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProfile = ({ userId }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [userData, setUserData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getUserProfile(userId);
        if (data) {
          setUserData(data);
          setImagePreview(data.profileImage);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false); // End loading state after data fetch
      }
    };
    fetchProfileData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setNewImage(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (newImage) {
        const updatedUserData = { ...userData, profileImage: imagePreview };
        await updateUserProfile(userId, updatedUserData);
      } else {
        await updateUserProfile(userId, userData);
      }
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarOpen(true);
      handleCancelEdit();

      // Refresh the page to update the navbar with the new image
      window.location.reload();
    } catch (error) {
      setSnackbarMessage("Failed to update profile");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setImagePreview(userData.profileImage);
    setNewImage(null);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const isUserDataFullNameValid =
    userData?.fullName !== "" && userData?.fullName !== null;
  const isUserDataPhoneNumberValid =
    userData?.phoneNumber !== "" && userData?.phoneNumber !== null;
  const isUserDataAddressValid =
    userData?.address !== "" && userData?.address !== null;
  const isUserDataBtnDisable =
    !isUserDataFullNameValid || !isUserDataPhoneNumberValid || !isUserDataAddressValid;

  return (
    <Container maxWidth="sm">
      <Paper
        style={{ padding: "30px", marginTop: "20px", textAlign: "center" }}
      >
        {loading && (
          <CircularProgress
            size={40}
            style={{ display: "block", margin: "20px auto" }}
          />
        )}
        <Typography variant="h4" gutterBottom>
          Update Profile
        </Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Avatar
            src={imagePreview}
            alt="Profile Picture"
            style={{ width: 120, height: 120, marginRight: 16 }}
          />
          {editMode && (
            <>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  component="span"
                  style={{
                    position: "relative",
                    padding: "8px",
                    backgroundColor: "#f0f0f0", // Light background
                    borderRadius: "50%", // Circular background
                    transition: "background-color 0.3s",
                    marginLeft: -20,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e0e0e0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0")
                  }
                >
                  <EditIcon fontSize="large" style={{ color: "#00796b" }} />
                </IconButton>
              </label>
            </>
          )}
        </div>
        {!editMode ? (
          <Grid2 container spacing={2} direction="column">
            <Grid2 item>
              <Typography variant="body1">
                <strong>Full Name:</strong> {userData.fullName || "N/A"}
              </Typography>
            </Grid2>
            <Grid2 item>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {userData.phoneNumber || "N/A"}
              </Typography>
            </Grid2>
            <Grid2 item>
              <Typography variant="body1">
                <strong>Address:</strong> {userData.address || "N/A"}
              </Typography>
            </Grid2>
            <Grid2 item>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </Button>
            </Grid2>
          </Grid2>
        ) : (
          <Grid2 container spacing={2} direction="column">
            <Grid2 item>
              <TextField
                label="Full Name"
                name="fullName"
                placeholder={userData.fullName || "Enter your full name"}
                value={userData.fullName || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid2>
            <Grid2 item>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={userData.phoneNumber || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid2>
            <Grid2 item>
              <TextField
                label="Address"
                name="address"
                placeholder="Enter your address"
                value={userData.address || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid2>
            <Grid2 item>
              <Grid2 container spacing={2}>
                <Grid2 item xs>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      transition:
                        "background-color 0.3s ease, transform 0.2s ease",
                      backgroundColor: isLightMode ? "#4CAF50" : "#2E7D32", // Green shades for light and dark mode
                      color: isLightMode ? "#ffffff" : "#E0E0E0", // Text color for readability
                      "&:hover": {
                        backgroundColor: isLightMode ? "#388E3C" : "#1B5E20", // Slightly darker on hover
                        transform: "scale(1.05)",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: isLightMode
                          ? "none"
                          : theme.palette.grey[300],
                        color: theme.palette.grey[500],
                      },
                    }}
                    onClick={handleSave}
                    disabled={isUserDataBtnDisable || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Grid2>
                <Grid2 item xs>
                  <Button
                    color="error"
                    variant="outlined"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      fontWeight: 600,
                      transition:
                        "background-color 0.3s ease, transform 0.2s ease", // Transition for button
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: isLightMode
                          ? "#ffebee"
                          : theme.palette.error.light,
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: theme.palette.success.main, // Use theme colors
            color: theme.palette.getContrastText(theme.palette.success.main), // Ensure contrast
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserProfile;
