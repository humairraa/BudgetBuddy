import React from "react";
import { Grid2 as Grid } from "@mui/material";

const Header = () => {
  return (
    <Grid
      sx={{
        height: "40vh",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#F2F2F7",
        zIndex: -1,
      }}
    ></Grid>
  );
};

export default Header;
