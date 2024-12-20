import React, { useState } from "react";

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
import { pink } from "@mui/material/colors";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

type FriendPopUpCardProps = {
  details: PokemonData;
  open: boolean;
  handleClose: () => void;
};

export const FriendPopupCard: React.FC<FriendPopUpCardProps> = ({
  details,
  open,
  handleClose,
}) => {
  const [pokemonImage, setPokemonImage] = useState<boolean>(true);

  const handleImageChange = () => {
    if (pokemonImage == true) {
      setPokemonImage(false);
    } else {
      setPokemonImage(true);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      PaperProps={{
        sx: { width: "60%", height: "90%", margin: "auto" },
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 画像 表裏 切替 */}
        {pokemonImage ? (
          <img src={details.sprites.front_default} width="80%" height="63%" />
        ) : (
          <img src={details.sprites.back_default} width="80%" height="63%" />
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
          <FavoriteIcon sx={{ fontSize: 30, color: pink[500] }} />
        </div>

        {/* ポケモンの名前 */}
        <DialogTitle>{details.name}</DialogTitle>

        {/* タイプ */}
        {details.types.map((data, i) => {
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

          if (details.types.length === 2) {
            return (
              <DialogContentText key={i}>
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
              </DialogContentText>
            );
          } else if (details.types.length === 1) {
            return (
              <div key={i}>
                <DialogContentText>
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
                </DialogContentText>
                {/* 全角空白は空欄表示用 */}
                <DialogContentText key="empty">　</DialogContentText>
              </div>
            );
          }
        })}

        <DialogContentText>
          height: {(details.height / 10).toFixed(1)}m
        </DialogContentText>
        <DialogContentText>
          weight: {(details.weight / 10).toFixed(1)}kg
        </DialogContentText>
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
