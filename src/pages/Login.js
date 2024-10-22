import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Divider,
  Grid,
  Link,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Facebook, Google } from "@mui/icons-material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `https://dev.duniadalamdigital.com/carifoto/php-service/LoginService.php`,
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.status === "success") {
        localStorage.setItem("token", data?.data?.token);
        navigate("/upload");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Failed to fetch");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    // const provider = new firebase.auth.GoogleAuthProvider();
    // try {
    //   const result = await firebase.auth().signInWithPopup(provider);
    //   // Setelah login sukses, bisa redirect
    //   navigate("/dashboard");
    // } catch (error) {
    //   setError("Google login failed. Please try again.");
    // }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    // const provider = new firebase.auth.FacebookAuthProvider();
    // try {
    //   const result = await firebase.auth().signInWithPopup(provider);
    //   // Setelah login sukses, bisa redirect
    //   navigate("/dashboard");
    // } catch (error) {
    //   setError("Facebook login failed. Please try again.");
    // }
  };

  // Handle Forgot Password
  const handleForgotPassword = () => {
    // Arahkan pengguna ke halaman pemulihan kata sandi
    navigate("/forgot-password");
  };

  const handleRegsiter = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" fontWeight="bold">
          LOGIN
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: "100%", maxWidth: "400px", marginTop: 5 }}
        >
          <InputLabel
            htmlFor="username"
            style={{ fontWeight: "bold", color: "black" }}
          >
            Username
          </InputLabel>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputLabel
            htmlFor="password"
            style={{ fontWeight: "bold", color: "black" }}
          >
            Password
          </InputLabel>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>

          {/* Login with Google and Facebook */}
          <Divider sx={{ my: 2 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<Google />}
            sx={{ mb: 1 }}
            onClick={handleGoogleLogin} // Assuming handleGoogleLogin function
          >
            Login with Google
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<Facebook />}
            onClick={handleFacebookLogin} // Assuming handleFacebookLogin function
          >
            Login with Facebook
          </Button>

          {/* Register Link */}
          <Grid container sx={{ mt: 2 }}>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={handleForgotPassword}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="" variant="body2" onClick={handleRegsiter}>
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
