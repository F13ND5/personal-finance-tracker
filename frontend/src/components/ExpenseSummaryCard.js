// src/components/ExpenseSummaryCard.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const ExpenseSummaryCard = ({ expenses }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Expense Summary
        </Typography>
        {expenses.length === 0 ? (
          <Typography>No expenses recorded.</Typography>
        ) : (
          expenses.map((expense) => (
            <Typography key={expense.id}>
              {expense.category}: ${parseFloat(expense.amount).toFixed(2)}
            </Typography>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseSummaryCard;