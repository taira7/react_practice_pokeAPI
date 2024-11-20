import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import "./App.css";
import { Header } from "./components/Header";
import { Loading } from "./pages/Loading";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import MyPage from "./pages/MyPage";
import MyFavorite from "./pages/MyFavorite";
import FriendFavorite from "./pages/FriendFavorite";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isMyPage, setIsMyPage] = useState(false);

  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
      //authStateの処理が終わるまで待機
      //他のページのcurrentUser獲得ができないため
      setAuthChecking(false);
    });

    return () => checkAuthState();
  }, []);

  if (authChecking) {
    return <Loading />; // 認証状態を確認中の間、ローディング表示
  }

  return (
    <BrowserRouter>
      <Header
        isAuth={isAuth}
        setIsAuth={setIsAuth}
        isMyPage={isMyPage}
        setIsMyPage={setIsMyPage}
      />
      <Routes>
        <Route path="/" element={<Home setIsMyPage={setIsMyPage} />} />
        <Route path="/SignIn" element={<SignIn setIsAuth={setIsAuth} />} />
        <Route path="/SignUp" element={<SignUp setIsAuth={setIsAuth} />} />
        <Route
          path="/MyPage"
          element={<MyPage isAuth={isAuth} setIsMyPage={setIsMyPage} />}
        />
        <Route
          path="/MyFavorite"
          element={<MyFavorite setIsMyPage={setIsMyPage} />}
        />
        <Route
          path="/Favorite/:MyId/:FriendId/"
          element={<FriendFavorite setIsMyPage={setIsMyPage} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
