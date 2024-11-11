import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Mypage = ({ isAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    //レンダリング中に遷移するのは非推奨らしいので， useEffect使用
    if (!isAuth) {
      navigate("/SignIn");
    }
  }, [isAuth]);
  return (
    <div>
      <div>Mypage</div>
      <p>aaa</p>
    </div>
  );
};

export default Mypage;
