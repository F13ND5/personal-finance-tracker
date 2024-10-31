// src/components/BudgetStatus.js
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { green, red } from "@mui/material/colors";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const BudgetStatus = ({ budgets, expenses }) => {
  const totalBudget = budgets.reduce((total, budget) => total + (parseFloat(budget.amount) || 0), 0);
  const totalSpent = expenses.reduce((total, expense) => total + (parseFloat(expense.amount) || 0), 0);
  const remainingBudget = totalBudget - totalSpent;

  const data = {
    labels: ["Spent", "Remaining"],
    datasets: [
      {
        data: [totalSpent, remainingBudget],
        backgroundColor: [red[500], green[500]], // More vibrant colors
        hoverBackgroundColor: [red[700], green[700]],
      },
    ],
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Budget Status
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="body1" color="textSecondary">
            Total Budget: ${totalBudget.toFixed(2)}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Total Spent: ${totalSpent.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Pie data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body1" color="textSecondary">
            Remaining Budget: ${remainingBudget.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {remainingBudget < 0 ? "Overspent!" : "On Track"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetStatus;