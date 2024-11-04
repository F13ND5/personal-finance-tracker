// src/components/BudgetStatus.js
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const BudgetStatus = ({ budgets, expenses }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const totalBudget = budgets.reduce(
    (total, budget) => total + (parseFloat(budget.amount) || 0),
    0
  );
  const totalSpent = expenses.reduce(
    (total, expense) => total + (parseFloat(expense.amount) || 0),
    0
  );
  const remainingBudget = totalBudget - totalSpent;

  const data = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalSpent, remainingBudget],
        backgroundColor: [
          isLightMode ? theme.palette.error.main : theme.palette.error.light,
          isLightMode
            ? theme.palette.success.main
            : theme.palette.success.light,
        ],
        hoverBackgroundColor: [
          isLightMode ? theme.palette.error.light : theme.palette.error.dark,
          isLightMode
            ? theme.palette.success.light
            : theme.palette.success.dark,
        ],
      },
    ],
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxHeight: 350,
        overflowY: "auto",
      }}
    >
      <CardContent>
        <Typography variant="h5" color="primary" gutterBottom align="center" >
          Budget Status
        </Typography>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body1" color="textSecondary">
            Total Budget: <span style={{ color: theme.palette.success.main }}>${totalBudget.toFixed(2)}</span>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Total Spent: <span style={{ color: theme.palette.error.main }}>${totalSpent.toFixed(2)}</span>
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center" mb={2}>
          <Pie
            data={data}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body1" color="textSecondary">
            Remaining Budget: <span style={{ color: theme.palette.info.main }}>${remainingBudget.toFixed(2)}</span>
          </Typography>
          <Typography
            variant="body2"
            color={
              remainingBudget < 0
                ? theme.palette.error.main
                : theme.palette.success.main
            }
          >
            {remainingBudget < 0 ? "Overspent!" : "On Track"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetStatus;
