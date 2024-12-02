import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Alert from "@mui/material/Alert";

const SignUp = ({
  setIsAuth,
}: {
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    //デフォルト動作の無効 送信時のリロードを止める
    event.preventDefault();

    // Signed up
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuth(true);
        navigate("/");
      })
      .then(() => {
        const user: User | null = auth.currentUser;

        if (!user) {
          return;
        }

        const data = {
          id: user.uid,
          email: user.email,
        };

        const userDocRef = doc(db, "user", user.uid);
        setDoc(userDocRef, data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(`error: ${error}`);
      });
  };

  return (
    <div
      style={{
        minHeight: "87vh",
        minWidth: "100vw",
        backgroundColor: "#ffffff",
      }}
    >
      <Container
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
        }}
        style={{
          backgroundColor: "#ffffff",
          marginTop: "70px",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        {errorMessage ? (
          <Alert severity="error" sx={{ width: "38%" }}>
            {errorMessage}
          </Alert>
        ) : (
          <></>
        )}
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", width: "40%" }}
          onSubmit={handleSubmit}
        >
          <TextField
            required
            id="email"
            label="Email address"
            name="email"
            autoComplete="email"
            autoFocus
            fullWidth
            style={{
              marginTop: "40px",
              marginBottom: "20px",
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            required
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            fullWidth
            style={{
              marginBottom: "40px",
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ textTransform: "none" }}
          >
            Sign Up
          </Button>
        </Box>
        <Link to="/SignIn" style={{ marginTop: "20px" }}>
          Sign In
        </Link>
      </Container>
    </div>
  );
};

export default SignUp;
