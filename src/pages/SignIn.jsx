import { useState, useEffect } from "react";

import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Alert from "@mui/material/Alert";

import { Link, useNavigate } from "react-router-dom";

import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const SignIn = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then(() => {
        console.log(auth.currentUser);
        setIsAuth(true);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error message: Incorrect email address or password");
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
          Sign In
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
            Sign In
          </Button>
        </Box>
        <Link to="/SignUp" style={{ marginTop: "20px" }}>
          Create an account
        </Link>
      </Container>
    </div>
  );
};

export default SignIn;
