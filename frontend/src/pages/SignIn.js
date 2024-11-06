// src/pages/SignIn.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signIn,
  checkTwoFactorEnabled,
  sendOtp,
  verifyOtpService,
  getUserDataByEmail,
} from "../services/authService";
import { setupRecaptcha } from "../firebaseConfig";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Container,
  CircularProgress,
  Fade,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignIn = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [verificationId, setVerificationId] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      const userData = await getUserDataByEmail(email);
      const isTwoFactorEnabled = await checkTwoFactorEnabled(userData.email); // Check if 2FA is enabled for the user
      if (isTwoFactorEnabled) {
        await getUserDataByEmail(email);
        
        const phoneNumber = userData.phoneNumber;
        console.log("Phone Number", phoneNumber);
        setupRecaptcha();
        const confirmationResult = await sendOtp(phoneNumber);
        setVerificationId(confirmationResult.verificationId);
        setIsOtpRequired(true);
      } else {
        navigate("/"); // Redirect to the dashboard if no OTP is required
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const verificationResult = await verifyOtpService(verificationId, otp);
      if (verificationResult) {
        navigate("/"); // Redirect to the dashboard if OTP verification is successful
      } else {
        setSnackbarMessage("Invalid OTP. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="xs">
        <Paper
          style={{
            padding: "40px",
            marginTop: "60px",
            textAlign: "center",
            borderRadius: "12px",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)",
          }}
          elevation={3}
        >
          <Typography
            variant="h4"
            gutterBottom
            style={{ fontWeight: 600, color: "#3f51b5" }}
          >
            Welcome Back!
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: "#757575", marginBottom: "20px" }}
          >
            Sign in to continue
          </Typography>
          <form
            onSubmit={isOtpRequired ? verifyOtp : handleSignIn}
            style={{ width: "100%" }}
          >
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: isLightMode ? "#ffffff" : "#424242",
                  borderRadius: "8px",
                  padding: "10px",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease", // Input transitions
                  color: isLightMode ? "#000000" : "#F5F5F5",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isLightMode ? "#ccc" : "#888",
                  },
                  "&:hover fieldset": {
                    borderColor: isLightMode ? "#3f51b5" : "#bb86fc",
                  },
                  "&:focus-within fieldset": {
                    borderColor: isLightMode ? "#3f51b5" : "#bb86fc",
                    boxShadow: isLightMode
                      ? "0 0 5px rgba(63, 81, 181, 0.5)"
                      : "0 0 5px rgba(187, 134, 252, 0.5)",
                  }, // Focus effect
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                style: {
                  backgroundColor: isLightMode ? "#ffffff" : "#424242",
                  borderRadius: "8px",
                  padding: "10px",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease", // Input transitions
                  color: isLightMode ? "#000000" : "#F5F5F5",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: isLightMode ? "#ccc" : "#888",
                  },
                  "&:hover fieldset": {
                    borderColor: isLightMode ? "#3f51b5" : "#bb86fc",
                  },
                  "&:focus-within fieldset": {
                    borderColor: isLightMode ? "#3f51b5" : "#bb86fc",
                    boxShadow: isLightMode
                      ? "0 0 5px rgba(63, 81, 181, 0.5)"
                      : "0 0 5px rgba(187, 134, 252, 0.5)",
                  }, // Focus effect
                },
              }}
            />
            {isOtpRequired && (
              <>
                <TextField
                  label="OTP"
                  type="text"
                  fullWidth
                  margin="normal"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  variant="outlined"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{
                    margin: "20px 0",
                    padding: "10px 0",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: "8px",
                    transition:
                      "background-color 0.3s ease, transform 0.2s ease",
                    backgroundColor: isLightMode ? "#4CAF50" : "#2E7D32", // Green shades for light and dark mode
                    color: isLightMode ? "#ffffff" : "#E0E0E0", // Text color for readability
                  }}
                  disabled={loading}
                  sx={{
                    "&:hover": {
                      backgroundColor: isLightMode ? "#388E3C" : "#1B5E20", // Slightly darker on hover
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}
            {!isOtpRequired && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  margin: "20px 0",
                  padding: "10px 0",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: "8px",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  backgroundColor: isLightMode ? "#4CAF50" : "#2E7D32", // Green shades for light and dark mode
                  color: isLightMode ? "#ffffff" : "#E0E0E0", // Text color for readability
                }}
                disabled={loading}
                sx={{
                  "&:hover": {
                    backgroundColor: isLightMode ? "#388E3C" : "#1B5E20", // Slightly darker on hover
                    transform: "scale(1.05)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>
            )}
            <Typography variant="body2" style={{ marginTop: "10px" }}>
              <Link
                to="/forgot-password"
                style={{ color: "#3f51b5", textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </Typography>
            <Typography
              variant="body2"
              style={{ marginTop: "15px", color: "#757575" }}
            >
              Don't have an account?{" "}
              <Link to="/signup" style={{ color: "#3f51b5", fontWeight: 500 }}>
                Sign Up
              </Link>
            </Typography>
          </form>

          {/* Add the reCAPTCHA container here */}
          <div id="recaptcha-container"></div>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="error"
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
    </Fade>
  );
};

export default SignIn;
