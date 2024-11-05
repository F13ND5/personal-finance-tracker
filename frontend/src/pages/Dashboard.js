// src/pages/Dashboard.js
import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Grid,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { MoneyOff, Assessment, PieChart, Receipt } from "@mui/icons-material"; // Example icons
import ExpenseSummaryCard from "../components/ExpenseSummaryCard";
import GoalProgressChart from "../components/GoalProgressChart";
import BudgetStatus from "../components/BudgetStatus";
import RecentTransactions from "../components/RecentTransactions";
import {
  getExpenses,
  getBudgets,
  getGoals,
  getAchievedGoals,
} from "../services/firestoreService";
import { useNavigate } from "react-router-dom";

const boxStyles = (isLightMode, theme) => ({
  borderRadius: 2,
  boxShadow: 3,
  p: 3,
  bgcolor: isLightMode ? theme.palette.grey[100] : theme.palette.grey[900],
  transition: "0.3s",
  "&:hover": {
    boxShadow: 6,
  },
  cursor: "pointer",
});

const Dashboard = ({ userId }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!userId) {
      navigate("/");
      const timer = setTimeout(() => {
        navigate("/signin");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      try {
        const [
          fetchedExpenses,
          fetchedBudgets,
          fetchedGoals,
          fetchedAchievedGoals,
        ] = await Promise.all([
          getExpenses(userId),
          getBudgets(userId),
          getGoals(userId),
          getAchievedGoals(userId),
        ]);
        setLoading(true);
        setExpenses(fetchedExpenses);
        setBudgets(fetchedBudgets);
        setGoals(fetchedGoals);
        setAchievedGoals(fetchedAchievedGoals); // Set achieved goals data
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    }
  }, [userId, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate total expenses safely
  const totalExpenses = expenses.reduce((acc, expense) => {
    const amount = parseFloat(expense.amount); // Convert to number
    return acc + (isNaN(amount) ? 0 : amount); // Add only if it's a valid number
  }, 0);

  // Calculate total budgets safely
  const totalBudget = budgets.reduce((acc, budget) => {
    const amount = parseFloat(budget.amount); // Convert to number
    return acc + (isNaN(amount) ? 0 : amount); // Add only if it's a valid number
  }, 0);

  // Calculate remaining budget safely
  const remainingBudget = totalBudget - totalExpenses;

  return (
    <Container
      maxWidth="lg"
      sx={{ padding: 3, bgcolor: theme.palette.background.default }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={4}
      >
        <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
          Welcome to Your Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Get a quick overview of your financial status
        </Typography>
      </Box>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            mb={4}
            p={1}
            bgcolor={isLightMode ? "#f0f0f0" : theme.palette.grey[800]}
            borderRadius={1}
            boxShadow={1}
          >
            <Tooltip title="Total Expenses" arrow>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontWeight: 500 }}
              >
                Total Expenses:{" "}
                <span style={{ color: theme.palette.error.main }}>
                  ${totalExpenses.toFixed(2)}
                </span>
              </Typography>
            </Tooltip>
            <Tooltip title="Total Budget" arrow>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontWeight: 500 }}
              >
                Total Budget:{" "}
                <span style={{ color: theme.palette.success.main }}>
                  ${totalBudget.toFixed(2)}
                </span>
              </Typography>
            </Tooltip>
            <Tooltip title="Remaining Budget" arrow>
              <Typography
                variant="h6"
                sx={{ textAlign: "center", fontWeight: 500 }}
              >
                Remaining Budget:{" "}
                <span style={{ color: theme.palette.info.main }}>
                  ${remainingBudget.toFixed(2)}
                </span>
              </Typography>
            </Tooltip>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box {...boxStyles(isLightMode, theme)}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <MoneyOff fontSize="small" /> Expense Summary
                </Typography>
                <ExpenseSummaryCard expenses={expenses} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box {...boxStyles(isLightMode, theme)}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <Receipt fontSize="small" /> Recent Transactions
                </Typography>
                <RecentTransactions transactions={expenses} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box {...boxStyles(isLightMode, theme)}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <Assessment fontSize="small" /> Budget Status
                </Typography>
                <BudgetStatus budgets={budgets} expenses={expenses} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box {...boxStyles(isLightMode, theme)}>
                <Typography variant="h6" color="primary" gutterBottom>
                  <PieChart fontSize="small" /> Goal Progress
                </Typography>
                <GoalProgressChart
                  goalsAchieved={achievedGoals.length}
                  totalGoals={goals.length}
                />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
