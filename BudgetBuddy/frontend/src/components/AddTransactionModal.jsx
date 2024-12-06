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
  Alert,
  Avatar,
  Paper,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Grid2 as Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import customAxiosInstance from "../utils/customAxiosInstance";

const AddTransactionModal = ({
  showModal,
  setShowModal,
  budgetID,
  categories,
  users,
  currUser,
  setRefresh,
  transaction = null,
}) => {
  const [type, setType] = useState("Expense");
  const [recurring, setRecurring] = useState("No");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(null);
  const [user, setUser] = useState("");
  const [transactionUsers, setTransactionUsers] = useState(currUser ? [currUser] : []);
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(null);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState(null);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    try {
      if (!title || !category || !amount || !type) {
        setError("Missing information. Please fill all fields");
        return;
      }
      if (recurring == "Yes") {
        if (!recurrenceFrequency || !recurrenceStartDate || !recurrenceEndDate) {
          setError("Missing information. Please fill all fields");
          return;
        }
      } else if (!date) {
        setError("Missing information. Please fill all fields");
        return;
      }
      let payload = {
        title,
        categoryID: category,
        amount,
        date,
        transactionType: type,
        recurrenceFrequency,
        recurrenceStartDate,
        recurrenceEndDate,
      };

      if (recurring == "Yes") {
        payload.date = recurrenceStartDate;

        if (recurrenceStartDate > recurrenceEndDate) {
          setError("End Date must be after Start Date");
          return;
        }
      }
      payload.users = [];
      for (let user of transactionUsers) {
        payload.users.push(user.userID);
      }
      if (transaction) {
        const resp = await customAxiosInstance.put(
          `/budget/${budgetID}/transaction/${transaction.transactionID}`,
          payload
        );
        setError(null);
        setRefresh(true);
        setSuccess("Successfully updated transaction");
      } else {
        const resp = await customAxiosInstance.post(`/budget/${budgetID}/transaction`, payload);
        setError(null);
        setRefresh(true);
        setSuccess("Successfully added transaction");

        setType("Expense");
        setRecurring("No");
        setCategory("");
        setTitle("");
        setAmount("");
        setDate(null);
        setUser("");
        setTransactionUsers(currUser ? [currUser] : []);
        setRecurrenceStartDate(null);
        setRecurrenceEndDate(null);
        setRecurrenceFrequency("");
      }
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      if (transaction) {
        setError("Failed to update transaction");
      } else {
        setError("Failed to add transaction");
      }
    }
  };

  const handleDelete = async () => {
    try {
      if (!transaction) {
        return;
      }
      const resp = await customAxiosInstance.delete(`/budget/${budgetID}/transaction/${transaction.transactionID}`);
      setError(null);
      setRefresh(true);
      setSuccess("Successfully added transaction");
      setShowModal(false);
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setError("Failed to delete transaction");
    }
  };

  const getTransactionDetails = async (transactionID) => {
    try {
      const resp = await customAxiosInstance.get(`/budget/${budgetID}/transaction/${transactionID}`);
      const currTransaction = resp.data;
      console.log("TRANSACTION DETAILS", currTransaction);
      let category = getCategory(currTransaction.categoryID, categories);

      setType(currTransaction.transactionType || "Expense");
      setRecurring(currTransaction.recurrenceEndDate ? "Yes" : "No");
      setCategory(category.categoryID || "");
      setTitle(currTransaction.title || "");
      setAmount(currTransaction.amount || "");
      setDate(currTransaction.date ? dayjs(currTransaction.date) : null);
      setRecurrenceStartDate(currTransaction.recurrenceStartDate ? dayjs(currTransaction.recurrenceStartDate) : null);
      setRecurrenceEndDate(currTransaction.recurrenceEndDate ? dayjs(currTransaction.recurrenceEndDate) : null);
      setRecurrenceFrequency(currTransaction.recurrenceFrequency || "");
      setTransactionUsers(currTransaction.users);
      setUser("");
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setError("Failed to retrieve transaction users");
    }
  };

  useEffect(() => {
    if (transaction && showModal) {
      getTransactionDetails(transaction.transactionID);
    }
    if (currUser && !transaction) {
      setTransactionUsers([currUser]);
    }
    if (!showModal) {
      setError(null);
      setSuccess(null);
    }
  }, [transaction, showModal, currUser]);

  const getCategory = (categoryID, categories) => {
    for (let c of categories) {
      if (c.categoryID === categoryID) {
        return c;
      }
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
          marginTop: 10,
        }}
      >
        <Grid container spacing={0} sx={{ minHeight: "600px" }}>
          <Grid size={1}></Grid>
          <Grid
            size={10}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      value={type}
                      label="Type"
                      sx={{
                        borderRadius: 16,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="Expense">Expense</MenuItem>
                      <MenuItem value="Income">Income</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="recurring-select-label">Recurring</InputLabel>
                    <Select
                      disabled={transaction ? true : false}
                      labelId="recurring-select-label"
                      id="recurring-select"
                      value={recurring}
                      label="Recurring"
                      sx={{
                        borderRadius: 16,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                      onChange={(e) => setRecurring(e.target.value)}
                    >
                      <MenuItem value="No">No</MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {recurring === "Yes" && (
                <>
                  <Grid container spacing={2} sx={{ marginTop: 3, width: "100%" }}>
                    <Grid size={6}>
                      <FormControl sx={{ width: "100%" }} size="small">
                        <InputLabel id="recurrence-frequency-label">Frequency</InputLabel>
                        <Select
                          labelId="recurrence-frequency-label"
                          id="recurrence-frequency"
                          value={recurrenceFrequency}
                          label="Frequency"
                          onChange={(e) => setRecurrenceFrequency(e.target.value)}
                          size="small"
                          sx={{
                            borderRadius: 16,
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                          }}
                        >
                          <MenuItem value="DAILY">Daily</MenuItem>
                          <MenuItem value="WEEKLY">Weekly</MenuItem>
                          <MenuItem value="BI-WEEKLY">Bi-Weekly</MenuItem>
                          <MenuItem value="MONTHLY">Monthly</MenuItem>
                          <MenuItem value="YEARLY">Yearly</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    {!transaction && (
                      <Grid size={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Start Date"
                            value={recurrenceStartDate}
                            onChange={(newValue) => setRecurrenceStartDate(newValue)}
                            slotProps={{
                              textField: {
                                size: "small",
                                InputProps: {
                                  sx: {
                                    borderRadius: 16,
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                                  }, // Apply the styles here
                                },
                              },
                            }}
                            sx={{
                              borderRadius: 16,
                              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                    )}
                  </Grid>
                </>
              )}

              <Grid container spacing={2} sx={{ marginTop: 3, width: "100%" }}>
                <Grid size={6}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="amount">Amount</InputLabel>
                    <OutlinedInput
                      id="amount"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      label="Amount"
                      size="small"
                      sx={{
                        borderRadius: 16,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  </FormControl>
                </Grid>

                {recurring === "Yes" && !transaction ? (
                  <Grid size={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End Date"
                        value={recurrenceEndDate}
                        onChange={(newValue) => setRecurrenceEndDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            InputProps: {
                              sx: {
                                borderRadius: 16,
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                              }, // Apply the styles here
                            },
                          },
                        }}
                        sx={{
                          borderRadius: 16,
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                ) : (
                  <Grid size={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
                        value={date}
                        onChange={(newValue) => setDate(newValue)}
                        slotProps={{
                          textField: {
                            size: "small",
                            InputProps: {
                              sx: {
                                borderRadius: 16,
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                              }, // Apply the styles here
                            },
                          },
                        }}
                        sx={{
                          borderRadius: 16,
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={0} sx={{ marginTop: 3, width: "100%" }}>
                <Grid size={12}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={category}
                      label="Category"
                      sx={{
                        borderRadius: 16,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
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

              <TextField
                fullWidth
                label="Title"
                margin="normal"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                sx={{
                  marginTop: 3,
                  borderRadius: 16,
                  boxShadow: "inset 0px 4px 8px rgba(0, 0, 0, 0.3)", // Root class for the input field
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 16,
                  },
                }}
              />

              <Grid
                container
                spacing={0}
                sx={{
                  marginTop: 3,
                  width: "100%",
                  background: "transparent",
                }}
              >
                <Grid size={12}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="users-select-label">Users</InputLabel>
                    <Select
                      labelId="users-select-label"
                      id="users-select"
                      value={user}
                      label="Users"
                      sx={{
                        borderRadius: 16,
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                      onChange={(e) => {
                        setUser(e.target.value);
                        //handle duplicates
                        let found = transactionUsers.find((user) => user.userID == e.target.value.userID);
                        if (!found) {
                          setTransactionUsers([...transactionUsers, e.target.value]);
                        }
                      }}
                    >
                      {users &&
                        users.map((u, i) => (
                          <MenuItem key={i} value={u}>
                            {u.username}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Paper elevation={3} sx={{ borderRadius: 10, marginTop: 3 }}>
                    <List>
                      {transactionUsers &&
                        transactionUsers.map((user, idx) => (
                          <ListItem
                            key={idx}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => {
                                  if (!user.current && transactionUsers && transactionUsers.length > 1) {
                                    setTransactionUsers(transactionUsers.filter((u) => u.userID !== user.userID));
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          >
                            <ListItemAvatar>
                              {/* <Avatar> */}
                              <AccountCircleIcon />
                              {/* </Avatar> */}
                            </ListItemAvatar>
                            <ListItemText primary={user.username} />
                          </ListItem>
                        ))}
                    </List>
                  </Paper>
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
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid size={6}></Grid>
                <Grid
                  size={6}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    fullWidth={false}
                    style={{ backgroundColor: "#7459D9" }}
                    onClick={handleSubmit}
                  >
                    {transaction ? "Update Transaction" : "Add Transaction"}
                  </Button>
                  {transaction && (
                    <Button
                      variant="contained"
                      fullWidth={false}
                      style={{ backgroundColor: "#EA4335", marginLeft: 5 }}
                      onClick={handleDelete}
                    >
                      <DeleteIcon color="white" />
                    </Button>
                  )}
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

export default AddTransactionModal;
