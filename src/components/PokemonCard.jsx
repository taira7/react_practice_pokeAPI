import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

import { PopupCard } from "./PopupCard";

export const PokemonCard = ({ props }) => {
  let pokemonTypes = props.types;
  let details = props;

  const [open, setOpen] = React.useState(false);

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
          height="200"
          image={props.sprites.front_default}
          alt="image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          {/* 全角空白は空欄表示用 */}
          {pokemonTypes.map((data, i) => {
            if (pokemonTypes.length === 2) {
              return (
                <Typography key={i}>
                  　Type{i + 1}: {data.type.name}
                </Typography>
              );
            } else if (pokemonTypes.length === 1) {
              return (
                <div key={i}>
                  <Typography>
                    　Type{i + 1}: {data.type.name}
                  </Typography>
                  <Typography key="empty">　</Typography>
                </div>
              );
            }
          })}
        </CardContent>
      </CardActionArea>
      <PopupCard open={open} handleClose={handleClose} details={details} />
    </Card>
  );
};
