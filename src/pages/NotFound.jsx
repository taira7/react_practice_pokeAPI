import React from "react";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        minWidth: "100vw",
      }}
    >
      <Typography variant="h1" style={{ color: "black" }}>
        ページが見つかりません
      </Typography>
    </Box>
  );
};

export default NotFound;
