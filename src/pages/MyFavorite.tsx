import React, { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

import { PokemonCard } from "../components/PokemonCard";

import { Paper, Typography, Avatar, Stack } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Alert from "@mui/material/Alert";

type FavoriteItemData = {
  id: number;
};

type PokemonData = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
  sprites: {
    front_default: string;
    back_default: string | undefined;
  };
};

const MyFavorite = ({
  setIsMyPage,
}: {
  setIsMyPage: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  const user: User | null = auth.currentUser;
  const uid: string | undefined = user?.uid;

  const [favItems, setFavItems] = useState<PokemonData[]>([]);

  const getFavoriteId = async (): Promise<number[] | undefined> => {
    const favId: number[] = [];
    try {
      if (!uid) {
        return;
      }
      const querySnapshot = await getDocs(
        collection(db, "user", uid, "favorite")
      );
      querySnapshot.forEach((doc) => {
        const data: FavoriteItemData = doc.data() as FavoriteItemData;
        favId.push(data.id);
      });

      return favId;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApi = async (id: number): Promise<PokemonData | undefined> => {
    try {
      const apiURL = `https://pokeapi.co/api/v2/pokemon/${id}/`;
      const response = await fetch(apiURL);
      const data: PokemonData = (await response.json()) as PokemonData;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const favoriteList = async () => {
    try {
      const ID = await getFavoriteId();
      const sortedID = ID?.sort((a, b) => a - b);

      if (sortedID) {
        const Items: Array<PokemonData | undefined> = await Promise.all(
          sortedID.map((id) => {
            return fetchApi(id);
          })
        );
        setFavItems(Items.filter((item) => item !== undefined));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    favoriteList();
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
          width: "80%",
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
            お気に入りはありません
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MyFavorite;
