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

import { db } from "../firebase";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

export const PendingRequestCard = ({ pendingUser, myDetails }) => {
  const myId = myDetails.uid;
  const pendingUserId = pendingUser.id;

  const handleRejectRequest = async () => {
    //拒否
    //自分のfriendRequestから相手の情報を削除
    const myFriendRequestCollectionRef = collection(db, "user", myId, "friendRequest");
    await deleteDoc(doc(myFriendRequestCollectionRef, pendingUserId))

    window.location.reload();
  };

  const handleApproveRequest = async () => {
    //承認

    //自分のフレンドコレクションに追加
    const myFriendsCollectionRef = collection(db, "user", myId, "friends")
    await setDoc(doc(myFriendsCollectionRef, pendingUserId), {
      email: pendingUser.email,
      id: pendingUserId,
    })

    //相手のフレンドコレクションに追加
    const pendingUserFriendsCollectionRef = collection(db, "user", pendingUserId, "friends")
    await setDoc(doc(pendingUserFriendsCollectionRef, myId), {
      email: myDetails.email,
      id: myId,
    })

    handleRejectRequest();
  };

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
            onClick={handleApproveRequest}
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
            onClick={handleRejectRequest}
          >
            拒否
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};
