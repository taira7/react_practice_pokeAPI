import { useState, useEffect } from "react";
import "./App.css";
import { Header } from "./components/Header";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Mypage from "./pages/Mypage";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  // const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      // setAuthChecking(false); // 認証チェック完了
    });

    //クリーンアップ関数
    return () => checkAuthState();
  }, []);

  // if (authChecking) {
  //   return <div>Loading...</div>; // 認証状態を確認中の間、ローディング表示
  // }

  return (
    <BrowserRouter>
      <Header isAuth={isAuth} setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignIn setIsAuth={setIsAuth} />} />
        <Route path="/SignUp" element={<SignUp setIsAuth={setIsAuth} />} />
        <Route path="/MyPage" element={<Mypage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
