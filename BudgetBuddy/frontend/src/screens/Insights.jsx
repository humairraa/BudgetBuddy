import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, Grid2 as Grid } from "@mui/material";
import MonthPicker from "../components/MonthPicker";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import { useTheme } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";

const spendingHabits = {
  Groceries: 150,
  Entertainment: 50,
  "Gas/Automobile": 200,
  "Recurring Payments": 50,
};

const spendingDataset = [
  {
    spending: 59,
    expected: 57,
    month: "Mon",
  },
  {
    spending: 50,
    expected: 52,
    month: "Tues",
  },
  {
    spending: 47,
    expected: 53,
    month: "Wed",
  },
  {
    spending: 54,
    expected: 56,
    month: "Thurs",
  },
  {
    spending: 57,
    expected: 69,
    month: "Fri",
  },
  {
    spending: 60,
    expected: 63,
    month: "Sat",
  },
  {
    spending: 59,
    expected: 60,
    month: "Sun",
  },
];

const chartSetting = {
  yAxis: [],
  height: 400,
};

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2} sx={{ fontSize: "45px", fontWeight: "600" }}>
      {children}
    </StyledText>
  );
}

const Insights = ({ budget, fetchAllTransactions }) => {
  console.log(fetchAllTransactions);
  const [total, setTotal] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const spendingTotal = Object.values(spendingDataset).reduce((a, b) => a + b["spending"], 0);
    setTotal(spendingTotal);
  }, []);

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid size={2}></Grid>
        <Grid size={8}>
          <Paper
            sx={{ borderRadius: "30px", padding: "2rem", marginTop: "0.5rem", marginBottom: "2rem" }}
            elevation={2}
            square={false}
          >
            <Typography
              variant="h5"
              sx={{
                position: "relative",
                top: "0rem",
                alignSelf: "flex-start",
                fontWeight: "600",
                textAlign: "left",
                marginLeft: "0.,5rem",
              }}
            >
              Transactions
              <Grid sx={{ position: "relative", top: "-2.5rem", left: "12rem", width: "50%" }}>
                <MonthPicker startDate={budget.creationDate} handleSubmit={() => alert("HELLO")} />
              </Grid>
            </Typography>
            <LineChart
              leftAxis={{
                disableLine: true,
                disableTicks: true,
              }}
              bottomAxis={{
                disableTicks: true,
              }}
              sx={{ backgroundColor: "white", borderRadius: "50px" }}
              height={300}
              series={[
                { data: [2400, 1398, 9800, 3908, 4800, 3800, 4300], area: true, color: "#dad4f9", label: "Expenses" },
                { data: [4000, 3000, 2000, 6780, 7890, 2390, 3490], color: "#8c75ff", label: "Income" },
              ]}
              xAxis={[{ scaleType: "point", data: ["January", "February", "March", "April", "May", "June", "July"] }]}
              slotProps={{
                legend: {
                  direction: "row",
                  position: { vertical: "top", horizontal: "right" },
                  itemGap: 62,
                },
              }}
            />
          </Paper>
        </Grid>
        <Grid size={2}></Grid>
      </Grid>
      <Grid container spacing={1} sx={{ marginBottom: "25px" }}>
        <Grid size={2}></Grid>
        <Grid size={4}>
          <Paper sx={{ borderRadius: "30px" }} elevation={2} square={false}>
            <Typography
              variant="h5"
              sx={{
                position: "relative",
                top: "1rem",
                alignSelf: "flex-start",
                fontWeight: "600",
                textAlign: "left",
                marginLeft: "3rem",
              }}
            >
              Daily Spending
            </Typography>
            <BarChart
              sx={{ marginRight: "1.5em" }}
              leftAxis={null}
              bottomAxis={{
                disableLine: true,
                disableTicks: true,
              }}
              height={400}
              borderRadius={20}
              dataset={spendingDataset}
              xAxis={[{ scaleType: "band", data: spendingDataset.map((i) => i.month) }]}
              series={[
                { data: spendingDataset.map((item) => item.spending), color: "#646cffaa" },
                { data: spendingDataset.map((item) => item.expected), color: "#535bf2" },
              ]}
              {...chartSetting}
            />
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper sx={{ borderRadius: "30px" }} elevation={1} square={false}>
            <Typography
              variant="h5"
              sx={{
                position: "relative",
                top: "1rem",
                alignSelf: "flex-start",
                fontWeight: "600",
                textAlign: "left",
                marginLeft: "3rem",
              }}
            >
              Spending Habits
            </Typography>
            <PieChart
              sx={{ marginLeft: 10 }}
              colors={["#FE6C6C", "#FEBD38"]}
              series={[
                {
                  startAngle: 0,
                  endAngle: 360,
                  innerRadius: 80,
                  outerRadius: 140,
                  paddingAngle: 3,
                  cornerRadius: 10,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                  data: [
                    { value: spendingHabits.Groceries, label: "Groceries", color: "#FFD26A" },
                    { value: spendingHabits.Entertainment, label: "Entertainment", color: "#73CFFC" },
                    { value: spendingHabits["Gas/Automobile"], label: "Gas/Automobile", color: "#FE63BF" },
                    { value: spendingHabits["Recurring Payments"], label: "Recurring Payments", color: "#FD5357" },
                  ],
                },
              ]}
              height={400}
              slotProps={{
                legend: { hidden: true },
              }}
            >
              <PieCenterLabel>${total}</PieCenterLabel>
            </PieChart>
          </Paper>
          <Grid size={2}></Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Insights;
