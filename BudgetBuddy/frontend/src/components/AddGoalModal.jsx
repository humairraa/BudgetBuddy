import React, { useState, useEffect } from "react";
import {
  Modal,
  TextField,
  Box,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Alert,
  Grid2 as Grid,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import customAxiosInstance from "../utils/customAxiosInstance";

const AddGoalModal = ({ budgetID, categories, showModal, setShowModal, setRefresh }) => {
  const [category, setCategory] = useState("");
  const [spendingLimit, setSpendingLimit] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [showModal]);

  const handleSubmit = async () => {
    try {
      if (!category || !spendingLimit || !startDate || !endDate) {
        setError("Missing information. Please fill all fields");
        return;
      }

      if (endDate <= startDate) {
        setError("End Date must be after Start Date");
        return;
      }
      let payload = {
        categoryID: category,
        spendingLimit: spendingLimit,
        currAmount: 0,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };
      const res = await customAxiosInstance.post(`/budget/${budgetID}/spendingGoal`, payload);
      setError(null);
      setRefresh(true);
      setSuccess("Successfully added goal");
      setSpendingLimit("");
      setCategory("");
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setError("Failed to add goal");
    }
  };

  return (
    <Modal
      open={showModal}
      sx={{ overflow: "scroll" }}
      onClose={() => setShowModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
        <Grid container spacing={0} sx={{ minHeight: "300px" }}>
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
              <Grid container spacing={0} sx={{ marginTop: 3, width: "100%" }}>
                <Grid size={12}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={category}
                      label="Category"
                      sx={{ borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <MenuItem key={c.categoryID} value={c.categoryID}>
                          {/* <Avatar sx={{ bgcolor: c.colour, marginRight: 3 }}>{c.icon}</Avatar> */}
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

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
              <Grid container spacing={2} sx={{ marginTop: 3, width: "100%" }}>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="spendingLimit">Spending Limit</InputLabel>
                    <OutlinedInput
                      id="spendingLimit"
                      placeholder="0.00"
                      value={spendingLimit}
                      onChange={(e) => setSpendingLimit(e.target.value)}
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      label="Spending Limit"
                      size="small"
                      sx={{ borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }}
                    />
                  </FormControl>
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
                sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
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
                    Add Goal
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid size={1}></Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddGoalModal;
