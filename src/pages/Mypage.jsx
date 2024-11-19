import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { animateScroll as scroll } from "react-scroll";

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

import { auth, db } from "../firebase.js";
import { signOut, deleteUser, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { RequestCard } from "../components/RequestCard.jsx";
import { PendingRequestCard } from "../components/PendingRequestCard.jsx";
import { FriendCard } from "../components/FriendCard.jsx";

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
        // console.log("Sign-out successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeDB = async () => {
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "user", uid);

    const getUserDocRef = await getDoc(userDocRef);

    const favoriteCollectionRef = collection(userDocRef, "favorite");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(favoriteCollectionRef);
      // console.log("favorite");
      querySnapshot.forEach((favDoc) => {
        deleteDoc(doc(favoriteCollectionRef, favDoc.id));
      });
    }

    const requestCollectionRef = collection(userDocRef, "friendRequest");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(requestCollectionRef);
      querySnapshot.forEach((reqDoc) => {
        const friendId = reqDoc.id;
        // console.log("frirequest");
        deleteDoc(doc(db, "user", friendId, "friendRequest", uid));
      });
      querySnapshot.forEach((reqDoc) => {
        const friendId = reqDoc.id;
        // console.log("myrequest");
        deleteDoc(doc(db, "user", uid, "friendRequest", friendId));
      });
    }

    const friendsCollectionRef = collection(userDocRef, "friends");
    if (getUserDocRef.exists) {
      const querySnapshot = await getDocs(friendsCollectionRef);
      querySnapshot.forEach((Doc) => {
        const friendId = Doc.id;
        // console.log("friend", friendId);
        deleteDoc(doc(db, "user", friendId, "friends", uid));
      });
      querySnapshot.forEach((Doc) => {
        const friendId = Doc.id;
        // console.log("my", friendId);
        deleteDoc(doc(db, "user", uid, "friends", friendId));
      });
    }

    deleteDoc(userDocRef);
  };

  const handleUserDelete = () => {
    //userのドキュメントを
    //documentのIDを取得
    removeDB();

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

    let foundUser = false;

    querySnapshot.forEach((doc) => {
      if (requestId !== user.uid && doc.id === requestId) {
        setRequestDetails(doc.data());
        setErrorMessage("");
        setRequestId("");
        scroll.scrollToBottom();
        foundUser = true;
        return;
      }

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
        elevation={3} // Paperの立体感を追加
        sx={{
          width: "80%", // 横幅を画面の80%に設定
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
              justifyContent: "center", // 横方向に中央揃え
              alignItems: "center", // 垂直方向に中央揃え
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
            // console.log(requestId);
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
            display: "flex", // 必要なスタイルを追加
            width: "50%",
            justifyContent: "center", // 横方向に中央揃え
            alignItems: "center", // 垂直方向に中央揃え
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
