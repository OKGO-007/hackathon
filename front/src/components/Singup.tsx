import React, { useState } from "react";
import {
  Avatar,
  Alert,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,

} from "@mui/material";
import { doc, setDoc } from "firebase/firestore"; // Firestore関連のインポート
import { db } from "./Firebase"; // Firestore設定をインポート
import { Link } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Authentication関連のインポート
import { useAuthContext } from "../context/useAuthContext";
import { auth } from "./Firebase"; // Firebase設定をインポート
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate(); // homeに遷移するために利用する

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // ユーザー登録処理
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("ユーザー登録成功", user);
      // ここでFirestoreにユーザー情報を保存する処理を追加できます
      navigate("/login"); // 成功時の処理(ページ遷移)
    } catch (error) {
      setError("ユーザー登録に失敗しました"); // エラーメッセージを設定
      console.error("ユーザー登録エラー", error);
    }
  };


//   try {
//     // ユーザー登録処理
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;
//     console.log("ユーザー登録成功", user);
  
//     // Firestoreにユーザー情報を保存
//     const userRef = doc(db, "users", user.uid); // ユーザーIDをドキュメントIDとして使用
//     await setDoc(userRef, {
//       email: user.email,
//       // 他のユーザー情報も必要に応じて追加
//     });
  
//     navigate("/login"); // 成功時の処理(ページ遷移)
//   } catch (error) {
//     // ... (エラー処理)
//   }

  return (
    <div>
      <Button component={Link} to="/" >Clicke</Button>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ユーザー登録
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: "success.main" }}
            >
              ユーザー登録
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default SignUp;
