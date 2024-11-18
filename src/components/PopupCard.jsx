import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Fab from "@mui/material/Fab";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { pink } from "@mui/material/colors";

import { auth, db } from "../firebase";
import {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PopupCard = ({
  details,
  open,
  handleClose,
  favorite,
  setFavorite,
}) => {
  const [pokemonImage, setPokemonImage] = useState(true);

  //documentの自動生成id 削除に使用
  const [docAutoId, setDocAutoId] = useState("");

  const handleImageChange = () => {
    if (pokemonImage == true) {
      setPokemonImage(false);
    } else {
      setPokemonImage(true);
    }
  };

  //タイプ 配列
  const pokemonTypes = details.types;

  const weight = (parseInt(details.weight) / 10).toFixed(1);
  const height = (parseInt(details.height) / 10).toFixed(1);

  const image_front = `${details.sprites.front_default}`;
  const image_back = `${details.sprites.back_default}`;

  const handleFavIconClick = () => {
    if (!favorite) {
      setFavorite(true);
      saveFav();
    } else {
      setFavorite(false);
      removeFav(docAutoId);
    }
  };

  const getFavData = async () => {
    const uid = auth.currentUser.uid;
    // console.log(auth.currentUser);

    const userDocRef = doc(db, "user", uid);
    const favoriteCollectionRef = collection(userDocRef, "favorite");

    const getUserDocRef = await getDoc(userDocRef);
    if (!getUserDocRef.empty) {
      const querySnapshot = await getDocs(favoriteCollectionRef);
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        // console.log(data);
        if (data.id === details.id) {
          console.log("data.id:", data.id, "===", "details.id:", details.id);
          setFavorite(true);

          //documentの自動生成id
          setDocAutoId(doc.id);
        }
      });
    }
  };

  const saveFav = async () => {
    //ドキュメントの追加のみ 上書きされるので サブコレクションを使用する

    const uid = auth.currentUser.uid;

    const data = {
      id: details.id,
    };

    //documentのパス
    const userDocRef = doc(db, "user", uid); //uidがドキュメントのid
    //SubCollectionのパス
    const favoriteCollectionRef = collection(userDocRef, "favorite");

    //userCollection， uidDocument, favoriteSubCollectionがなければ自動生成される
    //あればSubCollectionにdocumentを追加

    await addDoc(favoriteCollectionRef, data); //自動id
    getFavData();
  };

  const removeFav = async (autoId) => {
    const uid = auth.currentUser.uid;

    const userDocRef = doc(db, "user", uid);
    const favoriteCollectionRef = collection(userDocRef, "favorite");

    const favDocRef = doc(favoriteCollectionRef, autoId);
    await deleteDoc(favDocRef);

    getFavData();
  };

  useEffect(() => {
    getFavData();
  }, []);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        sx: { width: "60%", height: "90%", margin: "auto" }, //中央に配置
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 画像を中央に配置
        }}
      >
        {/* 画像　表裏　切替 */}
        {pokemonImage ? (
          <img src={image_front} width="80%" height="63%" />
        ) : (
          <img src={image_back} width="80%" height="63%" />
        )}

        {/* お気に入りアイコン */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          {favorite ? (
            <FavoriteIcon
              sx={{ fontSize: 30, color: pink[500] }}
              onClick={handleFavIconClick}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{ fontSize: 30, color: pink[500] }}
              onClick={handleFavIconClick}
            />
          )}
        </div>

        {/* ポケモンの名前 */}
        <DialogTitle>{details.name}</DialogTitle>

        {/* タイプ */}
        {pokemonTypes.map((data, i) => {
          let typeColor = "";

          if (data.type.name == "normal") {
            typeColor = "#C1C2C1";
          } else if (data.type.name == "fighting") {
            typeColor = "#D67873";
          } else if (data.type.name == "flying") {
            typeColor = "#C6B7F5";
          } else if (data.type.name == "poison") {
            typeColor = "#C183C1";
          } else if (data.type.name == "ground") {
            typeColor = "#E0C068";
          } else if (data.type.name == "rock") {
            typeColor = "#D1C17D";
          } else if (data.type.name == "bug") {
            typeColor = "#A8B820";
          } else if (data.type.name == "ghost") {
            typeColor = "#A292BC";
          } else if (data.type.name == "steel") {
            typeColor = "#B8B8D0";
          } else if (data.type.name == "fire") {
            typeColor = "#F08030";
          } else if (data.type.name == "water") {
            typeColor = "#6890F0";
          } else if (data.type.name == "grass") {
            typeColor = "#A7DB8D";
          } else if (data.type.name == "electric") {
            typeColor = "#F8D030";
          } else if (data.type.name == "psychic") {
            typeColor = "#FA92B2";
          } else if (data.type.name == "ice") {
            typeColor = "#BCE6E6";
          } else if (data.type.name == "dragon") {
            typeColor = "#A27DFA";
          } else if (data.type.name == "dark") {
            typeColor = "#A29288";
          } else if (data.type.name == "fairy") {
            typeColor = "#F5A2F5";
          } else if (data.type.name == "stellar") {
            typeColor = "#7cc7b2";
          } else if (data.type.name == "unknown") {
            //うとうと色
            typeColor = "#FFDC52";
          }

          if (pokemonTypes.length === 2) {
            return (
              <DialogContentText key={i}>
                Type {i + 1}:
                <span
                  style={{
                    backgroundColor: typeColor,
                    padding: "4px",
                    borderRadius: "4px",
                  }}
                >
                  {data.type.name}
                </span>
              </DialogContentText>
            );
          } else if (pokemonTypes.length === 1) {
            return (
              <div key={i}>
                <DialogContentText>
                  Type {i + 1}:
                  <span
                    style={{
                      backgroundColor: typeColor,
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {data.type.name}
                  </span>
                </DialogContentText>
                {/* 全角空白は空欄表示用 */}
                <DialogContentText key="empty">　</DialogContentText>
              </div>
            );
          }
        })}

        <DialogContentText>height: {height}m</DialogContentText>
        <DialogContentText>weight: {weight}kg</DialogContentText>
        {/* kg ?　確認 */}
        <Fab
          size="small"
          color="secondary"
          aria-label="change"
          onClick={handleImageChange}
        >
          <AutorenewRoundedIcon />
        </Fab>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>close</Button>
      </DialogActions>
    </Dialog>
  );
};
