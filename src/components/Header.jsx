import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { auth } from "../firebase.js";
import { signOut } from "firebase/auth";

export const Header = ({ isAuth, setIsAuth }) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setIsAuth(false);
        console.log("Sign-out successful");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <AppBar position="static" sx={{ width: "100%" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          PokemonAPI
        </Typography>
        {isAuth ? (
          <Button
            color="inherit"
            sx={{ textTransform: "none" }}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
};
