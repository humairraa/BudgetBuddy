import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import customAxiosInstance from "../utils/customAxiosInstance";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import MovieIcon from "@mui/icons-material/Movie";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = {
  Entertainment: <MovieIcon />,
  Shopping: <LocalMallIcon />,
  "Dining Out": <FastfoodIcon />,
  Transportation: <DirectionsCarFilledIcon />,
};

const Wrapper = ({ Component }) => {
  const [account, setAccount] = useState("My Budget");
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [financialReports, setFinancialReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const changeScreen = useNavigate();

  const fetchAllBudgets = async (title = null) => {
    try {
      const budgetRes = await customAxiosInstance.get("/budgets");
      console.log("BUDGETS", budgetRes.data);
      setBudgets(budgetRes.data);
      if (budgetRes.data.length > 0) {
        if (title) {
          let budget = budgetRes.data.find((b) => b.title === title);
          setSelectedBudget(budget);
        } else {
          setSelectedBudget(budgetRes.data[0]);
        }
      }
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      changeScreen("/");
    }
  };

  const fetchAllCategories = async (budgetID) => {
    try {
      const categoriesRes = await customAxiosInstance.get(`/budget/${budgetID}/categories`);
      console.log("CATEGORIES", categoriesRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
      changeScreen("/");
    }
  };

  const fetchAllGoals = async (budgetID) => {
    try {
      const goalsRes = await customAxiosInstance.get(`/budget/${budgetID}/spendingGoals`);
      console.log("GOALS", goalsRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const fetchAllUsers = async (budgetID) => {
    try {
      const usersRes = await customAxiosInstance.get(`/budget/${budgetID}/getAllBudgetUsers`);
      console.log("USERS", usersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const fetchAllTransactions = async (budgetID, month = null, year = null) => {
    try {
      if (!month || !year) {
        const currentDate = new Date();
        year = currentDate.getFullYear();
        month = currentDate.getMonth() + 1;
      }

      const transactionsRes = await customAxiosInstance.get(
        `/budget/${budgetID}/transactions?month=${month}&year=${year}`
      );
      console.log("TRANSACTIONS", transactionsRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const fetchAllFinancialReports = async (budgetID) => {
    try {
      const res = await customAxiosInstance.get(`/budget/${budgetID}/financialReports`);
      console.log("FINANCIAL REPORTS", res.data);
      setFinancialReports(res.data);
    } catch (err) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const updateCurrentBudget = async (budgetID) => {
    try {
      const res = await customAxiosInstance.get(`/budget/${budgetID}`);
      setSelectedBudget(res.data);
    } catch (err) {
      console.error(err.response?.data?.error || err.message);
    }
  };

  const addCategoryIcon = (categories) => {
    let result = [];
    for (let c of categories) {
      if (c.name in CATEGORY_ICONS) {
        c.icon = CATEGORY_ICONS[c.name];
      }
      result.push(c);
    }
    return result;
  };

  useEffect(() => {
    let token = localStorage.getItem("jwt-token");
    if (!token) {
      changeScreen("/");
    }

    if (selectedBudget && refresh) {
      updateCurrentBudget(selectedBudget.budgetID);
    }

    if (selectedBudget || refresh) {
      fetchAllCategories(selectedBudget.budgetID);
      fetchAllGoals(selectedBudget.budgetID);
      fetchAllUsers(selectedBudget.budgetID);
      fetchAllTransactions(selectedBudget.budgetID);
      fetchAllFinancialReports(selectedBudget.budgetID);
      setRefresh(false);
    } else {
      fetchAllBudgets();
    }
  }, [refresh, selectedBudget]);

  if (budgets.length === 0) {
    return <div>Loading budget...</div>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Navbar
        account={account}
        setAccount={setAccount}
        budgets={budgets}
        setSelectedBudget={setSelectedBudget}
        setRefresh={setRefresh}
        fetchAllBudgets={fetchAllBudgets}
      />
      <Component
        budget={selectedBudget}
        setSelectedBudget={setSelectedBudget}
        goals={goals}
        categories={addCategoryIcon(categories)}
        users={users}
        financialReports={financialReports}
        transactions={transactions}
        setRefresh={setRefresh}
        fetchAllTransactions={fetchAllTransactions}
      />
      {/* Render the passed-in component here */}
    </Box>
  );
};

export default Wrapper;
