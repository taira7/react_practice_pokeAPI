import React, { useEffect, useState } from "react";

import { db } from "../firebase";
import { User } from "firebase/auth";
import { doc, collection, getDoc, deleteDoc, setDoc } from "firebase/firestore";

import { Paper, Typography, Avatar, Stack, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

type PendingUserData = {
  id: string;
  email: string;
  isReceive: boolean;
};

type PendingRequestCardProps = {
  pendingUser: PendingUserData;
  myDetails: User | null;
};

export const PendingRequestCard: React.FC<PendingRequestCardProps> = ({
  pendingUser,
  myDetails,
}) => {
  const myId = myDetails?.uid;
  const pendingUserId = pendingUser.id;

  const [isReceive, setIsReceive] = useState<boolean>();

  const checkIsReceive = async () => {
    if (!myId) {
      return;
    }
    const details = await getDoc(
      doc(db, "user", myId, "friendRequest", pendingUserId)
    );
    const data = details.data() as PendingUserData;
    setIsReceive(data.isReceive);
  };

  const handleRejectRequest = async () => {
    if (!myId) {
      return;
    }
    //拒否
    //自分のfriendRequestから相手の情報を削除
    await deleteDoc(doc(db, "user", myId, "friendRequest", pendingUserId));
    await deleteDoc(doc(db, "user", pendingUserId, "friendRequest", myId));

    window.location.reload();
  };

  const handleApproveRequest = async () => {
    if (!myId) {
      return;
    }
    //承認

    //自分のフレンドコレクションに追加
    const myFriendsCollectionRef = collection(db, "user", myId, "friends");
    await setDoc(doc(myFriendsCollectionRef, pendingUserId), {
      email: pendingUser.email,
      id: pendingUserId,
    });

    //相手のフレンドコレクションに追加
    const pendingUserFriendsCollectionRef = collection(
      db,
      "user",
      pendingUserId,
      "friends"
    );
    await setDoc(doc(pendingUserFriendsCollectionRef, myId), {
      email: myDetails.email,
      id: myId,
    });

    handleRejectRequest();
  };

  useEffect(() => {
    checkIsReceive();
  }, []);

  return (
    <div>
      <Paper
        elevation={3}
        sx={{
          width: "80%",
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

          {isReceive ? (
            <>
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
            </>
          ) : (
            <Typography>申請中です</Typography>
          )}
        </Stack>
      </Paper>
    </div>
  );
};
