import { useState, useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import { PokemonCard } from "../components/PokemonCard";

import { Paper, Typography, Avatar, Stack, Button } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

const MyFavorite = ({ setIsMyPage }) => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  //uid　はdbからとってくる
  const user = auth.currentUser;
  const uid = user.uid;

  const apiLimit = 2000;
  const offset = 0;
  let apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${apiLimit}&offset=${offset}`;

  const [favItems, setFavItems] = useState([]);

  const getDetail = async (url) => {
    try {
      const response = await fetch(url.url);
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const loadDetail = async (pokeData) => {
    const pokemonRecord = await Promise.all(
      pokeData.map((data) => {
        return getDetail(data);
      })
    );

    const Item = [];
    const querySnapshot = await getDocs(
      collection(db, "user", uid, "favorite")
    );

    pokemonRecord.map((data) => {
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (data && docData) {
          if (data.id == docData.id) {
            Item.push(data);
          }
        }
      });
    });
    setFavItems(Item);
  };

  const fetchApi = async () => {
    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }

      const data = await response.json();
      loadDetail(data.results);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApi();
    setIsMyPage(false);
  }, []);

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
      <Typography variant="h3" sx={{ marginTop: "25px", marginLeft: "80px" }}>
        お気に入り
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

          {user ? (
            <Typography variant="h5" component="div" sx={{ flex: 1 }}>
              {user.email}
            </Typography>
          ) : (
            <></>
          )}
          <Typography variant="h6">ID: {uid}</Typography>
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
        {favItems.length > 0 ? (
          favItems.map((pokemon, index) => {
            return (
              <div
                key={index}
                style={{
                  flex: "1 1 20%", // % の幅で並べている（要調整）
                  maxWidth: "400px", // カードの最大幅
                  padding: "20px",
                }}
              >
                <PokemonCard pokemon={pokemon} />
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MyFavorite;
