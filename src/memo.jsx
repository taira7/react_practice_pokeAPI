// // App.js
// import React, { useState, useEffect } from "react";
// import { PokemonCard } from "./components/PokemonCard";

// const App = () => {
//   const [allPokemon, setAllPokemon] = useState([]);
//   const [pokemonDetails, setPokemonDetails] = useState([]);

//   const apiURL = "https://pokeapi.co/api/v2/pokemon";

//   const fetchApi = async () => {
//     try {
//       const response = await fetch(apiURL);
//       if (!response.ok) {
//         throw new Error(`レスポンスステータス: ${response.status}`);
//       }

//       const data = await response.json();
//       loadDetail(data.results);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getDetail = async (url) => {
//     try {
//       const response = await fetch(url.url);
//       if (!response.ok) {
//         throw new Error(`レスポンスステータス: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.log(error);
//       return null;
//     }
//   };

//   const loadDetail = async (pokeData) => {
//     const pokemonRecord = await Promise.all(
//       pokeData.map((data) => getDetail(data))
//     );
//     setPokemonDetails(pokemonRecord.filter((item) => item !== null));
//   };

//   useEffect(() => {
//     fetchApi();
//   }, []);

//   return (
//     <div>
//       {pokemonDetails.map((pokemon, index) =>
//         pokemon ? <PokemonCard key={index} name={pokemon.name} /> : null
//       )}
//     </div>
//   );
// };

// export default App;

//pokemonCard.jsx
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { PopupCard } from "./PopupCard";

export const PokemonCard = ({ props }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let pokemonTypes = props.types;

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleClickOpen}>
        <CardMedia
          component="img"
          height="295"
          image={props.sprites.front_default}
          alt="image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {props.name}
          </Typography>
          {pokemonTypes.map((data, i) => (
            <p key={i}>{data.type.name}</p>
          ))}
        </CardContent>
      </CardActionArea>
      <PopupCard open={open} handleClose={handleClose} />
    </Card>
  );
};
