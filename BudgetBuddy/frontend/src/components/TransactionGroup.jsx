import React from "react";
import { Paper, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const TransactionGroup = ({ type, categories, transactions, handleClick }) => {
  let color;
  if (type == "Expense") {
    color = "#EA4335";
  } else {
    color = "#2BDE73";
  }

  const getCategory = (categoryID, categories) => {
    for (let c of categories) {
      if (c.categoryID === categoryID) {
        return c;
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 10, width: "100%", marginTop: 1 }}>
      <List>
        {transactions.map((t, idx) => {
          let category = getCategory(t.categoryID, categories);
          return (
            <ListItem
              key={idx}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleClick(t)}>
                  <ArrowForwardIosIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                {category ? (
                  <Avatar sx={{ bgcolor: category.colour }}>{category.icon ? category.icon : category.name[0]}</Avatar>
                ) : (
                  <Avatar></Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={t.title} secondary={category ? category.name : ""} sx={{ minWidth: "65%" }} />
              <AttachMoneyIcon fontSize="small" />
              <ListItemText primary={t.amount} sx={{ color }} />
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default TransactionGroup;
