import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const SortButton = ({ toggleSortOrder, sortOrder, theme, isLightMode }) => {
  return (
    <Tooltip title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}>
      <IconButton
        onClick={toggleSortOrder}
        color="primary"
        aria-label={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
        style={{
          borderRadius: "8px",
          padding: "10px", // Slightly larger padding for a better button feel
          transition: "transform 0.3s ease-in-out, background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          backgroundColor: isLightMode
            ? "#e3f2fd"
            : theme.palette.background.default,
          boxShadow: isLightMode
            ? "0px 4px 10px rgba(33, 150, 243, 0.3)"
            : `0px 4px 10px ${theme.palette.primary.main}40`,
        }}
        sx={{
          "&:hover": {
            backgroundColor: isLightMode
              ? "#bbdefb"
              : theme.palette.primary.light,
            transform: "scale(1.1)",
            boxShadow: isLightMode
              ? "0px 6px 15px rgba(33, 150, 243, 0.5)"
              : `0px 6px 15px ${theme.palette.primary.main}80`,
          },
        }}
      >
        {sortOrder === "asc" ? (
          <ArrowDownwardIcon fontSize="medium" />
        ) : (
          <ArrowUpwardIcon fontSize="medium" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default SortButton;
