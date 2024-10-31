import React from "react";
import { useState, useEffect } from "react";
import { PokemonCard } from "./components/PokemonCard";

import { Header } from "./components/Header";

// import Grid from "@mui/material/Grid";　非推奨？
import Grid from "@mui/material/Grid2";

const App = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [offset, setOffset] = useState(0);

  let apiURL = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;

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
    setPokemonDetails(pokemonRecord);
  };

  const upOffset = () => {
    setOffset(offset + 20);
  };

  const downOffset = () => {
    if (offset > 19) {
      setOffset(offset - 20);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  useEffect(() => {
    console.log(pokemonDetails);
  }, [pokemonDetails]);

  useEffect(() => {
    fetchApi();
    console.log("offset", offset);
  }, [offset]);

  return (
    <div>
      <Header />
      <button onClick={downOffset}>down</button>
      <button onClick={upOffset}>up</button>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {pokemonDetails.map((pokemon, index) =>
          pokemon ? (
            <Grid key={index} size={{ xs: 6, sm: 4, md: 3, lg: 3 }}>
              <PokemonCard props={pokemon} />
            </Grid>
          ) : null
        )}
      </Grid>
      <button onClick={downOffset}>down</button>
      <button onClick={upOffset}>up</button>
    </div>
  );
};

export default App;
