import React, { useState } from "react";
import { Typography, Box, Grid2 as Grid } from "@mui/material";
import MonthPicker from "../components/MonthPicker";
import TransactionGroup from "../components/TransactionGroup";
import AddTransactionModal from "../components/AddTransactionModal";

const Transactions = ({ budget, categories, users, transactions, setRefresh, fetchAllTransactions }) => {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [currTransaction, setCurrTransaction] = useState();

  const sortTransactionsByDate = (transactions) => {
    let sortedTransactions = [];
    let transactionDateMap = {};

    for (let t of transactions) {
      if (t.date in transactionDateMap) {
        transactionDateMap[t.date].push(t);
      } else {
        transactionDateMap[t.date] = [t];
      }
    }

    const sortedDateKeys = Object.keys(transactionDateMap).sort((a, b) => new Date(b) - new Date(a));
    // Loop through the sorted keys and push the corresponding values into the array
    sortedDateKeys.forEach((key) => {
      sortedTransactions.push(transactionDateMap[key]);
    });

    return sortedTransactions;
  };

  const handleClick = (transaction) => {
    setCurrTransaction(transaction);
    setShowTransactionModal(true);
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: 5 }}>
      <Grid size={2} sx={{}}></Grid>
      <Grid
        container
        size={8}
        sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
      >
        <Grid size={12}>
          <MonthPicker budgetID={budget.budgetID} startDate={budget.creationDate} handleSubmit={fetchAllTransactions} />
        </Grid>

        <Grid container spacing={6} size={12}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Typography variant="heading4" sx={{ fontWeight: "bold" }}>
                Income
              </Typography>
            </Box>

            {sortTransactionsByDate(transactions.filter((t) => t.transactionType === "Income")).map((t, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <Typography variant="subtitle2" sx={{ marginTop: 3, fontWeight: "bold" }}>
                  {t[0].date.split("T")[0]}
                </Typography>
                <TransactionGroup type="Income" categories={categories} transactions={t} handleClick={handleClick} />
              </Box>
            ))}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <Typography variant="heading4" sx={{ fontWeight: "bold" }}>
                Expense
              </Typography>
            </Box>
            {sortTransactionsByDate(transactions.filter((t) => t.transactionType === "Expense")).map((t, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <Typography variant="subtitle2" sx={{ marginTop: 3, fontWeight: "bold" }}>
                  {t[0].date.split("T")[0]}
                </Typography>
                <TransactionGroup type="Expense" categories={categories} transactions={t} handleClick={handleClick} />
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid size={2} sx={{}}></Grid>
      <AddTransactionModal
        showModal={showTransactionModal}
        setShowModal={setShowTransactionModal}
        budgetID={budget.budgetID}
        categories={categories}
        users={users}
        currUser={users.find((user) => user.current)}
        setRefresh={setRefresh}
        transaction={currTransaction}
      />
    </Grid>
  );
};

export default Transactions;
