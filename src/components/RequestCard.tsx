import React, { useEffect, useState } from "react";

import { db } from "../firebase";
import { User } from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

import { Paper, Typography, Avatar, Stack, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

type UserData = {
  id: string;
  email: string;
};

type RequestCardProps = {
  requestDetails: UserData;
  myDetails: User | null;
  setRequestDetails: React.Dispatch<React.SetStateAction<UserData | null>>;
};

type friendData = {
  id: string;
  email: string;
};

export const RequestCard: React.FC<RequestCardProps> = ({
  requestDetails,
  myDetails,
  setRequestDetails,
}) => {
  const [friend, setFriend] = useState(false);

  const myId: string | undefined = myDetails?.uid;
  const myEmail: string | undefined | null = myDetails?.email;
  const requestId: string = requestDetails.id;

  const friendCollectionCheck = async () => {
    if (!myId) {
      return;
    }
    const friendsCollectionRef = collection(db, "user", myId, "friends");
    const querySnapshot = await getDocs(friendsCollectionRef);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as friendData;
        if (data.id === requestId) {
          setFriend(true);
        }
      });
    }
  };

  const handleClick = async () => {
    if (!myId || !myEmail) {
      return;
    }

    //受信者側
    await setDoc(doc(db, "user", requestId, "friendRequest", myId), {
      email: myEmail,
      id: myId,
      isReceive: true,
    });
    //送信者側
    await setDoc(doc(db, "user", myId, "friendRequest", requestId), {
      email: requestDetails.email,
      id: requestId,
      isReceive: false,
    });
    setRequestDetails(null);
    window.location.reload();
  };

  useEffect(() => {
    friendCollectionCheck();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
          sx={{ width: "100%", padding: "10px", paddingRight: "30px" }}
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
            {requestDetails.email}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            ID:　{requestDetails.id}
          </Typography>

          {friend ? (
            <Typography>登録済み</Typography>
          ) : (
            <Button
              sx={{
                textTransform: "none",
                border: "1px solid blue",
                fontSize: "20px",
                "&:hover": {
                  border: "1px solid #a9a9a9",
                  backgroundColor: "#87cefa",
                },
              }}
              onClick={handleClick}
            >
              申請する
            </Button>
          )}
        </Stack>
      </Paper>
    </div>
  );
};
