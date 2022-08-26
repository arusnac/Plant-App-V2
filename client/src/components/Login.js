import React, { useState, useContext } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import { AccountContext } from "./Account";
import UserPool from "../UserPool";
import { useDispatch } from "react-redux";
import { toggleStatus } from "../redux/UserSlice";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate, useNavigate } from "react-router-dom";
import Nav from "./Nav";

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authenticate } = useContext(AccountContext);

  const onSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username");
    const password = data.get("password");
    authenticate(username, password)
      .then((data) => {
        console.log("Logged in!", data);
        dispatch(toggleStatus(true));
        setRedirect(true);
        setLoginError(false);
      })
      .catch((err) => {
        console.error("Failed to login", err);
        setLoginError(true);
      });
  };

  const redirectTo = () => {
    if (redirect) {
      return <Navigate to="/" />;
    }
  };

  const inputProps = { helperText: "error" };

  return (
    <>
      {redirectTo()}
      <Box
        sx={{
          display: "block",
          margin: 0,
          height: "100vh",
          backgroundImage: {
            md: "url(https://source.unsplash.com/RDE59yq9pRw/1920x1080)",
            xs: "url(https://source.unsplash.com/Sg7eWHKrxrA/640x960)",
          },
        }}
      >
        <Box
          sx={{
            height: "90vh",
            display: "flex",
            alignItems: "center",

            //flexDirection: { md: "row", xs: "column" },
            justifyContent: "center",
            margin: 0,
          }}
        >
          <div>
            <Box
              sx={{
                display: "flex",
                width: "340px",
                justifyContent: "center",
                textAlign: "center",
                flexDirection: "column",
              }}
            >
              <Typography
                mb={3}
                sx={{
                  fontWeight: "700",
                }}
              >
                Keep a digital collection of your plants, add notes, and track
                your watering.
              </Typography>
              <Typography mb={0}>
                Sign in or register an account to start your collection.
              </Typography>
              <Button
                sx={{ marginBottom: "20px" }}
                onClick={() => navigate(`/about`)}
              >
                Learn more
              </Button>
              <Box
                sx={{
                  width: "340px",
                  marginTop: 0,
                  borderTop: "solid",
                  borderWidth: "1px",
                  padding: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>

                <Box
                  component="form"
                  onSubmit={onSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    error={loginError}
                    helperText={
                      loginError ? "Incorrect username or passord" : ""
                    }
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item></Grid>
                    <Grid item>
                      <Link to="/SignUp">SignUp</Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </div>
          <div></div>
        </Box>
      </Box>
    </>
  );
};

export default Login;
