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

const Dashboard = ({ userId }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!userId) return; // Ensure userId is available
    setLoading(true);

    try {
      const [fetchedExpenses, fetchedBudgets, fetchedGoals, fetchedAchievedGoals] = await Promise.all(
        [getExpenses(userId), getBudgets(userId), getGoals(userId), getAchievedGoals(userId)]
      );

      setExpenses(fetchedExpenses);
      setBudgets(fetchedBudgets);
      setGoals(fetchedGoals);
      setAchievedGoals(fetchedAchievedGoals); // Set achieved goals data
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

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
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginBottom={4}
        style={{ textAlign: "center" }}
      >
        <Typography variant="h3" gutterBottom>
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
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Tooltip title="Total Expenses" arrow>
              <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
                Total Expenses: ${totalExpenses.toFixed(2)}
              </Typography>
            </Tooltip>
            <Tooltip title="Total Budget" arrow>
              <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
                Total Budget: ${totalBudget.toFixed(2)}
              </Typography>
            </Tooltip>
            <Tooltip title="Remaining Budget" arrow>
              <Typography variant="h6" style={{ flex: 1, textAlign: "center" }}>
                Remaining Budget: ${remainingBudget.toFixed(2)}
              </Typography>
            </Tooltip>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                borderRadius={2}
                boxShadow={3}
                p={3}
                bgcolor="#fafafa"
                transition="0.3s"
                _hover={{ boxShadow: 6 }}
                style={{ cursor: "pointer" }}
              >
                <Typography variant="h6" gutterBottom>
                  <MoneyOff fontSize="small" /> Expense Summary
                </Typography>
                <ExpenseSummaryCard expenses={expenses} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                borderRadius={2}
                boxShadow={3}
                p={3}
                bgcolor="#e3f2fd"
                transition="0.3s"
                _hover={{ boxShadow: 6 }}
                style={{ cursor: "pointer" }}
              >
                <Typography variant="h6" gutterBottom>
                  <PieChart fontSize="small" /> Goal Progress
                </Typography>
                <GoalProgressChart goalsAchieved={achievedGoals.length} totalGoals={goals.length} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                borderRadius={2}
                boxShadow={3}
                p={3}
                bgcolor="#fff3e0"
                transition="0.3s"
                _hover={{ boxShadow: 6 }}
                style={{ cursor: "pointer" }}
              >
                <Typography variant="h6" gutterBottom>
                  <Assessment fontSize="small" /> Budget Status
                </Typography>
                <BudgetStatus budgets={budgets} expenses={expenses} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                borderRadius={2}
                boxShadow={3}
                p={3}
                bgcolor="#ede7f6"
                transition="0.3s"
                _hover={{ boxShadow: 6 }}
                style={{ cursor: "pointer" }}
              >
                <Typography variant="h6" gutterBottom>
                  <Receipt fontSize="small" /> Recent Transactions
                </Typography>
                <RecentTransactions transactions={expenses} />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
