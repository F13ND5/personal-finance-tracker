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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Goals = ({ userId }) => {
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/signin"); // Redirect to SignIn if no userId
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
          backgroundColor: "#4CAF50",
          color: "#fff",
        }}
      >
        <AddIcon />
      </IconButton>

      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        PaperProps={{
          style: {
            borderRadius: "12px",
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <Fade in={addDialogOpen}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              transition: "all 0.3s ease", // Added transition for paper
            }}
          >
            <DialogTitle
              style={{
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#3f51b5",
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
                }}
              >
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
                  autoFocus
                  InputProps={{
                    style: {
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease", // Input transitions
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: "#3f51b5" },
                      "&:focus-within fieldset": {
                        borderColor: "#3f51b5",
                        boxShadow: "0 0 5px rgba(63, 81, 181, 0.5)",
                      }, // Focus effect
                    },
                  }}
                />
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
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: "#3f51b5" },
                      "&:focus-within fieldset": {
                        borderColor: "#3f51b5",
                        boxShadow: "0 0 5px rgba(63, 81, 181, 0.5)",
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
                    backgroundColor: "#ffebee",
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
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#3f51b5",
                    transform: "scale(1.05)",
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
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        <Fade in={updateDialogOpen}>
          <Paper
            style={{
              padding: "40px",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              transition: "all 0.3s ease", // Added transition for paper
            }}
          >
            <DialogTitle
              style={{
                textAlign: "center",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "#3f51b5",
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
                }}
              >
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
                  autoFocus
                  InputProps={{
                    style: {
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease", // Input transitions
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: "#3f51b5" },
                      "&:focus-within fieldset": {
                        borderColor: "#3f51b5",
                        boxShadow: "0 0 5px rgba(63, 81, 181, 0.5)",
                      }, // Focus effect
                    },
                  }}
                />
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
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      padding: "10px",
                      transition:
                        "border-color 0.3s ease, box-shadow 0.3s ease",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#ccc" },
                      "&:hover fieldset": { borderColor: "#3f51b5" },
                      "&:focus-within fieldset": {
                        borderColor: "#3f51b5",
                        boxShadow: "0 0 5px rgba(63, 81, 181, 0.5)",
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
                    backgroundColor: "#ffebee",
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
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "#3f51b5",
                    transform: "scale(1.05)",
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
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Container maxWidth="lg" style={{ marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          Your Goals
        </Typography>
        <Grid2 container spacing={3}>
          {goals.map((goal, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={goal.id}>
              <Grow in={true} timeout={index * 500}>
                <Card
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s",
                    cursor: "pointer",
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
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
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
                            ? "#e0ffe0"
                            : "transparent",
                          transition: "all 0.3s ease",
                          boxShadow: goal.isAchieved
                            ? "0px 4px 10px rgba(0, 128, 0, 0.3)"
                            : "none",
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: goal.isAchieved
                              ? "#ccffcc"
                              : "#f0f0f0",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {goal.isAchieved ? (
                          <CheckCircleIcon color="success" fontSize="large" />
                        ) : (
                          <RadioButtonUncheckedIcon
                            color="disabled"
                            fontSize="large"
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
                          backgroundColor: "#e3f2fd",
                          transition: "all 0.3s ease",
                          boxShadow: "0px 4px 10px rgba(33, 150, 243, 0.3)",
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#bbdefb",
                            transform: "scale(1.1)",
                            boxShadow: "0px 6px 15px rgba(33, 150, 243, 0.5)",
                          },
                        }}
                      >
                        <EditIcon fontSize="medium" />
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
                          backgroundColor: "#ffebee",
                          transition: "all 0.3s ease",
                          boxShadow: "0px 4px 10px rgba(244, 67, 54, 0.3)",
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#ffcdd2",
                            transform: "scale(1.1)",
                            boxShadow: "0px 6px 15px rgba(244, 67, 54, 0.5)",
                          },
                        }}
                      >
                        <DeleteIcon fontSize="medium" />
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
