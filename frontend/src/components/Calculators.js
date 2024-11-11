import React, { useState } from "react";
import {
  TextField,
  Slider,
  Button,
  Typography,
  Card,
  Paper,
  LinearProgress,
} from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import HomeIcon from "@mui/icons-material/Home";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TheatersIcon from "@mui/icons-material/Theaters";
import Chart from "chart.js/auto";

const Calculators = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState({
    Rent: 0,
    Food: 0,
    Transport: 0,
    Entertainment: 0,
  });
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [calculatedData, setCalculatedData] = useState(null);
  const expenseCategories = ["Rent", "Food", "Transport", "Entertainment"];

  const handleSliderChange = (category) => (event, newValue) => {
    setExpenses((prev) => ({ ...prev, [category]: newValue }));
  };

  const handleSavingsGoalChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setSavingsGoal(value);
  };

  const calculateBudget = () => {
    const totalExpenses = Object.values(expenses).reduce(
      (sum, value) => sum + value,
      0
    );
    const savings = income - totalExpenses;

    // Ensure that savingsGoal and income are defined and valid before proceeding
    if (income <= 0 || savingsGoal <= 0) {
      alert("Please ensure income and savings goal are set to valid numbers.");
      return;
    }

    const data = {
      labels: expenseCategories,
      datasets: [
        {
          label: "Expense Distribution",
          data: expenseCategories.map((category) => expenses[category]),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        },
      ],
    };

    setCalculatedData({ savings, totalExpenses, data });
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Budgeting Calculators
      </Typography>

      {/* Income Section */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" color="primary">
          <AttachMoneyIcon /> Monthly Income
        </Typography>
        <TextField
          label="Enter Income"
          type="number"
          value={income}
          onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Card>

      {/* Expense Section */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" color="secondary">
          Expense Categories
        </Typography>
        {expenseCategories.map((category) => (
          <div key={category} style={{ marginBottom: "10px" }}>
            <Typography variant="subtitle1">
              {category === "Rent" && <HomeIcon />}
              {category === "Food" && <FoodBankIcon />}
              {category === "Transport" && <DirectionsCarIcon />}
              {category === "Entertainment" && <TheatersIcon />}
              {` ${category}`}
            </Typography>
            <Slider
              value={expenses[category]}
              onChange={handleSliderChange(category)}
              min={0}
              max={income}
              step={10}
              valueLabelDisplay="auto"
              style={{ color: "#36A2EB" }}
            />
          </div>
        ))}
      </Card>

      {/* Savings Goal Section */}
      <Card style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h6" color="success">
          <SavingsIcon /> Savings Goal
        </Typography>
        <TextField
          label="Enter Savings Goal"
          type="number"
          value={savingsGoal}
          onChange={handleSavingsGoalChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Card>

      {/* Calculate Button */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={calculateBudget}
      >
        Calculate Budget
      </Button>

      {/* Results Section */}
      {calculatedData && (
        <Paper style={{ padding: "20px", marginTop: "20px" }}>
          <Typography variant="h5">Results</Typography>
          <Typography variant="body1">
            Total Expenses: ${calculatedData.totalExpenses}
          </Typography>
          <Typography
            variant="body1"
            color={
              calculatedData.savings >= savingsGoal
                ? "success.main"
                : "error.main"
            }
          >
            Savings: ${calculatedData.savings}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(calculatedData.savings / savingsGoal) * 100}
            style={{ marginTop: "10px", height: "10px", borderRadius: "5px" }}
          />
          <Typography variant="body2" align="center">
            Savings Progress:{" "}
            {((calculatedData.savings / savingsGoal) * 100).toFixed(1)}%
          </Typography>

          {/* Expense Distribution Chart */}
          <div style={{ width: "100%", marginTop: "20px" }}>
            <Doughnut
              data={calculatedData.data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Paper>
      )}
    </div>
  );
};

export default Calculators;
