// src/pages/Goals.js
import React, { useEffect, useState } from "react";
import {
  getGoals,
  addGoal,
  deleteGoal,
  updateGoal,
} from "../services/firestoreService";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid2,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  ToggleButton,
  Tooltip,
  Fade,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import SortButton from "../components/SortButton";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Goals = ({ userId }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    amount: "",
    title: "",
    isAchieved: false,
  });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/goals");
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const fetchGoals = async () => {
        const goalsData = await getGoals(userId);
        setGoals(goalsData);
        setLoading(false);
      };
      fetchGoals();
    }
  }, [userId, navigate]);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    await addGoal(userId, { ...newGoal, isAchieved: false, date: new Date() });
    setSnackbarMessage("Goal added successfully!");
    setSnackbarOpen(true);
    setAddDialogOpen(false);
    const updatedGoals = await getGoals(userId);
    setGoals(updatedGoals);
    setNewGoal({ title: "", target: "", isAchieved: false });
  };

  const handleToggleAchieved = async (goal) => {
    const updatedGoal = { ...goal, isAchieved: !goal.isAchieved };
    await updateGoal(userId, goal.id, updatedGoal);
    setGoals((prevGoals) =>
      prevGoals.map((g) => (g.id === goal.id ? updatedGoal : g))
    );
  };

  const handleUpdateGoal = async () => {
    if (selectedGoal) {
      await updateGoal(userId, selectedGoal.id, {
        ...selectedGoal,
        date: new Date(),
      });
      setSnackbarMessage("Goal updated successfully!");
      setSnackbarOpen(true);
      setUpdateDialogOpen(false);
      const updatedGoals = await getGoals(userId);
      setGoals(updatedGoals);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    await deleteGoal(userId, goalId);
    setSnackbarMessage("Goal deleted successfully!");
    setSnackbarOpen(true);
    const updatedGoals = await getGoals(userId);
    setGoals(updatedGoals);
  };

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);
  const handleUpdateDialogOpen = (budget) => {
    setSelectedGoal(budget);
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => setUpdateDialogOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Function to sort goals by category
  const sortGoals = (order) => {
    const sortedGoals = [...goals].sort((a, b) => {
      if (order === "asc") {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
      }
    });
    return sortedGoals;
  };

  // Sort goals based on the current order
  const sortedGoals = sortGoals(sortOrder);

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const isNewGoalTitleValid = newGoal.title !== "" && newGoal.title !== null;
  const isNewGoalTargetValid = newGoal.target !== "" && newGoal.target !== null;
  const isNewGoalBtnDisable = !isNewGoalTitleValid || !isNewGoalTargetValid;

  const isSelectedGoalTitleValid =
    selectedGoal?.title !== "" && selectedGoal?.title !== null;
  const isSelectedGoalTargetValid =
    selectedGoal?.target !== "" && selectedGoal?.target !== null;
  const isSelectedGoalBtnDisable =
    !isSelectedGoalTitleValid || !isSelectedGoalTargetValid;

  if (loading) return <CircularProgress />;

  return (
    <>
      <IconButton
        color="primary"
        onClick={handleAddDialogOpen}
        style={{
          position: "fixed",
          top: "100px",
          right: "20px",
          /*backgroundColor: isLightMode ? "#4CAF50" : theme.palette.success.main,
          color: theme.palette.getContrastText(
            isLightMode ? "#fff" : theme.palette.success.main
          ),*/
          backgroundColor: isLightMode
            ? "#4CAF50"
            : theme.palette.background.default,
          transition: "all 0.3s ease",
          boxShadow: isLightMode
            ? "0px 4px 10px rgba(33, 150, 243, 0.3)"
            : `0px 4px 10px ${theme.palette.primary.main}80`,
        }}
        sx={{
          "&:hover": {
            backgroundColor: isLightMode
              ? "#bbdefb"
              : theme.palette.primary.light,
            transform: "scale(1.1)",
            boxShadow: isLightMode
              ? "0px 6px 15px rgba(33, 150, 243, 0.5)"
              : `0px 6px 15px ${theme.palette.primary.main}120`,
          },
        }}
      >
        <AddIcon
          fontSize="medium"
          style={{
            color: isLightMode
              ? theme.palette.common.white
              : theme.palette.success.light,
          }}
        />
      </IconButton>

      <Dialog
        open={addDialogOpen}
        onClose={() => {
          handleAddDialogClose();
          setNewGoal({ title: "", target: "" }); // Reset form on close
        }}
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: isLightMode
              ? "0px 8px 30px rgba(0, 0, 0, 0.2)" // Subtle shadow for light mode
              : "0px 8px 30px rgba(0, 0, 0, 0.5)", // Stronger shadow for dark mode
            backgroundColor: isLightMode ? "#fff" : "#333", // Adjust background for dark mode
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <Fade in={addDialogOpen}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: isLightMode ? "#f9f9f9" : "#333",
              borderRadius: "12px",
              color: isLightMode ? "#424242" : "#E0E0E0",
              transition: "all 0.3s ease",
              boxShadow: isLightMode
                ? "0px 4px 8px rgba(0, 0, 0, 0.1)" // Light shadow for light mode
                : "0px 4px 12px rgba(0, 0, 0, 0.3)", // Darker, deeper shadow for dark mode
            }}
            elevation={isLightMode ? 2 : 5}
          >
            <DialogTitle
              style={{
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: isLightMode ? "#3f51b5" : "#bb86fc",
              }}
            >
              Add New Goal
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={handleAddGoal}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {/* Goal Title Field */}
                <TextField
                  label="Goal Title"
                  placeholder="Enter your goal title"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      padding: "10px",
                      color: isLightMode ? "#000000" : "#F5F5F5",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isLightMode ? "#ccc" : "#888",
                      },
                      "&:hover fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    },
                  }}
                />

                {/* Target Amount Field */}
                <TextField
                  label="Target Amount"
                  placeholder="Enter target amount"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      padding: "10px",
                      color: isLightMode ? "#000000" : "#F5F5F5",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isLightMode ? "#ccc" : "#888",
                      },
                      "&:hover fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    },
                  }}
                />
              </form>
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "space-between", paddingTop: "20px" }}
            >
              <Button
                onClick={handleAddDialogClose}
                color="error"
                variant="outlined"
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease", // Transition for button
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: isLightMode
                      ? "#ffebee"
                      : theme.palette.error.light,
                    transform: "scale(1.05)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddGoal}
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  backgroundColor: isLightMode ? "#4CAF50" : "#2E7D32",
                  color: isLightMode ? "#ffffff" : "#E0E0E0", // Text color for readability
                  "&:hover": {
                    backgroundColor: isLightMode ? "#388E3C" : "#1B5E20",
                    transform: "scale(1.05)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: isLightMode
                      ? "none"
                      : theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  },
                }}
                disabled={isNewGoalBtnDisable}
              >
                Add Goal
              </Button>
            </DialogActions>
          </Paper>
        </Fade>
      </Dialog>

      <Dialog
        open={updateDialogOpen}
        onClose={handleUpdateDialogClose}
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: isLightMode
              ? "0px 8px 30px rgba(0, 0, 0, 0.2)" // Subtle shadow for light mode
              : "0px 8px 30px rgba(0, 0, 0, 0.5)", // Stronger shadow for dark mode
            backgroundColor: isLightMode ? "#fff" : "#333", // Adjust background for dark mode
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <Fade in={updateDialogOpen}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: isLightMode ? "#f9f9f9" : "#333",
              borderRadius: "12px",
              color: isLightMode ? "#424242" : "#E0E0E0",
              transition: "all 0.3s ease",
              boxShadow: isLightMode
                ? "0px 4px 8px rgba(0, 0, 0, 0.1)" // Light shadow for light mode
                : "0px 4px 12px rgba(0, 0, 0, 0.3)", // Darker, deeper shadow for dark mode
            }}
            elevation={isLightMode ? 2 : 5}
          >
            <DialogTitle
              style={{
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: isLightMode ? "#3f51b5" : "#bb86fc",
              }}
            >
              Update Goal
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={updateGoal}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >

                {/* Goal Title Field */}
                <TextField
                  label="Goal Title"
                  placeholder="Enter your goal title"
                  value={selectedGoal?.title || ""}
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      title: e.target.value,
                    })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      padding: "10px",
                      color: isLightMode ? "#000000" : "#F5F5F5",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isLightMode ? "#ccc" : "#888",
                      },
                      "&:hover fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    },
                  }}
                />

                {/* Target Amount Field */}
                <TextField
                  label="Target Amount"
                  placeholder="Enter target amount"
                  type="number"
                  value={selectedGoal?.target || ""}
                  onChange={(e) =>
                    setSelectedGoal({
                      ...selectedGoal,
                      target: e.target.value,
                    })
                  }
                  required
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    style: {
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      padding: "10px",
                      color: isLightMode ? "#000000" : "#F5F5F5",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: isLightMode ? "#ccc" : "#888",
                      },
                      "&:hover fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    },
                  }}
                />
              </form>
            </DialogContent>
            <DialogActions
              style={{ justifyContent: "space-between", paddingTop: "20px" }}
            >
              <Button
                onClick={handleUpdateDialogClose}
                color="error"
                variant="outlined"
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease", // Transition for button
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: isLightMode
                      ? "#ffebee"
                      : theme.palette.error.light,
                    transform: "scale(1.05)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateGoal}
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                  backgroundColor: isLightMode ? "#4CAF50" : "#2E7D32",
                  color: isLightMode ? "#ffffff" : "#E0E0E0", // Text color for readability
                  "&:hover": {
                    backgroundColor: isLightMode ? "#388E3C" : "#1B5E20",
                    transform: "scale(1.05)",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: isLightMode
                      ? "none"
                      : theme.palette.grey[300],
                    color: theme.palette.grey[500],
                  },
                }}
                disabled={isSelectedGoalBtnDisable}
              >
                Update Goal
              </Button>
            </DialogActions>
          </Paper>
        </Fade>
      </Dialog>

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

      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Your Goals
        </Typography>
        <SortButton
          toggleSortOrder={toggleSortOrder}
          sortOrder={sortOrder}
          theme={theme}
          isLightMode={isLightMode}
        />
        <div style={{ marginTop: "1rem" }}></div>
        <Grid2 container spacing={3}>
          {sortedGoals.map((goal, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={goal.id}>
              <Grow in={true} timeout={index * 500}>
                <Card
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: isLightMode
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "0px 4px 10px rgba(255, 255, 255, 0.2)",
                    transition: "transform 0.3s",
                    cursor: "pointer",
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    borderRadius: "8px",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.03)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <CardContent
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      padding: "16px",
                      boxShadow: isLightMode
                        ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                        : "0px 4px 10px rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      style={{ color: "#1E88E5", fontWeight: 600 }}
                    >
                      {goal.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      style={{
                        margin: "8px 0",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        color: "#424242",
                      }}
                    >
                      <strong>Target:</strong> ${goal.target}
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{
                        color: "#757575",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <strong>Date:</strong>{" "}
                      {new Date(goal.date.seconds * 1000).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardContent
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      paddingTop: "8px",
                      backgroundColor: isLightMode
                        ? "transparent"
                        : theme.palette.background.default,
                      boxShadow: isLightMode
                        ? "none"
                        : "0px 4px 10px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Tooltip
                      title={
                        goal.isAchieved
                          ? "Mark as Not Achieved"
                          : "Mark as Achieved"
                      }
                    >
                      <ToggleButton
                        value="check"
                        selected={goal.isAchieved}
                        onChange={() => handleToggleAchieved(goal)}
                        style={{
                          padding: 4,
                          borderRadius: "50%",
                          backgroundColor: goal.isAchieved
                            ? `${theme.palette.success.dark}29`
                            : theme.palette.background.paper,
                          transition: "all 0.3s ease",
                          boxShadow: goal.isAchieved
                            ? `0px 4px 12px ${theme.palette.success.main}1066`
                            : `0px 4px 8px ${theme.palette.grey[400]}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: goal.isAchieved
                              ? theme.palette.success.light
                              : theme.palette.grey[200],
                            transform: "scale(1.1)",
                            boxShadow: goal.isAchieved
                              ? `0px 6px 15px ${theme.palette.success.main}80`
                              : `0px 6px 15px ${theme.palette.grey[500]}`,
                          },
                        }}
                      >
                        {goal.isAchieved ? (
                          <CheckCircleIcon
                            fontSize="large"
                            sx={{
                              color: theme.palette.success.main,
                              transition: "transform 0.3s ease",
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedIcon
                            fontSize="large"
                            sx={{
                              color: theme.palette.text.disabled,
                              transition: "transform 0.3s ease",
                            }}
                          />
                        )}
                      </ToggleButton>
                    </Tooltip>

                    <Tooltip title="Update Goal">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleUpdateDialogOpen(goal)}
                        style={{
                          padding: 8,
                          borderRadius: "50%",
                          margin: "0 8px",
                          backgroundColor: isLightMode
                            ? "#e3f2fd"
                            : theme.palette.background.default,
                          transition: "all 0.3s ease",
                          boxShadow: isLightMode
                            ? "0px 4px 10px rgba(33, 150, 243, 0.3)"
                            : `0px 4px 10px ${theme.palette.primary.main}40`,
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: isLightMode
                              ? "#bbdefb"
                              : theme.palette.primary.light,
                            transform: "scale(1.1)",
                            boxShadow: isLightMode
                              ? "0px 6px 15px rgba(33, 150, 243, 0.5)"
                              : `0px 6px 15px ${theme.palette.primary.main}80`,
                          },
                        }}
                      >
                        <EditIcon
                          fontSize="medium"
                          style={{
                            color: isLightMode
                              ? theme.palette.primary.light
                              : theme.palette.common.white,
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Goal">
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleDeleteGoal(goal.id)}
                        style={{
                          padding: 8,
                          borderRadius: "50%",
                          backgroundColor: isLightMode
                            ? "#ffebee"
                            : theme.palette.error.dark,
                          transition: "all 0.3s ease",
                          boxShadow: "0px 4px 10px rgba(244, 67, 54, 0.3)",
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: isLightMode
                              ? "#ffcdd2"
                              : theme.palette.error.light,
                            transform: "scale(1.1)",
                            boxShadow: "0px 6px 15px rgba(244, 67, 54, 0.5)",
                          },
                        }}
                      >
                        <DeleteIcon
                          fontSize="medium"
                          style={{
                            color: isLightMode
                              ? theme.palette.secondary.light
                              : theme.palette.common.white,
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </CardContent>
                </Card>
              </Grow>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};

export default Goals;
