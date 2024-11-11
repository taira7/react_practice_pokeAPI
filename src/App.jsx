import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Mypage from "./pages/Mypage";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <BrowserRouter>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<Home isAuth={isAuth} />} />
        <Route path="/SignIn" element={<SignIn setIsAuth={setIsAuth} />} />
        <Route path="/SignUp" element={<SignUp setIsAuth={setIsAuth} />} />
        <Route path="/MyPage" element={<Mypage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
