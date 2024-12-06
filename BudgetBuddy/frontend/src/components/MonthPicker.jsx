import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, IconButton, Grid2 as Grid } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const MonthPicker = ({ budgetID, startDate, handleSubmit }) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [monthsArray, setMonthsArray] = useState([]);
  const [yearsArray, setYearsArray] = useState([]);

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  useEffect(() => {
    function getDateArray(startDate) {
      // const monthsArray = [];
      const yearsArray = [];
      const start = new Date(startDate);
      const current = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const yearDifference = current.getFullYear() - start.getFullYear();
      const currMonth = new Date().getMonth() + 1;
      const currYear = current.getFullYear().toString();

      // If more than a year has passed
      if (yearDifference > 1 || (yearDifference === 1 && current.getMonth() >= start.getMonth())) {
        // Loop through each year from start to current
        for (let year = start.getFullYear(); year <= current.getFullYear(); year++) {
          yearsArray.push(year.toString());
        }
        return { monthsArray: months, yearsArray, currMonth, currYear };
      } else {
        // Less than or equal to a year, so return months in the target year (start year or current year)
        const targetYear = start.getFullYear();

        // for (let month = start.getMonth(); month <= current.getMonth(); month++) {
        //   const monthName = new Date(targetYear, month).toLocaleString("default", { month: "short" });
        //   monthsArray.push(monthName);
        // }

        return {
          monthsArray: months,
          yearsArray: [targetYear],
          currMonth,
          currYear,
        };
      }
    }

    const { monthsArray, yearsArray, currMonth, currYear } = getDateArray(startDate);
    console.log(monthsArray, yearsArray, currMonth, currYear);
    setMonthsArray(monthsArray);
    setYearsArray(yearsArray);
    setMonth(currMonth);
    setYear(currYear);
  }, [startDate]);

  return (
    <Grid container spacing={0} sx={{ height: "100%", width: 250 }}>
      <Grid size={5} sx={{}}>
        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
          <InputLabel id="month-select-label">Month</InputLabel>
          <Select
            labelId="month-select-label"
            id="month-select"
            value={month}
            label="Month"
            onChange={handleMonthChange}
          >
            {monthsArray.map((m, i) => (
              <MenuItem key={i} value={i + 1}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={5} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select labelId="year-select-label" id="year-select" value={year} label="Year" onChange={handleYearChange}>
            {yearsArray.map((y, i) => (
              <MenuItem key={i} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconButton onClick={() => handleSubmit(budgetID, month, year)}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default MonthPicker;
