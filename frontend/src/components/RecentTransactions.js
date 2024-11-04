// src/components/RecentTransactions.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const RecentTransactions = ({ transactions }) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        maxHeight: 350,
        overflowY: "auto",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          Recent Transactions
        </Typography>
        <List>
          {transactions.map((transaction, index) => {
            const transactionDate = transaction.date?.seconds
              ? new Date(transaction.date.seconds * 1000) // Firestore Timestamp
              : new Date(transaction.date); // Assume ISO string if no `seconds`
            const formattedDate = isNaN(transactionDate)
              ? "Invalid Date"
              : transactionDate.toLocaleDateString();

            return (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: theme.palette.text.primary,
                    },
                    "& .MuiListItemText-secondary": {
                      color: theme.palette.text.secondary,
                    },
                  }}
                >
                  <ListItemIcon>
                    {transaction.amount > 0 ? (
                      <ArrowUpward sx={{ color: theme.palette.success.main }} />
                    ) : (
                      <ArrowDownward sx={{ color: theme.palette.error.main }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={transaction.description}
                    secondary={`$${Math.abs(
                      transaction.amount
                    )} - ${formattedDate}`}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItem>
                {index < transactions.length - 1 && (
                  <Divider sx={{ bgcolor: theme.palette.divider, my: 1 }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
