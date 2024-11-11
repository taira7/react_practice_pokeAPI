import { useState, useEffect } from "react";

import { Box, TextField, Button, Typography, Container } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    //デフォルト動作の無効　送信時のリロードを止める
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        console.log(userCredential);

        setIsAuth(true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        minHeight: "83vh",
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
          //   marginTop: "100px", //3つのとき
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", width: "40%" }}
          onSubmit={handleSubmit}
        >
          {/* <TextField
            required
            id="username"
            label="User name"
            name="username"
            autoComplete="username"
            autoFocus
            fullWidth
            style={{
              marginTop: "40px",
              marginBottom: "20px",
            }}
          /> */}
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
            onChange={handleEmailChange}
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
            onChange={handlePasswordChange}
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
