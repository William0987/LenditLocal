import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import TopBar from "../components/TopBar";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Avatar,
} from "@mui/material";
import Btn from "../components/Btn";
import UserContext from "../context/user";
import { useNavigate } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import CarouselItem from "../components/CarouselItem";
import jwtDecode from "jwt-decode";

const SignIn = (props) => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const fetchData = useFetch();
  const handleLogin = async () => {
    const res = await fetchData("/auth/login", "POST", { email, password });
    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      userCtx.setUserId(decoded);
      navigate("/profile");
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  const carouselItems = [
    {
      description: "Everything you need, from the neighbour next door",
      image_src: "homepage/1.png",
    },
    {
      description: "Loan or give away items",
      image_src: "homepage/2.png",
    },
    {
      description: "Get to know people in the community",
      image_src: "homepage/3.png",
    },
  ];

  return (
    <>
      <TopBar></TopBar>

      <Container maxWidth="lg">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <Grid container alignItems="center">
            <Grid xs={6}>
              <Carousel>
                {carouselItems.map((item, i) => (
                  <CarouselItem key={i} item={item} />
                ))}
              </Carousel>
            </Grid>
            <Grid
              xs={5}
              container
              direction="column"
              justifycontent="center"
              alignItems="center"
            >
              <Typography textAlign="center">Sign-in</Typography>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                defaultValue="test@test.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="outlined-basic"
                label="Password"
                type="password"
                variant="outlined"
                defaultValue="test1234"
                onChange={(e) => setPassword(e.target.value)}
              />

              <Btn variant="text" onClick={handleLogin}>
                Sign In
              </Btn>

              <Typography
                variant="subtitle"
                textAlign="start"
                margin="1rem 0"
                sx={{ fontSize: "12px" }}
              >
                No account?{" "}
                <Link
                  onClick={() => {
                    navigate("/registration");
                  }}
                  underline="always"
                >
                  Register
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;
