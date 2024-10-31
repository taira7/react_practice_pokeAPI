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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const PopupCard = ({ details, open, handleClose }) => {
  let pokemonTypes = details.types;
  const [pokemonImage, setPokemonImage] = useState(true);

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
        sx: { width: "60%", height: "85%", margin: "auto" }, //中央に配置
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // 画像を中央に配置
        }}
      >
        {pokemonImage ? (
          <img src={details.sprites.front_default} width="80%" height="71%" />
        ) : (
          <img src={details.sprites.back_default} width="80%" height="71%" />
        )}
        <DialogTitle>{details.name}</DialogTitle>
        {pokemonTypes.map((data, i) => {
          if (pokemonTypes.length === 2) {
            return (
              <DialogContentText key={i}>
                Type{i + 1}: {data.type.name}
              </DialogContentText>
            );
          } else if (pokemonTypes.length === 1) {
            return (
              <div key={i}>
                <DialogContentText>
                  Type{i + 1}: {data.type.name}
                </DialogContentText>
                {/* 全角空白は空欄表示用 */}
                <DialogContentText key="empty">　</DialogContentText>
              </div>
            );
          }
        })}
        <DialogContentText>weight: {details.weight}</DialogContentText>
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
        <Button onClick={handleClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  );
};
