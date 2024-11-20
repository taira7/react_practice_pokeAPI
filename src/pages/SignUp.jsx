import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import { Box, TextField, Button, Typography, Container } from "@mui/material";
import Alert from "@mui/material/Alert";

const SignUp = ({ setIsAuth }) => {
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

  const handleSubmit = async (e) => {
    //デフォルト動作の無効　送信時のリロードを止める
    e.preventDefault();

    // Signed up
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuth(true);
        navigate("/");
      })
      .then(() => {
        const user = auth.currentUser;

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
