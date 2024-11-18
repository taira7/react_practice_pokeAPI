import { useState, useEffect } from "react";
import { PokemonCard } from "../components/PokemonCard";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import { Typography } from "@mui/material";

const Home = ({ setIsMyPage }) => {
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [offset, setOffset] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  //   console.log("currentUser", auth.currentUser);

  const apiLimit = 24; //カード数 2,3,4の公倍数がいい？
  let apiURL = `https://pokeapi.co/api/v2/pokemon?limit=${apiLimit}&offset=${offset}`;

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

  const upOffset = () => {
    setOffset(offset + apiLimit);
  };

  const downOffset = () => {
    if (offset > apiLimit - 1) {
      setOffset(offset - apiLimit);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event) => {
    //デフォルト動作の無効　送信時のリロードを止める
    event.preventDefault();

    const num = parseInt(inputValue, 10);
    if (num > 0 && num < 56) {
      setOffset(num * apiLimit - apiLimit);
    }
    setInputValue("");
  };

  useEffect(() => {
    fetchApi();
    setIsMyPage(false);
  }, []);

  //   useEffect(() => {
  //     console.log(pokemonDetails);
  //   }, [pokemonDetails]);

  useEffect(() => {
    fetchApi();
    console.log("offset=", offset);
  }, [offset]);

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        minHeight: "100vh", // 画面全体の高さ
        minWidth: "98vw", //横スクロールバー発生対策で98vw　縦スクロールバーの幅も含めて計算するらしい？
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: 1 }}>
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
              label="ページ番号を入力 (1〜55)"
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="page number (1〜55)"
              sx={{ width: "300px", height: "55px" }}
              style={{ backgroundColor: "#ffffff" }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{ width: "30px", height: "53px" }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </Button>
          </form>
          <Typography>p.{offset / apiLimit + 1}</Typography>
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
              前へ
            </Button>
            <Button variant="contained" onClick={upOffset}>
              次へ
            </Button>
          </div>
        </div>

        {/* レスポンシブ未対応 */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          {pokemonDetails.map((pokemon, index) =>
            pokemon ? (
              <div
                key={index}
                style={{
                  flex: "1 1 20%", // % の幅で並べている（要調整）
                  maxWidth: "400px", // カードの最大幅
                  padding: "20px",
                }}
              >
                {/* key属性割り振りで再レンダリングされる */}
                <PokemonCard key={pokemon.id} pokemon={pokemon} offset={offset} />
              </div>
            ) : null
          )}
        </div>

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
            前へ
          </Button>
          <Button variant="contained" onClick={upOffset}>
            次へ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
