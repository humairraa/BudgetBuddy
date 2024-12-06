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
  Paper,
  Alert,
  Grid2 as Grid,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import customAxiosInstance from "../utils/customAxiosInstance";

const AddCategoryModal = ({ budgetID, showModal, setShowModal, setRefresh }) => {
  // const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [colour, setColour] = useState("#7459D9");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    try {
      if (!colour || !name) {
        setError("Missing information. Please fill all fields");
        return;
      }
      let payload = {
        name,
        colour,
        isCustom: true,
      };
      const res = await customAxiosInstance.post(`/budget/${budgetID}/category`, payload);
      setError(null);
      setRefresh(true);
      setSuccess("Successfully added category");
      setName("");
      setColour("#7459D9");
    } catch (err) {
      console.log(err?.response?.data?.error || err.message);
      setError("Failed to add category");
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
              <Grid container spacing={2} sx={{ marginTop: 3, width: "100%" }}>
                {/* <Grid size={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <FormControl sx={{ width: "100%" }} size="small">
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      value={type}
                      label="Type"
                      sx={{ borderRadius: 16, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)" }}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <MenuItem value="Expense">Expense</MenuItem>
                      <MenuItem value="Income">Income</MenuItem>
                    </Select>
                  </FormControl>
                </Grid> */}
                <Grid size={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <MuiColorInput
                    format="hex"
                    size="small"
                    label="Colour"
                    value={colour}
                    onChange={(c) => setColour(c)}
                    sx={{
                      borderRadius: 16,
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Root class for the input field
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 16,
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Name"
                margin="normal"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                    Add Custom Category
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

export default AddCategoryModal;
