import React, { useState, useEffect, SetStateAction } from "react";
import { useNavigate, useParams } from "react-router";

import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { FriendPokemonCard } from "../components/FriendPokemonCard";
import PermissionError from "./PermissionError";

import { Paper, Typography, Avatar, Stack } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import Alert from "@mui/material/Alert";

type UserProfile = {
  email: string;
  id: string;
};

type FavoriteData = {
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

const FriendFavorite = ({
  setIsMyPage,
}: {
  setIsMyPage: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { MyId } = useParams();
  const { FriendId } = useParams();

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [friendProfile, setFriendProfile] = useState<UserProfile>();
  const [friendFavId, setFriendFavId] = useState<number[]>([]);
  const [friendFavItems, setFriendFavItems] = useState<PokemonData[]>([]);

  const navigate = useNavigate();

  const currentUserId: string | undefined = auth.currentUser?.uid;

  const getUserData = async () => {
    if (!MyId) {
      return;
    }
    const profileDocRef = doc(db, "user", MyId);
    const profileData = await getDoc(profileDocRef);
    const myProfileData: UserProfile = profileData.data() as UserProfile;
    setUserProfile(myProfileData);
  };

  const getFriendData = async () => {
    if (!FriendId) {
      return;
    }
    const profileDocRef = doc(db, "user", FriendId);
    const profileData = await getDoc(profileDocRef);
    const friendProfileData: UserProfile = profileData.data() as UserProfile;
    setFriendProfile(friendProfileData);

    const favId: number[] = [];
    const favoriteCollectionRef = collection(profileDocRef, "favorite");
    const querySnapshot = await getDocs(favoriteCollectionRef);
    querySnapshot.forEach((doc) => {
      const data: FavoriteData = doc.data() as FavoriteData;
      favId.push(data.id);
    });
    setFriendFavId(favId);
  };

  const fetchAPI = async (id: number): Promise<PokemonData | undefined> => {
    try {
      const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
      const response = await fetch(apiUrl);
      const data: PokemonData = (await response.json()) as PokemonData;
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const friendFavoriteList = async () => {
    try {
      const sortedID = friendFavId.sort((a, b) => a - b);
      const Items: Array<PokemonData | undefined> = await Promise.all(
        sortedID.map((id: number) => {
          return fetchAPI(id);
        })
      );
      setFriendFavItems(Items.filter((item) => item !== undefined));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsMyPage(false);
    getUserData();
    getFriendData();

    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  useEffect(() => {
    friendFavoriteList();
  }, [friendFavId]);

  if (userProfile) {
    if (currentUserId !== MyId) {
      return <PermissionError />;
    }
  }

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
        {friendProfile && <span>{friendProfile.email}</span>} のお気に入り
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

export default FriendFavorite;
