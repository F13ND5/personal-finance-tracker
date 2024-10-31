// src/components/GoalProgressChart.js
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";

const GoalProgressChart = ({ goalsAchieved, totalGoals }) => {
  // Calculate progress as a percentage, default to 0 if there are no total goals
  const progress = totalGoals > 0 ? (goalsAchieved / totalGoals) * 100 : 0;

  return (
    <Card style={{ padding: "10px", margin: "10px 0" }}>
      <CardContent>
        <Typography variant="h6">Goal Progress</Typography>
        <Box display="flex" alignItems="center" marginTop={1}>
          <Box width="100%" mr={1}>
            <LinearProgress
              variant="determinate"
              value={progress}
              style={{ height: 10, borderRadius: 5 }} // Make progress bar more visible
            />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" color="textSecondary">
          {goalsAchieved}/{totalGoals} Goals Achieved
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GoalProgressChart;
