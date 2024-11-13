// src/pages/Expenses.js
import React, { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";
import SortButton from "../components/SortButton";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TheatersIcon from "@mui/icons-material/Theaters";
import { useNavigate } from "react-router-dom";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Expenses = ({ userId }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: "", category: "" });
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/expenses");
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const fetchExpenses = async () => {
        const expensesData = await getExpenses(userId);
        setExpenses(expensesData);
        setLoading(false);
      };
      fetchExpenses();
    }
  }, [userId, navigate]);

  // Allowed categories for expenses
  const expenseCategories = ["Rent", "Food", "Transport", "Entertainment"];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await addExpense(userId, { ...newExpense, date: new Date() });
    setSnackbarMessage("Expense added successfully!");
    setSnackbarOpen(true);
    setAddDialogOpen(false);
    const updatedExpenses = await getExpenses(userId);
    setExpenses(updatedExpenses);
    setNewExpense({ amount: "", category: "" });
  };

  const handleUpdateExpense = async () => {
    if (selectedExpense) {
      await updateExpense(userId, selectedExpense.id, {
        ...selectedExpense,
        date: new Date(),
      });
      setSnackbarMessage("Expense updated successfully!");
      setSnackbarOpen(true);
      setUpdateDialogOpen(false);
      const updatedExpenses = await getExpenses(userId);
      setExpenses(updatedExpenses);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(userId, expenseId);
    setSnackbarMessage("Expense deleted successfully!");
    setSnackbarOpen(true);
    const updatedExpenses = await getExpenses(userId);
    setExpenses(updatedExpenses);
  };

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);
  const handleUpdateDialogOpen = (expense) => {
    setSelectedExpense(expense);
    setUpdateDialogOpen(true);
  };
  const handleUpdateDialogClose = () => setUpdateDialogOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Function to sort expenses by category
  const sortExpenses = (order) => {
    const sortedExpenses = [...expenses].sort((a, b) => {
      if (order === "asc") {
        return a.category.localeCompare(b.category);
      } else {
        return b.category.localeCompare(a.category);
      }
    });
    return sortedExpenses;
  };

  // Sort expenses based on the current order
  const sortedExpenses = sortExpenses(sortOrder);

  // Toggle sorting order
  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const isNewExpenseCategoryValid =
    newExpense.category !== "" && newExpense.category !== null;
  const isNewExpenseAmountValid =
    newExpense.amount !== "" && newExpense.amount !== null;
  const isNewExpenseBtnDisable =
    !isNewExpenseCategoryValid || !isNewExpenseAmountValid;

  const isSelectedExpenseCategoryValid =
    selectedExpense?.category !== "" && selectedExpense?.category !== null;
  const isSelectedExpenseAmountValid =
    selectedExpense?.amount !== "" && selectedExpense?.amount !== null;
  const isSelectedExpenseBtnDisable =
    !isSelectedExpenseCategoryValid || !isSelectedExpenseAmountValid;

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
          setNewExpense({ category: "", amount: "" }); // Reset form on close
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
              Add New Expense
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={handleAddExpense}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {/* Category Select Dropdown */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Expense Category</InputLabel>
                  <Select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    label="Expense Category"
                    style={{
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      transition: "box-shadow 0.3s, background-color 0.3s",
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: isLightMode
                          ? "#f1f8ff"
                          : theme.palette.action.hover,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    }}
                  >
                    {expenseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {/* Icon for each category */}
                        {category === "Rent" && (
                          <HomeIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Food" && (
                          <FoodBankIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Transport" && (
                          <DirectionsCarIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Entertainment" && (
                          <TheatersIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Expense Amount Field */}
                <TextField
                  label="Expense Amount"
                  placeholder="Enter expense amount"
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
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
                onClick={handleAddExpense}
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
                disabled={isNewExpenseBtnDisable}
              >
                Add Expense
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
              ? "0px 8px 30px rgba(0, 0, 0, 0.2)"
              : "0px 8px 30px rgba(0, 0, 0, 0.5)",
            backgroundColor: isLightMode ? "#fff" : "#333",
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
              Update Expense
            </DialogTitle>
            <DialogContent>
              <form
                onSubmit={updateExpense}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  padding: "15px",
                  borderRadius: "8px",
                }}
              >
                {/* Category Select Dropdown */}
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Expense Category</InputLabel>
                  <Select
                    value={selectedExpense?.category}
                    onChange={(e) =>
                      setSelectedExpense({
                        ...selectedExpense,
                        category: e.target.value,
                      })
                    }
                    label="Expense Category"
                    style={{
                      backgroundColor: isLightMode ? "#ffffff" : "#424242",
                      borderRadius: "8px",
                      transition: "box-shadow 0.3s, background-color 0.3s",
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: isLightMode
                          ? "#f1f8ff"
                          : theme.palette.action.hover,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: isLightMode
                          ? theme.palette.primary.main
                          : theme.palette.secondary.main,
                      },
                    }}
                  >
                    {expenseCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {/* Icon for each category */}
                        {category === "Rent" && (
                          <HomeIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Food" && (
                          <FoodBankIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Transport" && (
                          <DirectionsCarIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category === "Entertainment" && (
                          <TheatersIcon
                            style={{
                              marginRight: "8px",
                              color: theme.palette.primary.main,
                            }}
                          />
                        )}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Expense Amount Field */}
                <TextField
                  label="Expense Amount"
                  placeholder="Enter expense amount"
                  type="number"
                  value={selectedExpense?.amount}
                  onChange={(e) =>
                    setSelectedExpense({
                      ...selectedExpense,
                      amount: e.target.value,
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
                onClick={handleUpdateExpense}
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
                disabled={isSelectedExpenseBtnDisable}
              >
                Update Expense
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
          Your Expenses
        </Typography>
        <SortButton
          toggleSortOrder={toggleSortOrder}
          sortOrder={sortOrder}
          theme={theme}
          isLightMode={isLightMode}
        />
        <div style={{ marginTop: "1rem" }}></div>
        <Grid2 container spacing={3}>
          {sortedExpenses.map((expense, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={expense.id}>
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
                      {expense.category}
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
                      <strong>Amount:</strong> ${expense.amount}
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
                        expense.date.seconds * 1000
                      ).toLocaleDateString()}
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
                    <Tooltip title="Update Expense">
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={() => handleUpdateDialogOpen(expense)}
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

                    <Tooltip title="Delete Expense">
                      <IconButton
                        aria-label="delete"
                        color="secondary"
                        onClick={() => handleDeleteExpense(expense.id)}
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

export default Expenses;
