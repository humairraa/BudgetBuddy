import React, { useState } from "react";
import { Typography, Box, Paper, Grid2 as Grid } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import BudgetFunction from "../components/BudgetFunction";
import MonthPicker from "../components/MonthPicker";
import PaidIcon from "@mui/icons-material/Paid";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import PieChartSharpIcon from "@mui/icons-material/PieChartSharp";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import AddTransactionModal from "../components/AddTransactionModal";
import AddGoalModal from "../components/AddGoalModal";
import FinancialReportModal from "../components/FinancialReportModal";
import AddCategoryModal from "../components/AddCategoryModal";
import AddUserModal from "../components/AddUserModal";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Home = ({ budget, goals, categories, users, financialReports, setRefresh }) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getCategoryName = (categoryID, categories) => {
    for (let c of categories) {
      if (c.categoryID === categoryID) {
        return c.name;
      }
    }
  };

  return (
    <Box>
      {/* <Grid container spacing={2}>
        <Grid size={2} sx={{}}></Grid>
        <Grid size={8}>
          <MonthPicker startDate={budget.creationDate} handleSubmit={() => alert("HELLO")} />
        </Grid>
        <Grid size={2} sx={{}}></Grid>
      </Grid> */}

      <Grid container spacing={2} sx={{ marginTop: 5 }}>
        <Grid size={2} sx={{}}></Grid>
        <Grid container size={5} sx={{ height: "325px" }}>
          <Paper elevation={3} sx={{ height: "100%", width: "100%", borderRadius: "20px" }}>
            <Grid container>
              <Grid size={{ xs: 1, lg: 2.5 }} sx={{}}></Grid>
              <Grid size={{ xs: 10, lg: 7 }} sx={{ position: "relative", height: "100%", paddingBottom: 3 }}>
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                  Financial Health Score
                </Typography>

                <PieChart
                  // sx={{ position: "absolute", top: "15%", left: "10%" }}
                  colors={["#7459D9", "#EA4335"]}
                  series={[
                    {
                      startAngle: -90,
                      endAngle: 90,
                      innerRadius: 100,
                      outerRadius: 180,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      cx: "70%",
                      cy: "75%",
                      data: [{ value: budget.financialHealthScore }, { value: 100 - budget.financialHealthScore }],
                    },
                  ]}
                  height={300}
                />
                <Paper
                  elevation={3}
                  sx={{
                    height: 120,
                    width: 120,
                    borderRadius: 50,
                    position: "absolute",
                    top: "50%",
                    left: "37%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h3">{budget.financialHealthScore}</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 1, lg: 2.5 }} sx={{}}></Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          container
          size={3}
          spacing={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            height: "325px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              height: "30%",
              width: "100%",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginLeft: 3 }}>
              <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                Total Balance
              </Typography>

              <Typography variant="h5">
                <AttachMoneyIcon fontSize="small" /> {budget.totalBalance}
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              height: "30%",
              width: "100%",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginLeft: 3 }}>
              <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                Total Income
              </Typography>

              <Typography variant="h5" sx={{ color: "#2BDE73" }}>
                <AttachMoneyIcon fontSize="small" /> {budget.totalIncome}
              </Typography>
            </Box>
          </Paper>
          <Paper
            elevation={3}
            sx={{
              height: "30%",
              width: "100%",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box sx={{ marginLeft: 3 }}>
              <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                Total Expenses
              </Typography>

              <Typography variant="h5" sx={{ color: "#EA4335" }}>
                <AttachMoneyIcon fontSize="small" /> {budget.totalExpenses}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid size={2} sx={{}}></Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: 2, marginBottom: 2 }}>
        <Grid size={2} sx={{}}></Grid>
        <Grid container size={4} sx={{ minHeight: "500px", maxHeight: "550px" }}>
          <BudgetFunction
            title="Add Transaction"
            icon={<PaidIcon sx={{ color: "#7459D9", fontSize: "60px" }} />}
            handleClick={setShowTransactionModal}
          />
          <BudgetFunction
            title="Add Goal"
            icon={<AdsClickIcon sx={{ color: "#7459D9", fontSize: "60px" }} />}
            handleClick={setShowGoalModal}
          />
          <BudgetFunction
            title="Add Custom Category"
            icon={<AddCircleRoundedIcon sx={{ color: "#7459D9", fontSize: "60px" }} />}
            handleClick={setShowCategoryModal}
          />
          <BudgetFunction
            title="Add User"
            icon={<AccountCircleRoundedIcon sx={{ color: "#7459D9", fontSize: "60px" }} />}
            handleClick={setShowUserModal}
          />
          <BudgetFunction
            title="View Financial Report"
            icon={<PieChartSharpIcon sx={{ color: "#7459D9", fontSize: "60px" }} />}
            handleClick={setShowReportModal}
          />
        </Grid>
        <Grid
          container
          size={4}
          spacing={1}
          sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
        >
          <Paper elevation={3} sx={{ height: "100%", minHeight: "300px", width: "100%", borderRadius: "20px" }}>
            <Grid container>
              <Grid size={2} sx={{}}></Grid>
              <Grid size={8} sx={{}}>
                <p>Spending Goals</p>
              </Grid>
              <Grid size={2} sx={{}}></Grid>
            </Grid>

            {goals.map((g, i) => {
              let percentage = Math.round((g.currAmount / g.spendingLimit) * 100);

              // Cap at 100% if currAmount exceeds limit
              if (percentage > 100) percentage = 100;

              return (
                <Grid key={i} container>
                  <Grid size={6} sx={{}}>
                    <PieChart
                      colors={["#7459D9", "#F2F2F7"]}
                      series={[
                        {
                          data: [
                            { id: 1, value: percentage },
                            { id: 2, value: 100 - percentage },
                          ],
                          innerRadius: 40,
                          outerRadius: 60,
                          paddingAngle: 5,
                          cornerRadius: 5,
                          startAngle: -90,
                          endAngle: 360,
                          cx: 100,
                          cy: 100,
                        },
                      ]}
                      height={200}
                    />
                  </Grid>
                  <Grid
                    size={4}
                    sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                  >
                    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                      {getCategoryName(g.categoryID, categories)}
                    </Typography>

                    <Typography variant="h6">
                      <AttachMoneyIcon fontSize="small" /> {g.currAmount}/{g.spendingLimit}
                    </Typography>
                    <Typography variant="body2">Start: {g.startDate.split("T")[0]}</Typography>
                    <Typography variant="body2">End: {g.endDate.split("T")[0]}</Typography>
                  </Grid>
                  <Grid size={2}></Grid>
                </Grid>
              );
            })}
          </Paper>
        </Grid>
        <Grid size={2} sx={{}}></Grid>
      </Grid>
      <AddTransactionModal
        budgetID={budget.budgetID}
        categories={categories}
        users={users}
        currUser={users.find((user) => user.current)}
        showModal={showTransactionModal}
        setShowModal={setShowTransactionModal}
        setRefresh={setRefresh}
      />
      <AddGoalModal
        budgetID={budget.budgetID}
        categories={categories}
        showModal={showGoalModal}
        setShowModal={setShowGoalModal}
        setRefresh={setRefresh}
      />
      <AddCategoryModal
        budgetID={budget.budgetID}
        showModal={showCategoryModal}
        setShowModal={setShowCategoryModal}
        setRefresh={setRefresh}
      />
      <AddUserModal
        budgetID={budget.budgetID}
        users={users}
        showModal={showUserModal}
        setShowModal={setShowUserModal}
        setRefresh={setRefresh}
      />
      <FinancialReportModal
        budgetID={budget.budgetID}
        categories={categories}
        financialReports={financialReports}
        showModal={showReportModal}
        setShowModal={setShowReportModal}
        setRefresh={setRefresh}
      />
    </Box>
  );
};

export default Home;
