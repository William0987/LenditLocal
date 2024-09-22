import React, { useContext, useState } from "react";
import TopBar from "../components/TopBar";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Container,
  Typography,
  Box,
  Avatar,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import UserContext from "../context/user";
import useFetch from "../hooks/useFetch";
import Btn from "../components/Btn";

const Settings = (props) => {
  const userCtx = useContext(UserContext);
  const userFullInfo = userCtx.userInfo;
  const [openUpdate, setOpenUpdate] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [district, setDistrict] = useState("");

  const fetchData = useFetch();

  // functions
  const handleOpenUpdate = () => {
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const updateUser = async (id) => {
    console.log(id);

    const userData = {
      display_name: name,
      biography: bio,
      mobile_number: number,
      email: email,
      location: [
        {
          district,
          postal_code: zip,
        },
      ],
    };
    const res = await fetchData(
      "/auth/accounts/" + id,
      "PATCH",
      userData,
      userCtx.accessToken
    );

    if (res.ok) {
      handleCloseUpdate();
      console.log("update succeeded");
      console.log(res.data);
    } else {
      console.log(res.data);
    }
  };

  //for image upload
  const [file, setFile] = useState();

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", userFullInfo._id);

    const res = await fetch(import.meta.env.VITE_SERVER + "/api/images", {
      method: "POST",
      headers: {},
      body: formData,
    });
    const data = await res.json();

    let returnValue = {};
    if (res.ok) {
      if (data.status === "error") {
        returnValue = { ok: false, data: data.msg };
      } else {
        returnValue = { ok: true, data };
      }
    } else {
      if (data?.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((item) => item.msg);
        returnValue = { ok: false, data: messages };
      } else if (data?.status === "error") {
        returnValue = { ok: false, data: data.message || data.msg };
      } else {
        console.log(data);
        returnValue = { ok: false, data: "An error has occurred" };
      }
    }

    return returnValue;
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <>
      <TopBar showBurger={true}></TopBar>

      <Container maxWidth="lg">
        <Box>
          <Typography variant="h5" textAlign="start" margin="2rem 0">
            Your Profile
          </Typography>
          <Grid container>
            <Grid xs={3}>
              <Avatar
                alt=""
                src={userCtx.userInfo.image_url}
                sx={{ width: 150, height: 150 }}
                display="flex"
                justifycontent="center"
              ></Avatar>
              <form onSubmit={submit} className="flex">
                <input
                  onChange={fileSelected}
                  type="file"
                  accept="image/*"
                ></input>

                <Btn type="submit">Update</Btn>
              </form>
            </Grid>
            <Grid xs={9}>
              <Typography textAlign="center"></Typography>
              <Box xs={2}>
                <Typography gutterBottom variant="h4">
                  Name :
                </Typography>
                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.display_name}
                </Typography>
              </Box>
              <Box xs={2}>
                <Typography gutterBottom variant="h4">
                  Email:
                </Typography>
                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.email}
                </Typography>
              </Box>
              <Box xs={2}>
                <Typography gutterBottom variant="h4">
                  Biography :
                </Typography>

                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.biography}
                </Typography>
              </Box>
              <Box xs={2}>
                <Typography gutterBottom variant="h4">
                  Mobile Number :
                </Typography>
                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.mobile_number}
                </Typography>
              </Box>
              <Box xs={2}>
                <Typography gutterBottom variant="h4">
                  Locations :
                </Typography>
                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.location[0].district}
                </Typography>
                <Typography gutterBottom variant="h6">
                  {userCtx.userInfo.location[0].postal_code}
                </Typography>
              </Box>
              <Btn
                startIcon={<ModeEditOutlineOutlinedIcon />}
                onClick={handleOpenUpdate}
              >
                Update Profile
              </Btn>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Update User Profile</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 3, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <Box xs={2}>
                <Typography>Name :</Typography>
                <TextField
                  onChange={(e) => setName(e.target.value)}
                ></TextField>
              </Box>
              <Box xs={2}>
                <Typography>Email:</Typography>
                <TextField
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>
              </Box>
              <Box xs={2}>
                <Typography>Biography :</Typography>

                <TextField onChange={(e) => setBio(e.target.value)}></TextField>
              </Box>
              <Box xs={2}>
                <Typography>Mobile Number :</Typography>
                <TextField
                  onChange={(e) => setNumber(e.target.value)}
                ></TextField>
              </Box>
              <Box xs={2}>
                <Typography>Locations :</Typography>
                <TextField
                  onChange={(e) => setDistrict(e.target.value)}
                ></TextField>
                <TextField onChange={(e) => setZip(e.target.value)}></TextField>
              </Box>
            </Box>
          </DialogContentText>

          <DialogActions>
            <Btn onClick={handleCloseUpdate} isBrown={true}>
              Cancel
            </Btn>
            <Btn onClick={updateUser} id="edit">
              Confirm
            </Btn>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;
