import React from "react";
import { useNavigate } from "react-router";

import {
    Paper,
    Typography,
    Avatar,
    Stack,
    Button,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

import { db } from "../firebase";
import {
    doc,
    deleteDoc,
} from "firebase/firestore";
import FriendFavorite from "../pages/FriendFavorite";

export const FriendCard = ({ friendDetails, myDetails }) => {
    const myId = myDetails.uid;
    const friendId = friendDetails.id;

    const navigate = useNavigate();

    const deleteFriend = async () => {
        const myFriendsDocRef = doc(db, "user", myId, "friends", friendId);
        const friendFriendsDocRef = doc(db, "user", friendId, "friends", myId)

        await deleteDoc(myFriendsDocRef);
        await deleteDoc(friendFriendsDocRef);

        window.location.reload();
    }

    const ToFriendFavorite = () => {
        navigate(`/Favorite/${myId}/${friendId}`)
    }



    return (
        <div>
            <Paper
                elevation={3} // Paperの立体感を追加
                sx={{
                    width: "80%", // 横幅を画面の80%に設定
                    margin: "auto",
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: 3,
                    marginBottom: "30px",
                    gap: "15px",
                    borderRadius: "8px",
                }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between" // 均等に配置
                    sx={{
                        width: "100%",
                        padding: "10px",
                    }}
                >
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                        }}
                    >
                        <AccountCircle sx={{ fontSize: 100 }} />
                    </Avatar>

                    <Typography variant="h5" component="div" sx={{ flex: 1 }}>
                        {friendDetails.email}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flex: 1 }}>
                        ID:　{friendDetails.id}
                    </Typography>

                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: "none",
                            border: "1px solid blue",
                            fontSize: "20px",
                            "&:hover": {
                                border: "1px solid #a9a9a9",
                                backgroundColor: "#87cefa",
                            },
                        }}
                        onClick={ToFriendFavorite}
                    >
                        お気に入り一覧へ
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        sx={{
                            textTransform: "none",
                            fontSize: "20px",
                            "&:hover": {
                                backgroundColor: "#ffcccc",
                                color: "#a00000",
                            },
                        }}
                        onClick={deleteFriend}
                    >
                        フレンド削除
                    </Button>
                </Stack>
            </Paper>
        </div>
    );
};
