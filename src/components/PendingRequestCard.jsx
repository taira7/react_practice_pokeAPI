import React from "react";

import {
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export const PendingRequestCard = ({ pendingUser, myDetails }) => {
  const myId = myDetails.uid;
  const pendingUserId = pendingUser.id;

  const handleApproveRequest = () => {};
  const handleRejectRequest = () => {};

  return (
    <div>
      <Paper
        elevation={3} // Paperの立体感を追加
        sx={{
          width: "80%", // 横幅を画面の80%に設定
          margin: "auto",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          marginBottom: "30px",
          gap: "15px",
          borderRadius: "8px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{
            width: "100%",
            padding: "10px",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
            }}
          >
            <AccountCircle sx={{ fontSize: 100 }} />
          </Avatar>

          <Typography variant="h5" component="div" sx={{ flex: 1 }}>
            {pendingUser.email}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            ID:　{pendingUser.id}
          </Typography>

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              border: "1px solid blue",
              fontSize: "20px",
              "&:hover": {
                border: "1px solid #a9a9a9",
                backgroundColor: "#87cefa",
              },
            }}
          >
            承認
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{
              textTransform: "none",
              fontSize: "20px",
              "&:hover": {
                backgroundColor: "#ffcccc",
                color: "#a00000",
              },
            }}
          >
            拒否
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};
