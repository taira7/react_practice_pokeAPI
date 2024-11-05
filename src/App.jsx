import React from "react";
import { useState, useEffect } from "react";
import { PokemonCard } from "./components/PokemonCard";

import { Header } from "./components/Header";

// import Grid from "@mui/material/Grid";　非推奨？
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const App = () => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [offset, setOffset] = useState(0);
  const [inputValue, setInputValue] = useState("");

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

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event) => {
    //デフォルト動作の無効　送信時のリロードを止める
    event.preventDefault();

    const num = parseInt(inputValue, 10);
    if (num > 0 && num < 67) {
      setOffset(num * 20 - 20);
    }
    setInputValue("");
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
      {/* <form onSubmit={handleInputSubmit}> */}
      {/* <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="page number (limit 65)"
        /> */}

      {/* <TextField
          id="outlined-number"
          label="page number (limit 65)"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="page number (limit 65)"
        />
        <Button variant="contained" type="submit">
          Go
        </Button>
      </form>
      <Button variant="contained" onClick={downOffset}>
        down
      </Button>
      <Button variant="contained" onClick={upOffset}>
        up
      </Button> */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleInputSubmit}
          style={{
            display: "flex",
            marginTop: "20px",
            gap: "8px",
          }}
        >
          <TextField
            id="outlined-number"
            label="page number (1〜66)"
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="page number (1〜66)"
            sx={{ width: "300px", height: "55px" }}
          />
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "30px", height: "55px" }}
          >
            Go
          </Button>
        </form>
        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "10px",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={downOffset}
            sx={{ backgroundColor: "#f50057" }}
          >
            down
          </Button>
          <Button variant="contained" onClick={upOffset}>
            up
          </Button>
        </div>
      </div>

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "20px",
          marginBottom: "40px",
        }}
      >
        <Button
          variant="contained"
          onClick={downOffset}
          sx={{ backgroundColor: "#f50057" }}
        >
          down
        </Button>
        <Button variant="contained" onClick={upOffset}>
          up
        </Button>
      </div>
    </div>
  );
};

export default App;
