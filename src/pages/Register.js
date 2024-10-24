import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Alert,
  MenuItem,
  InputLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import fotocapLogo from "../assets/fotocap2-horizontal.png";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    user_type: 1004, // Default value
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userTypes = [
    { value: 1001, label: "Admin" },
    { value: 1002, label: "Event Organizer" },
    { value: 1003, label: "Photographer" },
    { value: 1004, label: "Runner" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, fullname, email, phone, password, address, user_type } =
      formData;

    // Simple validation
    if (!username || !fullname || !email || !phone || !password || !address) {
      setError("Mohon lengkapi semua kolom data terlebih dahulu");
      setSuccess("");
    } else {
      try {
        const response = await axios.post(
          `https://dev.duniadalamdigital.com/carifoto/php-service/RegisterService.php`,
          {
            username,
            fullname,
            email,
            phone,
            password,
            address,
            user_type,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = response.data;
        const message = data.message;
        console.log("[data Login] : ", data);
        if (data.status === "success") {
          setError("");
          setSuccess(message || "Pendaftaran berhasil, silakan login");
          toast.success(`${message || "Pendaftaran berhasil, silakan login"}`, {
            onClose: () => navigate("/login"),
          });
        } else {
          setSuccess("");
          setError(message || "Email atau Username sudah terdaftar");
          toast.error(`${message || "Email atau Username sudah terdaftar"}`);
        }
      } catch (error) {
        console.error("[Error Login] : ", error);
        setError("Kesalahan Sistem atau Server");
        toast.error(`${"Kesalahan Sistem atau Server"}`);
      }
      
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingRight: 5,
        paddingLeft: 5,
        paddingBottom: 5,
        paddingTop: 0,
      }}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        style={{ width: "400px", marginLeft: isMobile ? 10 : 0}}
      />
      <Box
        component="img"
        src={fotocapLogo}
        alt="FotoCap Logo"
        sx={{ height: 50, mt: 2, mb: 2 }}
        onClick={() => navigate("/")}
      />
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {`Form Pendaftaran`}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel htmlFor="fullname">{`Nama Lengkap Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="email">{`Email Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="phone">{`Nomor Handphone Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor="address">{`Alamat Rumah Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Grid>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <InputLabel htmlFor="user_type">{`Anda Mendaftar Sebagai`}</InputLabel>
            <TextField
              select
              fullWidth
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
            >
              {userTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: "#CAD8EE",
              paddingRight: 2,
              paddingLeft: 2,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <InputLabel htmlFor="username">{`Username Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              mb: 6,
              backgroundColor: "#CAD8EE",
              paddingRight: 2,
              paddingLeft: 2,
              paddingBottom: 3,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
          >
            <InputLabel htmlFor="password">{`Password Anda`}</InputLabel>
            <TextField
              required
              fullWidth
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              inputProps={{
                required: true,
                "data-required-error": "Mohon tidak kosong kolom ini",
              }}
              onInvalid={(e) =>
                e.target.setCustomValidity(e.target.dataset.requiredError)
              }
              onInput={(e) => e.target.setCustomValidity("")}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid item xs={12}>
            {error && !success ? <Alert severity="error">{error}</Alert> : null}
            {success && !error ? (
              <Alert severity="success">{success}</Alert>
            ) : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {`Daftar Sekarang`}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => navigate("/login")} // Navigate to login page
            >
              {`Kembali ke Halaman Login`}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Register;
