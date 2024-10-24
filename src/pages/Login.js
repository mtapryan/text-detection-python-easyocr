import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Grid,
  Link,
  InputLabel,
  // Divider,
} from "@mui/material";
// import { Facebook, Google } from "@mui/icons-material";
// import { GoogleLogin } from "react-google-login";
// import FacebookLogin from "react-facebook-login";
import axios from "axios";
import fotocapLogo from "../assets/fotocap2-horizontal.png";

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
      console.log("[data Login] : ", data);
      if (data.status === "success") {
        const responseInfo = await axios.get(
          `https://dev.duniadalamdigital.com/carifoto/php-service/InfoService.php`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${data?.data?.token}`,
            },
          }
        );
        const dataInfo = responseInfo.data;
        console.log("[data Info] : ", dataInfo);
        if (dataInfo.status === "success") {
          localStorage.setItem("info", JSON.stringify(dataInfo?.data));
          localStorage.setItem("token", data?.data?.token);
          navigate("/");
        } else {
          setError("Salah username, email atau password");
        }
      } else {
        setError("Salah username, email atau password");
      }
    } catch (error) {
      console.error("[Error Login] : ", error);
      setError("Kesalahan Sistem atau Server");
    }
  };

  /* const handleGoogleLoginSuccess = async (response) => {
    console.log("Google login success:", response);
    const { tokenId } = response;
    try {
      const res = await axios.post(
        `https://dev.duniadalamdigital.com/carifoto/php-service/GoogleLoginService.php`,
        { tokenId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (data.status === "success") {
        localStorage.setItem("info", data?.data);
        localStorage.setItem("token", data?.data?.token);
        navigate("/");
      } else {
        setError("Google login failed");
      }
    } catch (error) {
      console.error("[Error Google Login] : ", error);
      setError("Kesalahan Sistem atau Server");
    }
  }; */

  /* const handleGoogleLoginFailure = (response) => {
    console.error("Google login failed:", response);
    setError("Google login failed");
  }; */

  /* const handleFacebookLoginSuccess = async (response) => {
    console.log("Facebook login success:", response);
    const { accessToken, userID } = response;
    try {
      const res = await axios.post(
        `https://dev.duniadalamdigital.com/carifoto/php-service/FacebookLoginService.php`,
        { accessToken, userID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (data.status === "success") {
        localStorage.setItem("info", data?.data);
        localStorage.setItem("token", data?.data?.token);
        navigate("/");
      } else {
        setError("Facebook login failed");
      }
    } catch (error) {
      console.error("[Error Facebook Login] : ", error);
      setError("Kesalahan Sistem atau Server");
    }
  }; */

  /* const handleFacebookLoginFailure = (response) => {
    console.error("Facebook login failed:", response);
    setError("Facebook login failed");
  }; */

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegsiter = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={fotocapLogo}
          alt="FotoCap Logo"
          sx={{ height: 50, mt: 2, mb: 2 }}
          onClick={() => navigate("/")}
        />
        <Typography variant="h7" sx={{ fontWeight: "bold" }}>
          {`Ayo, temukan foto terbaikmu disini`}
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
            inputProps={{
              required: true,
              "data-required-error": "Mohon tidak kosong kolom ini",
            }}
            onInvalid={(e) =>
              e.target.setCustomValidity(e.target.dataset.requiredError)
            }
            onInput={(e) => e.target.setCustomValidity("")}
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
            inputProps={{
              required: true,
              "data-required-error": "Mohon tidak kosong kolom ini",
            }}
            onInvalid={(e) =>
              e.target.setCustomValidity(e.target.dataset.requiredError)
            }
            onInput={(e) => e.target.setCustomValidity("")}
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

          {/* <Divider sx={{ my: 2 }}>OR</Divider> */}

          {/* <GoogleLogin
            clientId="YOUR_GOOGLE_CLIENT_ID"
            buttonText="Login with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            cookiePolicy={"single_host_origin"}
            render={(renderProps) => (
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<Google />}
                sx={{ mb: 1 }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Login Google
              </Button>
            )}
          />

          <FacebookLogin
            appId="YOUR_FACEBOOK_APP_ID"
            autoLoad={false}
            fields="name,email,picture"
            callback={handleFacebookLoginSuccess}
            onFailure={handleFacebookLoginFailure}
            render={(renderProps) => (
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<Facebook />}
                onClick={renderProps.onClick}
              >
                Login Facebook
              </Button>
            )}
          /> */}

          <Grid container sx={{ mt: 2 }}>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={handleForgotPassword}>
                {`Lupa password?`}
              </Link>
            </Grid>
            <Grid item>
              <Link href="" variant="body2" onClick={handleRegsiter}>
                {"Belum punya akun? Daftar disini"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
