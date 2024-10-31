// src/pages/Budgets.js
import React, { useEffect, useState } from "react";
import {
  getBudgets,
  addBudget,
  deleteBudget,
  updateBudget,
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
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Budgets = ({ userId }) => {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ amount: "", category: "" });
  const [selectedBudget, setSelectedBudget] = useState(null);
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
      const fetchBudgets = async () => {
        const budgetsData = await getBudgets(userId);
        setBudgets(budgetsData);
        setLoading(false);
      };
      fetchBudgets();
    }
  }, [userId, navigate]);

  const handleAddBudget = async (e) => {
    e.preventDefault();
    await addBudget(userId, { ...newBudget, date: new Date() });
    setSnackbarMessage("Budget added successfully!");
    setSnackbarOpen(true);
    setAddDialogOpen(false);
    const updatedBudgets = await getBudgets(userId);
    setBudgets(updatedBudgets);
    setNewBudget({ amount: "", category: "" });
  };

  const handleUpdateBudget = async () => {
    if (selectedBudget) {
      await updateBudget(userId, selectedBudget.id, {
        ...selectedBudget,
        date: new Date(),
      });
      setSnackbarMessage("Budget updated successfully!");
      setSnackbarOpen(true);
      setUpdateDialogOpen(false);
      const updatedBudgets = await getBudgets(userId);
      setBudgets(updatedBudgets);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    await deleteBudget(userId, budgetId);
    setSnackbarMessage("Budget deleted successfully!");
    setSnackbarOpen(true);
    const updatedBudgets = await getBudgets(userId);
    setBudgets(updatedBudgets);
  };

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);
  const handleUpdateDialogOpen = (budget) => {
    setSelectedBudget(budget);
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
          <DialogTitle>Add New Budget</DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddBudget}>
              <TextField
                label="Category"
                value={newBudget.category}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, category: e.target.value })
                }
                required
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Amount"
                type="number"
                value={newBudget.amount}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, amount: e.target.value })
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
            <Button
              onClick={handleAddBudget}
              variant="contained"
              color="primary"
            >
              Add Budget
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleUpdateDialogClose}>
        <Paper style={{ padding: "20px", marginTop: "50px" }}>
          <DialogTitle>Update Budget</DialogTitle>
          <DialogContent>
            <form onSubmit={updateBudget}>
              <TextField
                label="Category"
                value={selectedBudget?.category || ""}
                onChange={(e) =>
                  setSelectedBudget({
                    ...selectedBudget,
                    category: e.target.value,
                  })
                }
                required
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <TextField
                label="Amount"
                type="number"
                value={selectedBudget?.amount || ""}
                onChange={(e) =>
                  setSelectedBudget({
                    ...selectedBudget,
                    amount: e.target.value,
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
            <Button
              onClick={handleUpdateBudget}
              variant="contained"
              color="primary"
            >
              Update Budget
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
          Your Budgets
        </Typography>
        <Grid2 container spacing={3}>
          {budgets.map((budget) => (
            <Grid2 item xs={12} sm={6} md={4} key={budget.id}>
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
                    {budget.category}
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
                    <strong>Amount:</strong> ${budget.amount}
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
                    {new Date(budget.date.seconds * 1000).toLocaleDateString()}
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
                  <Tooltip title="Update Budget">
                    <IconButton
                      aria-label="edit"
                      color="primary"
                      onClick={() => handleUpdateDialogOpen(budget)}
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

                  <Tooltip title="Delete Budget">
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => handleDeleteBudget(budget.id)}
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
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};

export default Budgets;
