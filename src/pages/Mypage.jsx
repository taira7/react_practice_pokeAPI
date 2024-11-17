import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Paper,
  Typography,
  Avatar,
  Stack,
  Button,
  TextField,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

import { auth, db } from "../firebase.js";
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const MyPage = ({ setIsMyPage }) => {
  const [requestId, setRequestId] = useState("");
  const [userDetails, setUserDetails] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  useEffect(() => {
    setIsMyPage(true);
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

    navigate("/SignUp");

    deleteUser(user)
      .then(() => {
        console.log("User delete successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRequestIdSubmit = async (e) => {
    //デフォルト動作の無効　送信時のリロードを止める
    e.preventDefault();

    const querySnapshot = await getDocs(collection(db, "user"));

    let hitUser = "";
    querySnapshot.forEach((doc) => {
      if (doc.id === requestId) {
        hitUser = doc.data();
      }
    });

    if (hitUser) {
      console.log("id :", hitUser.id, "email :", hitUser.email);
    } else {
      console.log("user does not exist");
    }
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
      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        プロフィール
      </Typography>
      <Paper
        sx={{
          width: "80%", // 横幅を画面の80%に設定
          margin: "auto",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          marginBottom: "30px",
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
            <></>
          )}

          {user ? (
            <Typography variant="h6" component="div" sx={{ flex: 1 }}>
              ID: {user.uid}
            </Typography>
          ) : (
            <></>
          )}

          {/* <Button
            sx={{
              textTransform: "none",
              border: "1px solid blue",
              "&:hover": {
                border: "1px solid #a9a9a9",
                backgroundColor: "#87cefa",
              },
            }}
            onClick={() => {
              navigate("/MyFavorite");
            }}
          >
            お気に入り
          </Button> */}

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
            サインアウト
          </Button>

          <Button
            variant="outlined"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={handleUserDelete}
          >
            アカウント削除
          </Button>
        </Stack>
        {/* {user ? (
          <Typography variant="h6" sx={{ justifyContent: "left" }}>
            ユーザーID:　{user.uid}
          </Typography>
        ) : (
          <></>
        )} */}
      </Paper>

      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        フレンド
      </Typography>

      <Paper
        sx={{
          width: "80%", // 横幅を画面の80%に設定
          margin: "auto",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 3,
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%", padding: "10px", border: "1px solid #a9a9a9" }} // Stackを親要素の幅いっぱいに広げる
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
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%", padding: "10px", border: "1px solid #a9a9a9" }} // Stackを親要素の幅いっぱいに広げる
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
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%", padding: "10px", border: "1px solid #a9a9a9" }} // Stackを親要素の幅いっぱいに広げる
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
        </Stack>
      </Paper>

      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        承認待ち
      </Typography>
      <Paper
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
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%", padding: "10px", border: "1px solid #a9a9a9" }} // Stackを親要素の幅いっぱいに広げる
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
        </Stack>
      </Paper>

      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        フレンド申請
      </Typography>

      <form
        style={{
          display: "flex",
          marginBottom: "80px",
          width: "100%", // フォームの幅を画面の50%に設定
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
        onSubmit={handleRequestIdSubmit}
      >
        <TextField
          id="outlined-basic"
          label="ユーザーIDで検索"
          variant="outlined"
          sx={{
            background: "#f5f5f5",
            width: "40%",
          }}
          value={requestId}
          onChange={(e) => {
            setRequestId(e.target.value);
            console.log(requestId);
          }}
        />
        <Button variant="contained" type="submit">
          <SearchIcon />
        </Button>
      </form>
      <Paper
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
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%", padding: "10px", border: "1px solid #a9a9a9" }} // Stackを親要素の幅いっぱいに広げる
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
        </Stack>
      </Paper>
    </div>
  );
};

export default MyPage;
