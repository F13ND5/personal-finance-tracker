// src/components/AppBar.js
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { logOut } from "../services/authService";
import { getUserProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const profileData = await getUserProfile(user.uid); // Fetch user profile data
          setUserProfile(profileData); // Set the profile data to state
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUserId(null);
        setUserProfile(null); // Clear profile data when user is not logged in
      }
    });
    return unsubscribe;
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogout = async () => {
    await logOut();
    setUserId(null);
    setUserProfile(null);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>

        {userId ? (
          <>
            <Button component={Link} to="/" color="inherit">
              Home
            </Button>
            <Button component={Link} to="/expenses" color="inherit">
              Expenses
            </Button>
            <Button component={Link} to="/goals" color="inherit">
              Goals
            </Button>
            <Button component={Link} to="/budgets" color="inherit">
              Budgets
            </Button>
            <div>
              {/* Assuming 'user.profileImage' contains the user's profile image URL */}
              <IconButton onClick={handleMenuOpen}>
                <Avatar src={userProfile?.profileImage} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </>
        ) : (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link
                  to="/signin"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Sign In
                </Link>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Sign Up
                </Link>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
