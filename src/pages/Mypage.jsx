import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Paper, Typography, Avatar, Stack, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import { auth, db } from "../firebase.js";
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const Mypage = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   //レンダリング中に遷移するのは非推奨らしいので， useEffect使用
  //   if (!isAuth) {
  //     navigate("/SignIn");
  //   }
  // }, [isAuth]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  const user = auth.currentUser;

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("Sign-out successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeData = async () => {
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "user", uid);
    const favoriteCollectionRef = collection(userDocRef, "favorite");

    const getUserDocRef = await getDoc(userDocRef);
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(favoriteCollectionRef);
      querySnapshot.forEach((favDoc) => {
        deleteDoc(doc(db, "user", uid, "favorite", favDoc.id));
      });
    }

    deleteDoc(userDocRef);
  };

  const handleUserDelete = () => {
    //userのドキュメントを
    //documentのIDを取得
    removeData();

    deleteUser(user)
      .then(() => {
        console.log("User delete successful");
        navigate("/SignUp");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        sx={{
          width: "80%", // 横幅を画面の80%に設定
          margin: "auto",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%" }} // Stackを親要素の幅いっぱいに広げる
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
            }}
          >
            <AccountCircle sx={{ fontSize: 100 }} />
          </Avatar>

          {user ? (
            <Typography variant="h5" component="div" sx={{ flex: 1 }}>
              {user.email}
            </Typography>
          ) : (
            <Typography variant="h5" component="div" sx={{ flex: 1 }}>
              No user
            </Typography>
          )}

          <Button
            sx={{
              textTransform: "none",
              border: "1px solid blue",
              "&:hover": {
                border: "1px solid #a9a9a9",
                backgroundColor: "#87cefa",
              },
            }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={handleUserDelete}
          >
            Delete
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};

export default Mypage;
