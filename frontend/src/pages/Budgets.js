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
  Fade,
  Grow,
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

  const isNewBudgetCategoryValid = newBudget.category !== "" && newBudget.category !== null;
  const isNewBudgetAmountValid = newBudget.amount !== "" && newBudget.amount !== null;
  const isNewBudgetBtnDisable = !isNewBudgetCategoryValid || !isNewBudgetAmountValid;

  const isSelectedBudgetCategoryValid = selectedBudget?.category !== "" && selectedBudget?.category !== null;
  const isSelectedBudgetAmountValid = selectedBudget?.amount !== "" && selectedBudget?.amount !== null;
  const isSelectedBudgetBtnDisable = !isSelectedBudgetCategoryValid || !isSelectedBudgetAmountValid;

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
              Add New Budget
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={handleAddBudget}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <TextField
                  label="Budget Category"
                  placeholder="Enter your budget category"
                  value={newBudget.category}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, category: e.target.value })
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
                  label="Budget Amount"
                  placeholder="Enter budget amount"
                  type="number"
                  value={newBudget.amount}
                  onChange={(e) =>
                    setNewBudget({ ...newBudget, amount: e.target.value })
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
                onClick={handleAddBudget}
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
                disabled={isNewBudgetBtnDisable}
              >
                Add Budget
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
              Update Budget
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={updateBudget}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <TextField
                  label="Budget Category"
                  placeholder="Enter your budget category"
                  value={selectedBudget?.category || ""}
                  onChange={(e) =>
                    setSelectedBudget({
                      ...selectedBudget,
                      category: e.target.value,
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
                  label="Budget Amount"
                  placeholder="Enter Budget amount"
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
                onClick={handleUpdateBudget}
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
                disabled={isSelectedBudgetBtnDisable}
              >
                Update Budget
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
          Your Budgets
        </Typography>
        <Grid2 container spacing={3}>
          {budgets.map((budget, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={budget.id}>
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
                      {new Date(
                        budget.date.seconds * 1000
                      ).toLocaleDateString()}
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
              </Grow>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </>
  );
};

export default Budgets;
