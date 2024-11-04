// src/pages/SignIn.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signIn } from "../services/authService";
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/"); // Redirect to the dashboard or home page
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
          <form onSubmit={handleSignIn} style={{ width: "100%" }}>
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
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#3f51b5" },
                  "&:focus-within fieldset": {
                    borderColor: "#3f51b5",
                    boxShadow: "0 0 5px rgba(63, 81, 181, 0.3)",
                  },
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
                  backgroundColor: "#fafafa",
                  borderRadius: "8px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ccc" },
                  "&:hover fieldset": { borderColor: "#3f51b5" },
                  "&:focus-within fieldset": {
                    borderColor: "#3f51b5",
                    boxShadow: "0 0 5px rgba(63, 81, 181, 0.3)",
                  },
                },
              }}
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
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              disabled={loading}
              sx={{
                "&:hover": {
                  backgroundColor: "#3f51b5",
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
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Fade>
  );
};

export default SignIn;
