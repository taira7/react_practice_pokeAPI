import { useState } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { pink } from "@mui/material/colors";

import { PopupCard } from "./PopupCard";

export const PokemonCard = ({ pokemon }) => {
  let pokemonTypes = pokemon.types;
  let details = pokemon;

  const [open, setOpen] = useState(false);

  const [favorite, setFavorite] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ maxWidth: 360 }}>
      <CardActionArea onClick={handleClickOpen}>
        <CardMedia
          component="img"
          // height="295"
          height="200px"
          image={pokemon.sprites.front_default}
          alt="image"
        />
        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              marginRight: "100px",
              cursor: "pointer",
            }}
          >
            {favorite ? (
              <FavoriteIcon sx={{ fontSize: 30, color: pink[500] }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 30, color: pink[500] }} />
            )}
          </div>

          <Typography gutterBottom variant="h5" component="div">
            {pokemon.name}
          </Typography>
          {/* 全角空白は空欄表示用 */}
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
                <Typography key={i}>
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
                </Typography>
              );
            } else if (pokemonTypes.length === 1) {
              return (
                <div key={i}>
                  <Typography key={i}>
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
                  </Typography>
                  <Typography key="empty">　</Typography>
                </div>
              );
            }
          })}
        </CardContent>
      </CardActionArea>
      <PopupCard
        open={open}
        handleClose={handleClose}
        details={details}
        favorite={favorite}
        setFavorite={setFavorite}
      />
    </Card>
  );
};
