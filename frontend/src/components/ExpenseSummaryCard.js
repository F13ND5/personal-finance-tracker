// src/components/ExpenseSummaryCard.js
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const ExpenseSummaryCard = ({ expenses }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

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
        <Typography variant="h5" color="primary" gutterBottom>
          Expense Summary
        </Typography>
        {expenses.length === 0 ? (
          <Typography>No expenses recorded.</Typography>
        ) : (
          expenses.map((expense, index) => (
            <Box
              key={expense.id}
              sx={{
                bgcolor:
                  index % 2 === 0
                    ? isLightMode
                      ? theme.palette.grey[200]
                      : theme.palette.grey[800]
                    : isLightMode
                      ? theme.palette.grey[300]
                      : theme.palette.grey[900],
                borderRadius: 1,
                px: 2,
                py: 1,
                mt: 1,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {expense.category}:{" "}
                <span style={{ color: theme.palette.text.primary }}>
                  ${parseFloat(expense.amount).toFixed(2)}
                </span>
              </Typography>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseSummaryCard;
