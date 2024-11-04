// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/authService";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Container,
  CircularProgress,
  Fade,
  Grid,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import dayjs from "dayjs";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    profileImage: "../images/defaultProfile.png",
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [dobError, setDobError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isAdultWithinLimit = (dateString) => {
    const today = dayjs();
    const birthDate = dayjs(dateString);
    const age = today.diff(birthDate, "year");
    return age >= 18 && age <= 100;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError(true);
      setSnackbarMessage("Passwords do not match");
      setSnackbarOpen(true);
      return;
    }
    setPasswordError(false);

    // Validate date of birth
    if (!isAdultWithinLimit(formData.dateOfBirth)) {
      setDobError(true);
      setSnackbarMessage("You must be between 18 and 100 years old to sign up");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    setDobError(false);

    try {
      await signUp(formData.email, formData.password, formData);
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
      <Container maxWidth="sm">
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
            Create Account
          </Typography>
          <Typography
            variant="subtitle1"
            style={{ color: "#757575", marginBottom: "20px" }}
          >
            Join us and start tracking your finances
          </Typography>
          <form onSubmit={handleSignUp} style={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  fullWidth
                  value={formData.fullName}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  fullWidth
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={passwordError}
                  helperText={passwordError ? "Passwords do not match" : ""}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  name="address"
                  fullWidth
                  value={formData.address}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Occupation"
                  name="occupation"
                  fullWidth
                  value={formData.occupation}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  fullWidth
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={dobError}
                  helperText={
                    dobError ? "You must be between 18 and 100 years old" : ""
                  }
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    style: {
                      backgroundColor: "#fafafa",
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
            </Grid>
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
                "Sign Up"
              )}
            </Button>
            <Typography
              variant="body2"
              style={{ marginTop: "10px", color: "#757575" }}
            >
              Already have an account?{" "}
              <Link to="/signin" style={{ color: "#3f51b5", fontWeight: 500 }}>
                Sign In
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

export default SignUp;
