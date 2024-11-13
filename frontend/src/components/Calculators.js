import React, { useState } from "react";
import {
  TextField,
  Slider,
  Button,
  Typography,
  Paper,
  LinearProgress,
  Dialog,
  Fade,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Doughnut } from "react-chartjs-2";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SavingsIcon from "@mui/icons-material/Savings";
import HomeIcon from "@mui/icons-material/Home";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TheatersIcon from "@mui/icons-material/Theaters";
import CloseIcon from "@mui/icons-material/Close";

const Calculators = () => {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
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
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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
    handleAddDialogOpen();
  };

  const handleAddDialogOpen = () => setAddDialogOpen(true);
  const handleAddDialogClose = () => setAddDialogOpen(false);

  return (
    <>
      <Paper
        style={{
          padding: "40px",
          backgroundColor: isLightMode ? "#fafafa" : "#2c2c2c",
          borderRadius: "16px",
          color: isLightMode ? "#333" : "#e0e0e0",
          transition: "all 0.3s ease",
          boxShadow: isLightMode
            ? "0px 4px 12px rgba(0, 0, 0, 0.1)"
            : "0px 4px 16px rgba(0, 0, 0, 0.4)",
        }}
        elevation={isLightMode ? 3 : 6}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ fontWeight: "600" }}
        >
          Budgeting Calculators
        </Typography>

        {/* Income Section */}
        <Paper
          style={{
            padding: "24px",
            marginBottom: "24px",
            backgroundColor: isLightMode ? "#fff" : "#424242",
            borderRadius: "12px",
          }}
          elevation={isLightMode ? 2 : 4}
        >
          <Typography
            variant="h6"
            color="primary"
            display="flex"
            alignItems="center"
          >
            <AttachMoneyIcon style={{ marginRight: "8px" }} /> Monthly Income
          </Typography>
          <TextField
            label="Enter Income"
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              style: { color: isLightMode ? "#333" : "#e0e0e0" },
            }}
          />
        </Paper>

        {/* Expense Section */}
        <Paper
          style={{
            padding: "24px",
            marginBottom: "24px",
            backgroundColor: isLightMode ? "#fff" : "#424242",
            borderRadius: "12px",
          }}
          elevation={isLightMode ? 2 : 4}
        >
          <Typography
            variant="h6"
            color="secondary"
            display="flex"
            alignItems="center"
          >
            Expense Categories
          </Typography>
          {expenseCategories.map((category) => (
            <div key={category} style={{ marginBottom: "16px" }}>
              <Typography
                variant="subtitle1"
                style={{ display: "flex", alignItems: "center" }}
              >
                {category === "Rent" && (
                  <HomeIcon style={{ marginRight: "8px" }} />
                )}
                {category === "Food" && (
                  <FoodBankIcon style={{ marginRight: "8px" }} />
                )}
                {category === "Transport" && (
                  <DirectionsCarIcon style={{ marginRight: "8px" }} />
                )}
                {category === "Entertainment" && (
                  <TheatersIcon style={{ marginRight: "8px" }} />
                )}
                {category}
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
        </Paper>

        {/* Savings Goal Section */}
        <Paper
          style={{
            padding: "24px",
            marginBottom: "24px",
            backgroundColor: isLightMode ? "#fff" : "#424242",
            borderRadius: "12px",
          }}
          elevation={isLightMode ? 2 : 4}
        >
          <Typography
            variant="h6"
            color="success"
            display="flex"
            alignItems="center"
          >
            <SavingsIcon style={{ marginRight: "8px" }} /> Savings Goal
          </Typography>
          <TextField
            label="Enter Savings Goal"
            type="number"
            value={savingsGoal}
            onChange={handleSavingsGoalChange}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
              style: { color: isLightMode ? "#333" : "#e0e0e0" },
            }}
          />
        </Paper>

        {/* Calculate Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={calculateBudget}
          style={{
            padding: "12px",
            fontWeight: "600",
            backgroundColor: "#00796B",
            color: "#FFF",
            transition: "all 0.3s ease",
          }}
          elevation={isLightMode ? 2 : 4}
        >
          Calculate Budget
        </Button>
      </Paper>

      {/* Results Section */}
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        PaperProps={{
          style: {
            borderRadius: "16px",
            boxShadow: isLightMode
              ? "0px 8px 30px rgba(0, 0, 0, 0.2)"
              : "0px 8px 30px rgba(0, 0, 0, 0.5)",
            backgroundColor: isLightMode ? "#fff" : "#333",
            padding: "30px",
            position: "relative",
          },
        }}
        fullWidth
        maxWidth="sm"
      >
        {/* Close Button */}
        <Button
          onClick={handleAddDialogClose}
          style={{
            borderRadius: "16px",
            position: "absolute",
            top: "30px",
            right: "30px",
            minWidth: "auto",
            padding: "6px",
            color: isLightMode ? "#333" : "#e0e0e0",
          }}
        >
          <CloseIcon />
        </Button>

        <Fade in={addDialogOpen}>
          {calculatedData && (
            <Paper
              style={{
                padding: "20px",
                backgroundColor: isLightMode ? "#f9f9f9" : "#333",
                borderRadius: "12px",
                color: isLightMode ? "#424242" : "#E0E0E0",
                transition: "all 0.3s ease",
              }}
              elevation={isLightMode ? 2 : 5}
            >
              <Typography variant="h5" align="center" gutterBottom>
                Results
              </Typography>
              <Typography variant="body1" style={{ marginBottom: "10px" }}>
                Total Expenses: ${calculatedData.totalExpenses.toFixed(2)}
              </Typography>
              <Typography
                variant="body1"
                color={
                  calculatedData.savings >= savingsGoal
                    ? "success.main"
                    : "error.main"
                }
                style={{ fontWeight: "600" }}
              >
                Savings: ${calculatedData.savings.toFixed(2)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(calculatedData.savings / savingsGoal) * 100}
                style={{
                  marginTop: "10px",
                  height: "10px",
                  borderRadius: "5px",
                }}
              />
              <Typography
                variant="body2"
                align="center"
                style={{ marginTop: "8px" }}
              >
                Savings Progress:{" "}
                {((calculatedData.savings / savingsGoal) * 100).toFixed(1)}%
              </Typography>

              {/* Expense Distribution Chart */}
              <div
                style={{ width: "100%", marginTop: "20px", height: "200px" }}
              >
                <Doughnut
                  data={calculatedData.data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </Paper>
          )}
        </Fade>
      </Dialog>
    </>
  );
};

export default Calculators;
