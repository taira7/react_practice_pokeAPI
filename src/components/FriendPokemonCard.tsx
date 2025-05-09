import { useState } from "react";

import { FriendPopupCard } from "./FriendPopUpCard";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { pink } from "@mui/material/colors";

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

export const FriendPokemonCard = ({ pokemon }: { pokemon: PokemonData }) => {
  const [open, setOpen] = useState(false);

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
            <FavoriteIcon sx={{ fontSize: 30, color: pink[500] }} />
          </div>

          <Typography gutterBottom variant="h5" component="div">
            {pokemon.name}
          </Typography>
          {/* 全角空白は空欄表示用 */}
          {pokemon.types.map((data, i) => {
            const typeColors: { [key: string]: string } = {
              normal: "#C1C2C1",
              fighting: "#D67873",
              flying: "#C6B7F5",
              poison: "#C183C1",
              ground: "#E0C068",
              rock: "#D1C17D",
              bug: "#A8B820",
              ghost: "#A292BC",
              steel: "#B8B8D0",
              fire: "#F08030",
              water: "#6890F0",
              grass: "#A7DB8D",
              electric: "#F8D030",
              psychic: "#FA92B2",
              ice: "#BCE6E6",
              dragon: "#A27DFA",
              dark: "#A29288",
              fairy: "#F5A2F5",
              stellar: "#7cc7b2",
              unknown: "#FFDC52",
            };

            if (pokemon.types.length === 2) {
              return (
                <Typography key={i}>
                  Type {i + 1}:
                  <span
                    style={{
                      backgroundColor: typeColors[data.type.name],
                      padding: "4px",
                      borderRadius: "4px",
                    }}
                  >
                    {data.type.name}
                  </span>
                </Typography>
              );
            } else if (pokemon.types.length === 1) {
              return (
                <div key={i}>
                  <Typography key={i}>
                    Type {i + 1}:
                    <span
                      style={{
                        backgroundColor: typeColors[data.type.name],
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
      <FriendPopupCard
        open={open}
        handleClose={handleClose}
        details={pokemon}
      />
    </Card>
  );
};
