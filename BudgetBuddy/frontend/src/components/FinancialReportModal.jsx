import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  IconButton,
  Avatar,
  Grid2 as Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import customAxiosInstance from "../utils/customAxiosInstance";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FinancialReportModal = ({ budgetID, categories, financialReports, showModal, setShowModal, setRefresh }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showReport, setShowReport] = useState(null);
  const [financialReport, setFinancialReport] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!showModal) {
      setError(null);
      setSuccess(null);
    }
  }, [showModal]);

  const handleSubmit = async () => {
    try {
      if (!startDate || !endDate) {
        setError("Missing information. Please fill all fields");
        return;
      }

      if (endDate <= startDate) {
        setError("End Date must be after Start Date");
        return;
      }
      let payload = {
        generatedDate: new Date().toISOString().split("T")[0],
        reportPeriodStartDate: startDate.toISOString().split("T")[0],
        reportPeriodEndDate: endDate.toISOString().split("T")[0],
      };
      const res = await customAxiosInstance.post(`/budget/${budgetID}/financialReport`, payload);
      console.log("GENERATED FINANCIAL REPORT", res.data);
      setFinancialReport(res.data);
      setError(null);
      setRefresh(true);
      setSuccess("Successfully generated Financial Report");
      setShowReport(true);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setError("Failed to generate Financial Report");
    }
  };

  const getFinancialReport = async (reportID) => {
    try {
      const res = await customAxiosInstance.get(`/budget/${budgetID}/financialReport/${reportID}`);
      console.log("FINANCIAL REPORT", res.data);
      setShowReport(true);
      setFinancialReport(res.data);
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
    }
  };

  const getCategory = (categoryID, categories) => {
    for (let c of categories) {
      if (c.categoryID === parseInt(categoryID)) {
        return c;
      }
    }
  };

  const sortSpendingCategories = (obj) => {
    const sortedEntries = Object.entries(obj)
      .sort(([, valueA], [, valueB]) => valueB - valueA)
      .map(([key]) => key);
    return sortedEntries;
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {`${Math.ceil(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Modal
      open={showModal}
      sx={{ overflow: "scroll" }}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {showReport ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%", // Make it responsive
            maxWidth: 700, // Limit maximum width
            maxHeight: "90vh", // Prevent modal from exceeding the viewport height
            background: "transparent",
            outline: 0,
            marginTop: 5,
          }}
        >
          <Grid container spacing={0} sx={{ minHeight: "800px" }}>
            <Grid size={1}></Grid>
            <Grid size={10} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Paper
                elevation={3}
                style={{ padding: 20, paddingTop: 10 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "flex-end",
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                <Grid
                  container
                  spacing={0}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid size={6}>
                    <Typography variant="h5" gutterBottom>
                      Expense
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Report
                    </Typography>
                  </Grid>
                  <Grid size={3}></Grid>

                  <Grid size={3}>
                    <Typography variant="h5" sx={{ color: "#EA4335" }}>
                      <AttachMoneyIcon fontSize="small" /> {financialReport.totalExpenses}
                    </Typography>
                    <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
                      Total Expenses
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={0}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid size={12}>
                    <Paper
                      elevation={3}
                      // style={{ padding: 20, paddingTop: 10 }}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRadius: 8,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ marginTop: 2, marginLeft: 2, fontWeight: "bold" }}>
                        Top Categories
                      </Typography>
                      <List>
                        {financialReport.spendingPerCategory &&
                          sortSpendingCategories(financialReport.spendingPerCategory).map((categoryID, idx) => {
                            let category = getCategory(categoryID, categories);

                            let progress =
                              (financialReport.spendingPerCategory[categoryID] / financialReport.totalExpenses) * 100;
                            return (
                              <ListItem key={idx}>
                                <ListItemAvatar>
                                  {category ? (
                                    <Avatar sx={{ bgcolor: category.colour }}>
                                      {category.icon ? category.icon : category.name[0]}
                                    </Avatar>
                                  ) : (
                                    <Avatar></Avatar>
                                  )}
                                </ListItemAvatar>
                                <ListItemText secondary={category && category.name}>
                                  <LinearProgressWithLabel value={progress} />
                                </ListItemText>

                                {/* <ListItemText primary={c.amount} sx={{ color }} /> */}
                              </ListItem>
                            );
                          })}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 3,
                  }}
                >
                  <Grid size={12}>
                    <Paper
                      elevation={3}
                      // style={{ padding: 20, paddingTop: 10 }}
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        borderRadius: 8,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ marginTop: 2, marginLeft: 2, fontWeight: "bold" }}>
                        Transaction History
                      </Typography>
                      <List>
                        {financialReport.transactions &&
                          financialReport.transactions.map((t, idx) => {
                            let category = getCategory(t.categoryID, categories);
                            let color = "#2BDE73";
                            if (t.transactionType == "Expense") {
                              color = "#EA4335";
                            }
                            return (
                              <ListItem key={idx}>
                                <ListItemAvatar>
                                  {category ? (
                                    <Avatar sx={{ bgcolor: category.colour }}>
                                      {category.icon ? category.icon : category.name[0]}
                                    </Avatar>
                                  ) : (
                                    <Avatar></Avatar>
                                  )}
                                </ListItemAvatar>
                                <ListItemText
                                  primary={t.title}
                                  secondary={category ? category.name : ""}
                                  sx={{ minWidth: "50%" }}
                                />
                                <ListItemText secondary={t.date.split("T")[0]} sx={{ minWidth: "10%" }} />
                                <AttachMoneyIcon fontSize="small" />
                                <ListItemText primary={t.amount} sx={{ color }} />
                              </ListItem>
                            );
                          })}
                      </List>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 3 }}
                >
                  <Grid size={6}></Grid>
                  <Grid
                    size={6}
                    sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                  >
                    <Button
                      variant="contained"
                      fullWidth={false}
                      style={{ backgroundColor: "#7459D9" }}
                      onClick={() => {
                        setShowReport(false);
                        setFinancialReport({});
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            background: "transparent",
            outline: 0,
            marginTop: 5,
          }}
        >
          <Grid container spacing={0} sx={{ minHeight: "500px" }}>
            <Grid size={1}></Grid>
            <Grid size={10} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Paper
                elevation={3}
                style={{ padding: 20, paddingTop: 10 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "flex-end",
                  width: "100%",
                  borderRadius: 8,
                }}
              >
                <Grid container spacing={2} sx={{ marginTop: 3, width: "100%" }}>
                  <Grid size={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            InputProps: {
                              sx: { borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }, // Apply the styles here
                            },
                          },
                        }}
                        sx={{ borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid size={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            InputProps: {
                              sx: { borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }, // Apply the styles here
                            },
                          },
                        }}
                        sx={{ borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <Grid size={12}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 3 }}
                >
                  <Grid size={6}></Grid>
                  <Grid
                    size={6}
                    sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}
                  >
                    <Button
                      variant="contained"
                      fullWidth={false}
                      style={{ backgroundColor: "#7459D9" }}
                      onClick={handleSubmit}
                    >
                      Generate Financial Report
                    </Button>
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={0}
                  sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: 3 }}
                >
                  <Grid size={6}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                      Financial Reports
                    </Typography>
                  </Grid>
                  <Grid size={6}></Grid>
                  <Grid size={12}>
                    {financialReports && (
                      <Paper
                        elevation={3}
                        // style={{ padding: 20, paddingTop: 10 }}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          borderRadius: 8,
                        }}
                      >
                        <List>
                          {financialReports.map((report, idx) => {
                            return (
                              <ListItem
                                key={idx}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => getFinancialReport(report.reportID)}
                                  >
                                    <ArrowForwardIosIcon />
                                  </IconButton>
                                }
                              >
                                <ListItemText
                                  primary={`From ${report.reportPeriodStartDate.split("T")[0]} To ${
                                    report.reportPeriodEndDate.split("T")[0]
                                  } `}
                                  secondary={`Generated: ${report.generatedDate.split("T")[0]}`}
                                />
                              </ListItem>
                            );
                          })}
                        </List>
                      </Paper>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid size={1}></Grid>
          </Grid>
        </Box>
      )}
    </Modal>
  );
};

export default FinancialReportModal;
