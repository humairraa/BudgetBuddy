import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  FormControl,
  Paper,
  IconButton,
  TextField,
  Alert,
  Grid2 as Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import customAxiosInstance from "../utils/customAxiosInstance";

const AddUserModal = ({ budgetID, users, showModal, setShowModal, setRefresh }) => {
  const [username, setUsername] = useState("");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    try {
      if (!username) {
        setSuccess(null);
        setError("Missing information. Please fill all fields");
        return;
      }
      let payload = {
        identifier: username,
      };
      const res = await customAxiosInstance.post(`/budget/${budgetID}/addUser`, payload);
      setError(null);
      setRefresh(true);
      setSuccess("Successfully added user");
      setUsername("");
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setSuccess(null);
      setError(err?.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (userID) => {
    try {
      let payload = {
        userID,
      };
      console.log(payload);
      const res = await customAxiosInstance.post(`/budget/${budgetID}/removeUser`, payload);
      setError(null);
      setSuccess("Successfully removed user");
      setRefresh(true);
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setSuccess(null);
      setError(err?.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [showModal]);

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
              <FormControl fullWidth sx={{ marginTop: 3 }}>
                <TextField
                  id="username"
                  fullWidth
                  label="User"
                  placeholder="Add by username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  sx={{ marginTop: 3, width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
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
                      Add User
                    </Button>
                  </Grid>
                </Grid>
              </FormControl>

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

              <Grid container spacing={0} sx={{ marginTop: 3, width: "100%", background: "transparent" }}>
                <Grid size={12}>
                  <Paper elevation={3} sx={{ borderRadius: 10 }}>
                    <List>
                      {users.map((user, idx) => (
                        <ListItem
                          key={idx}
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(user.userID)}>
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
            </Paper>
          </Grid>
          <Grid size={1}></Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
