import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

import { auth, db } from "../firebase.js";
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

import { RequestCard } from "../components/RequestCard.js";
import { PendingRequestCard } from "../components/PendingRequestCard.js";
import { FriendCard } from "../components/FriendCard.js";

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
import Alert from "@mui/material/Alert";

const MyPage = ({ setIsMyPage }) => {
  //フレンド申請関連
  const [requestId, setRequestId] = useState("");
  const [requestDetails, setRequestDetails] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  //フレンド承認待ち関連
  const [pendingUsers, setPendingUsers] = useState();

  //フレンド一覧関連
  const [friendData, setFriendData] = useState();

  const navigate = useNavigate();

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

  const removeDB = async () => {
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "user", uid);

    const getUserDocRef = await getDoc(userDocRef);

    //favoriteサブコレクションの削除
    const favoriteCollectionRef = collection(userDocRef, "favorite");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(favoriteCollectionRef);
      querySnapshot.forEach((favDoc) => {
        deleteDoc(doc(favoriteCollectionRef, favDoc.id));
      });
    }

    //friendRequestサブコレクションの削除
    const requestCollectionRef = collection(userDocRef, "friendRequest");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(requestCollectionRef);
      //受信側の削除
      querySnapshot.forEach((reqDoc) => {
        const friendId = reqDoc.id;
        deleteDoc(doc(db, "user", friendId, "friendRequest", uid));
      });
      //送信者側の削除
      querySnapshot.forEach((reqDoc) => {
        const friendId = reqDoc.id;
        deleteDoc(doc(db, "user", uid, "friendRequest", friendId));
      });
    }

    //ffriendsサブコレクションの削除
    const friendsCollectionRef = collection(userDocRef, "friends");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(friendsCollectionRef);
      //相手のコレクションから削除
      querySnapshot.forEach((doc) => {
        const friendId = doc.id;
        deleteDoc(doc(db, "user", friendId, "friends", uid));
      });
      //自分のコレクションを削除
      querySnapshot.forEach((doc) => {
        const friendId = doc.id;
        deleteDoc(doc(db, "user", uid, "friends", friendId));
      });
    }

    deleteDoc(userDocRef);
  };

  const handleUserDelete = () => {
    removeDB();

    deleteUser(user)
      .then(() => {
        console.log("User delete successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //ID検索
  const handleRequestIdSubmit = async (e) => {
    //デフォルト動作の無効　送信時のリロードを止める
    e.preventDefault();

    const querySnapshot = await getDocs(collection(db, "user"));

    let foundUser = false;

    querySnapshot.forEach((doc) => {
      //該当者が見つかった場合
      if (requestId !== user.uid && doc.id === requestId) {
        setRequestDetails(doc.data());
        setErrorMessage("");
        setRequestId("");
        scroll.scrollToBottom();
        foundUser = true;
        return;
      }

      //見つからなかった場合
      if (!foundUser && requestId === user.uid) {
        setRequestDetails(null);
        setErrorMessage("あなたのユーザーIDです");
        scroll.scrollToBottom();
      } else if (!foundUser) {
        setRequestDetails(null);
        setErrorMessage("ユーザーが見つかりません");
        scroll.scrollToBottom();
      }
    });
  };

  //承認待ちを取得
  const getPendingUser = async () => {
    const myId = user.uid;
    const pendingUserCollectionRef = collection(
      db,
      "user",
      myId,
      "friendRequest"
    );
    const querySnapshot = await getDocs(pendingUserCollectionRef);
    if (!querySnapshot.empty) {
      const pendingUserDetails = querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      setPendingUsers(pendingUserDetails);
    }
  };

  //フレンド一覧を取得
  const getFriendList = async () => {
    const myId = user.uid;
    const friendCollectionRef = collection(db, "user", myId, "friends");
    const querySnapshot = await getDocs(friendCollectionRef);
    if (!querySnapshot.empty) {
      const friendDetails = querySnapshot.docs.map((doc) => {
        return doc.data();
      });
      setFriendData(friendDetails);
    }
  };

  useEffect(() => {
    setIsMyPage(true);
    getPendingUser();
    getFriendList();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // 上側に寄せる
        gap: "18px",
      }}
    >
      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        プロフィール
      </Typography>
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
          marginTop: "0px",
          marginBottom: "30px",
          borderRadius: "8px",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between" // 均等に配置
          sx={{ width: "100%" }}
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
              ID:　{user.uid}
            </Typography>
          ) : (
            <></>
          )}

          <Button
            variant="outlined"
            sx={{
              textTransform: "none",
              border: "1px solid blue",
              fontSize: "16px",
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
            sx={{
              textTransform: "none",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#ffcccc",
                color: "#a00000",
              },
            }}
            onClick={handleUserDelete}
          >
            アカウント削除
          </Button>
        </Stack>
      </Paper>

      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        フレンド
      </Typography>

      {friendData ? (
        <>
          {friendData.map((data, index) => {
            return (
              <FriendCard key={index} friendDetails={data} myDetails={user} />
            );
          })}
        </>
      ) : (
        <div>
          <Alert
            severity="error"
            sx={{
              display: "flex",
              width: "50%",
              justifyContent: "center", // 横方向
              alignItems: "center", // 垂直方向
              margin: "auto",
              marginBottom: "40px",
            }}
          >
            フレンドはいません
          </Alert>
        </div>
      )}

      {pendingUsers && (
        <div>
          <Typography
            variant="h4"
            sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
          >
            承認待ち
          </Typography>

          {pendingUsers.map((data, index) => {
            return (
              <PendingRequestCard
                key={index}
                pendingUser={data}
                myDetails={user}
              />
            );
          })}
        </div>
      )}

      <Typography
        variant="h4"
        sx={{ marginTop: "25px", marginLeft: "80px", marginBottom: "18px" }}
      >
        フレンド申請
      </Typography>

      <form
        style={{
          display: "flex",
          marginBottom: "40px",
          width: "100%",
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
            background: "#fff",
            width: "40%",
          }}
          value={requestId}
          onChange={(e) => {
            setRequestId(e.target.value.trim());
          }}
        />
        <Button variant="contained" type="submit">
          <SearchIcon />
        </Button>
      </form>

      {requestDetails && (
        <RequestCard
          requestDetails={requestDetails}
          myDetails={user}
          setRequestDetails={setRequestDetails}
        />
      )}

      {errorMessage ? (
        <Alert
          severity="error"
          sx={{
            display: "flex",
            width: "50%",
            justifyContent: "center", // 横方向
            alignItems: "center", // 垂直方向
            margin: "auto",
            marginBottom: "40px",
            marginTop: "10px",
          }}
        >
          {errorMessage}
        </Alert>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyPage;
