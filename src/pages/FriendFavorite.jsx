import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { Paper, Typography, Avatar, Stack, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Alert from "@mui/material/Alert";

import { FriendPokemonCard } from "../components/FriendPokemonCard";

const FriendFavorite = ({ setIsMyPage }) => {
  const { MyId } = useParams();
  const { FriendId } = useParams();

  const [userProfile, setUserProfile] = useState();
  const [friendProfile, setFriendProfile] = useState();
  const [friendFavId, setFriendFavId] = useState([]);
  const [friendFavItems, setFriendFavItems] = useState([]);

  const getUserData = async () => {
    const profileDocRef = doc(db, "user", MyId);
    const profileData = await getDoc(profileDocRef);
    setUserProfile(profileData);
  }

  const getFriendData = async () => {
    const profileDocRef = doc(db, "user", FriendId);
    const profileData = await getDoc(profileDocRef);
    setFriendProfile(profileData.data());

    const favId = [];
    const favoriteCollectionRef = collection(profileDocRef, "favorite");
    const querySnapshot = await getDocs(favoriteCollectionRef)
    // const favId = querySnapshot.docs.map((doc) => {
    //   return doc.data().id
    // })
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favId.push(data.id)
    })
    console.log(favId)
    setFriendFavId(favId);
  }

  const fetchAPI = async (id) => {
    try {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error)
    }
  }
  const friendFavoriteList = async () => {
    try {
      const sortedID = friendFavId.sort((a, b) => a - b);
      console.log("sort", sortedID);
      const Items = await Promise.all(
        sortedID.map((id) => {
          return fetchAPI(id);
        })
      );
      // console.log(Items);
      setFriendFavItems(Items);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    setIsMyPage(true);
    getUserData();
    getFriendData();
    // friendFavoriteList();
  }, []);

  useEffect(() => {
    console.log("profile", friendProfile)
  }, [friendProfile])

  // useEffect(() => {
  //   console.log(frien)
  // }, [friendFavId])


  useEffect(() => {
    console.log("FavId", friendFavId)
    friendFavoriteList();
  }, [friendFavId])

  useEffect(() => {
    console.log("FavItems", friendFavItems)
  }, [friendFavItems])

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography variant="h3" sx={{ marginTop: "25px", marginLeft: "80px" }}>
        {friendProfile && <span>{friendProfile.email}</span>} のお気に入り
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
          marginTop: "30px",
          marginBottom: "40px",
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

          {friendProfile ? (
            <>
              <Typography variant="h5" component="div" sx={{ flex: 1 }}>
                {friendProfile.email}
              </Typography>
              <Typography variant="h6">ID: {friendProfile.id}</Typography>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Paper>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          justifyContent: "center",
        }}
      >
        {friendFavItems.length > 0 ? (
          friendFavItems.map((pokemon, index) => {
            return (
              <div
                key={index}
                style={{
                  flex: "1 1 20%", // % の幅で並べている（要調整）
                  maxWidth: "400px", // カードの最大幅
                  padding: "20px",
                }}
              >
                <FriendPokemonCard pokemon={pokemon} />
              </div>
            );
          })
        ) : (
          <Alert
            severity="error"
            sx={{
              display: "flex", // 必要なスタイルを追加
              width: "50%",
              justifyContent: "center", // 横方向に中央揃え
              alignItems: "center", // 垂直方向に中央揃え
              margin: "auto",
              marginBottom: "40px",
              marginTop: "10px"
            }}
          >
            お気に入りはありません
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FriendFavorite;
