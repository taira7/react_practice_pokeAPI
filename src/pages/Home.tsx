import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import { PokemonCard } from "../components/PokemonCard";

import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type PokeApiResponse = {
  results: Array<{ url: string }>;
};

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

const Home = ({
  setIsMyPage,
}: {
  setIsMyPage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonData[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/SignIn");
      }
    });
  }, []);

  const apiLimit: number = 24; //カード数 2,3,4の公倍数がいい？
  const apiURL: string = `https://pokeapi.co/api/v2/pokemon?limit=${apiLimit}&offset=${offset}`;

  const getDetail = async (url: string): Promise<PokemonData | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }
      const data: PokemonData = (await response.json()) as PokemonData;
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const loadDetail = async (pokeData: { url: string }[]) => {
    const pokemonRecord: (PokemonData | null)[] = await Promise.all(
      pokeData.map((data) => {
        return getDetail(data.url);
      })
    );
    //nullを除去
    setPokemonDetails(
      pokemonRecord.filter((pokemon) => pokemon !== null) as PokemonData[]
    );
  };

  const fetchApi = async () => {
    try {
      const response = await fetch(apiURL);
      if (!response.ok) {
        throw new Error(`レスポンスステータス: ${response.status}`);
      }

      const data: PokeApiResponse = (await response.json()) as PokeApiResponse;
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //デフォルト動作の無効 送信時のリロードを止める
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

  useEffect(() => {
    fetchApi();
  }, [offset]);

  return (
    <div
      style={{
        backgroundColor: "#fffaf0",
        minHeight: "100vh", // 画面全体の高さ
        minWidth: "98vw", //横スクロールバー発生対策で98vw 縦スクロールバーの幅も含めて計算するらしい
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
                  maxWidth: "400px",
                  padding: "20px",
                }}
              >
                {/* key属性割り振りで再レンダリングされる */}
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
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
