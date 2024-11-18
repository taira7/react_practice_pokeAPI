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
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="space-between" // 均等に配置
        sx={{ width: "100%", padding: "10px", paddingRight: "30px" }} // Stackを親要素の幅いっぱいに広げる
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
          sx={{
            textTransform: "none",
            border: "1px solid blue",
            fontSize: "18px",
            "&:hover": {
              border: "1px solid #a9a9a9",
              backgroundColor: "#87cefa",
            },
          }}
        >
          申請する
        </Button>
      </Stack>
    </div>
  );
};
