// src/components/GoalProgressChart.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const GoalProgressChart = ({ goalsAchieved, totalGoals }) => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  // Calculate progress as a percentage, default to 0 if there are no total goals
  const progress = totalGoals > 0 ? (goalsAchieved / totalGoals) * 100 : 0;

  return (
    <Card
      sx={{
        padding: "10px",
        margin: "10px 0",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: 3,
        borderRadius: 2,
        maxHeight: 350,
        overflowY: "auto",
      }}
    >
      <CardContent>
        <Typography variant="h6" color="primary" gutterBottom>
          Goal Progress
        </Typography>
        <Box display="flex" alignItems="center" marginTop={1}>
          <Box width="100%" mr={1}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 12,
                borderRadius: 5,
                background: isLightMode ? theme.palette.grey[200] : theme.palette.grey[800],
                "& .MuiLinearProgress-bar": {
                  bgcolor: theme.palette.success.main,
                },
              }}
            />
          </Box>
          <Box minWidth={50}>
            <Typography variant="body2" fontWeight="bold">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary" align="center">
          {goalsAchieved}/{totalGoals} Goals Achieved
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GoalProgressChart;
