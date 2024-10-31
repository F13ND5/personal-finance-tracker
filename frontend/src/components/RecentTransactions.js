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

const RecentTransactions = ({ transactions }) => (
  <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom align="center" color="primary">
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
              <ListItem>
                <ListItemIcon>
                  {transaction.amount > 0 ? (
                    <ArrowUpward color="success" />
                  ) : (
                    <ArrowDownward color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={transaction.description}
                  secondary={`$${Math.abs(
                    transaction.amount
                  )} - ${formattedDate}`}
                />
              </ListItem>
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </CardContent>
  </Card>
);

export default RecentTransactions;
