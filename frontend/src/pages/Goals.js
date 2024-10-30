// src/pages/Goals.js
import React, { useEffect, useState } from "react";
import {
  getGoals,
  addGoal,
  deleteGoal,
  updateGoal
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
  IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Goals = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ amount: "", title: "" });
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
    await addGoal(userId, { ...newGoal, date: new Date() });
    setSnackbarMessage("Goal added successfully!");
    setSnackbarOpen(true);
    setAddDialogOpen(false);
    const updatedGoals = await getGoals(userId);
    setGoals(updatedGoals);
    setNewGoal({ title: "", target: "" });
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

      <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
        <Paper style={{ padding: "20px", marginTop: "50px" }}>
          <DialogTitle>Add New Goal</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddGoal}>
              <TextField
                label="Title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                required
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Goal"
                type="number"
                value={newGoal.target}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, target: e.target.value })
                }
                required
                fullWidth
                style={{ marginBottom: "10px" }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddGoal} variant="contained" color="primary">
              Add Goal
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <Paper style={{ padding: "20px", marginTop: "50px" }}>
          <DialogTitle>Update Goal</DialogTitle>
          <DialogContent>
            <form onSubmit={updateGoal}>
              <TextField
                label="title"
                value={selectedGoal?.title || ""}
                onChange={(e) =>
                  setSelectedGoal({
                    ...selectedGoal,
                    title: e.target.value,
                  })
                }
                required
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Amount"
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
                style={{ marginBottom: "10px" }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdateDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUpdateGoal} variant="contained" color="primary">
              Update Goal
            </Button>
          </DialogActions>
        </Paper>
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
          {goals.map((goal) => (
            <Grid2 item xs={12} sm={6} md={4} key={goal.id}>
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
                <CardContent>
                  <Typography variant="h6" style={{ color: "#1E88E5" }}>
                    {goal.title}
                  </Typography>
                  <Typography variant="body1" style={{ margin: "8px 0" }}>
                    <strong>Target:</strong> ${goal.target}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Date:</strong>{" "}
                    {new Date(goal.date.seconds * 1000).toLocaleDateString()}
                  </Typography>
                </CardContent>

                <CardContent
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingTop: 0,
                  }}
                >
                  <IconButton
                    aria-label="edit"
                    color="primary"
                    onClick={() => handleUpdateDialogOpen(goal)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};

export default Goals;
