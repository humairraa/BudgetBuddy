import React, { useState } from "react";
import { Avatar, ListItemIcon, Divider, Box, Button, Menu, MenuItem, Grid2 as Grid } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PersonAdd from "@mui/icons-material/PersonAdd";
import AddSharedBudgetModal from "./AddSharedBudget";

const Navbar = ({ account, setAccount, budgets, setSelectedBudget, setRefresh, fetchAllBudgets }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [anchorEl, setAnchorEl] = useState(null);
  const [showSharedBudgetModal, setShowSharedBudgetModal] = useState(false);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container spacing={0} sx={{ padding: "10px" }}>
      <Grid size={1} />
      <Grid size={2}>
        <h1 style={{ color: "#7459D9", fontSize: "1.5rem", fontWeight: "bold", textAlign: "left" }}>BudgetBuddy</h1>
      </Grid>
      <Grid size={4} sx={{}}></Grid>
      <Grid size={5} sx={{}}>
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <Button
            {...(pathname && pathname == "/insights" ? { variant: "contained" } : {})}
            fullWidth={false}
            onClick={() => {
              navigate("/insights");
            }}
            style={
              pathname && pathname == "/insights"
                ? { backgroundColor: "#7459D9", textTransform: "none", fontSize: 16 }
                : { textTransform: "none", fontSize: 16, color: "#7459D9" }
            }
          >
            Insights
          </Button>
          <Button
            {...(pathname && pathname == "/transactions" ? { variant: "contained" } : {})}
            fullWidth={false}
            onClick={() => {
              navigate("/transactions");
            }}
            style={
              pathname && pathname == "/transactions"
                ? { backgroundColor: "#7459D9", textTransform: "none", fontSize: 16 }
                : { textTransform: "none", fontSize: 16, color: "#7459D9" }
            }
          >
            Transactions
          </Button>
          <Button
            {...(pathname && pathname == "/home" ? { variant: "contained" } : {})}
            fullWidth={false}
            onClick={(event) => {
              setAnchorEl(event.currentTarget);
            }}
            style={
              pathname && pathname == "/home"
                ? { backgroundColor: "#7459D9", textTransform: "none", fontSize: 16 }
                : { textTransform: "none", fontSize: 16, color: "#7459D9" }
            }
          >
            {account}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {/* <MenuItem
              onClick={() => {
                handleClose();
                setAccount("My Budget");
                navigate("/home");
              }}
            >
              <Avatar sx={{ marginRight: 2 }} /> My Budget
            </MenuItem> */}
            {/* {ACCOUNTS.map((a, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  handleClose();
                  setAccount(a);
                  navigate("/home");
                }}
              >
                <Avatar sx={{ marginRight: 2 }} /> {a}
              </MenuItem>
            ))} */}
            {budgets.map((budget, i) => {
              const accountName = budget.title == "Default" ? "My Budget" : budget.title;
              return (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleClose();
                    setAccount(accountName);
                    setSelectedBudget(budget);
                    navigate("/home");
                  }}
                >
                  <Avatar sx={{ marginRight: 2 }} /> {accountName}
                </MenuItem>
              );
            })}
            <Divider />
            <MenuItem
              onClick={() => {
                handleClose();
                setShowSharedBudgetModal(true);
              }}
            >
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add Budget
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/login");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
        <AddSharedBudgetModal
          showModal={showSharedBudgetModal}
          setShowModal={setShowSharedBudgetModal}
          setRefresh={setRefresh}
          fetchAllBudgets={fetchAllBudgets}
        />
      </Grid>
    </Grid>
  );
};

export default Navbar;
