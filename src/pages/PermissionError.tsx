import React from "react";
import { Box, Typography } from "@mui/material";

const PermissionError = () => {
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
        閲覧することができません
      </Typography>
    </Box>
  );
};

export default PermissionError;
