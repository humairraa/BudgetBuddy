import React from "react";
import { Paper, Grid2 as Grid, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const BudgetFunction = ({ title, icon, handleClick }) => {
  return (
    <Paper
      elevation={3}
      sx={{ minHeight: "80px", width: "100%", borderRadius: "20px", cursor: "pointer" }}
      onClick={() => handleClick(true)}
    >
      <Grid container spacing={0} sx={{ height: "100%" }}>
        <Grid size={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", paddingLeft: 5 }}>
          {icon}
        </Grid>
        <Grid size={8} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="subtitle1">{title}</Typography>
        </Grid>
        <Grid size={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ArrowForwardIosIcon />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BudgetFunction;
