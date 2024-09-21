import { React, useState } from "react";
import { Box, Typography, Divider, Snackbar, Alert } from "@mui/material";
import Btn from "./Btn";
import Avt from "./Avt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import useFetch from "../hooks/useFetch";

const TransactionDetails = (props) => {
  const fetchData = useFetch();
  const [open, setOpen] = useState(false);

  let content = "";

  //Functions

  //When user clicks "Accept", update transaction status to "accepted"
  const updateTxnStatus = async (newStatus) => {
    const res = await fetchData(
      "/api/transactions/" + props.selectedTxn._id,
      "PATCH",
      {
        status: newStatus,
      }
    );
    if (res.ok) {
      setOpen(true);
      props.setTransactionState(newStatus);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  //Close snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (props.txnToggle === "listings") {
    //content for user's listings
    if (props.transactionState === "pending_owner_response") {
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            {props.selectedTxn.requester_id.display_name} is interested in{" "}
            {props.selectedTxn.listing_id.title}. Accept this request? <br />
            <br />
            Once accepted, you will exchange mobile numbers to arrange a
            meet-up.
            <br />
            <br />
            Your mobile number: {props.selectedTxn.owner_id.mobile_number}
          </Typography>

          <Box sx={{ display: "flex", m: "0.5rem" }}>
            <Btn
              width={10}
              onClick={() => {
                updateTxnStatus("accepted");
              }}
            >
              Accept
            </Btn>
            <Btn
              isBrown={true}
              width={10}
              onClick={() => {
                updateTxnStatus("declined");
              }}
            >
              Decline
            </Btn>
          </Box>
        </Box>
      );
    } else if (props.transactionState === "accepted") {
      // Render content for the "accepted" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            You accepted {props.selectedTxn.requester_id.display_name}'s request
            for {props.selectedTxn.listing_id.title}.
            <br />
            <br />
            {props.selectedTxn.requester_id.display_name}'s contact number:{" "}
            {props.selectedTxn.requester_id.mobile_number}
            <br />
            <br />
            Arrange a meet-up with {
              props.selectedTxn.requester_id.display_name
            }{" "}
            directly.
          </Typography>

          <Box sx={{ display: "flex", m: "0.5rem" }}>
            <Btn
              width={15}
              onClick={() => {
                updateTxnStatus("completed");
              }}
            >
              Transaction Completed
            </Btn>
          </Box>

          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            You can exchange reviews once you have marked this transaction as
            complete.
          </Typography>
        </Box>
      );
    } else if (props.transactionState === "declined") {
      // Add content for the "declined" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            You declined {props.selectedTxn.requester_id.display_name}'s'
            request for {props.selectedTxn.listing_id.title}.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
            <Btn width={15}>View listing</Btn>
          </Box>
        </Box>
      );
    } else if (props.transactionState === "completed") {
      // Render content for the "completed" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="h2"
            component="div"
            display="block"
            margin="1rem"
            align="center"
          >
            Thanks for being neighbourly!
            <br />
            <FavoriteBorderIcon
              sx={{ fontSize: "60px", color: "pink" }}
            ></FavoriteBorderIcon>
          </Typography>

          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
            align="center"
          >
            This transaction is complete.
          </Typography>
          <Box sx={{ display: "flex", m: "0.5rem" }} justifyContent="center">
            <Btn width={15}>Leave a review</Btn>
            <Btn width={15}>Re-list this item</Btn>
          </Box>
        </Box>
      );
    }
  } else {
    //content for user's requests
    if (props.transactionState === "pending_owner_response") {
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            You submitted a request to {props.selectedTxn.owner_id.display_name}{" "}
            for {props.selectedTxn.listing_id.title}.
            <br />
            <br />
            Waiting for {props.selectedTxn.owner_id.display_name} to respond...
          </Typography>

          <Box sx={{ display: "flex", m: "0.5rem" }}>
            <Btn width={10}>View Listing</Btn>
          </Box>
        </Box>
      );
    } else if (props.transactionState === "accepted") {
      // Render content for the "accepted" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            {props.selectedTxn.owner_id.display_name} accepted your request for{" "}
            {props.selectedTxn.listing_id.title}!
            <br />
            <br />
            {props.selectedTxn.owner_id.display_name}'s contact number:{" "}
            {props.selectedTxn.owner_id.mobile_number}
            <br />
            <br />
            Arrange a meet-up with {
              props.selectedTxn.owner_id.display_name
            }{" "}
            directly.
          </Typography>

          <Box sx={{ display: "flex", m: "0.5rem" }}>
            <Btn
              width={15}
              onClick={() => {
                updateTxnStatus("completed");
              }}
            >
              Transaction Completed
            </Btn>
          </Box>

          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            You can exchange reviews once you have marked this transaction as
            complete.
          </Typography>
        </Box>
      );
    } else if (props.transactionState === "declined") {
      // Add content for the "declined" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
          >
            {props.selectedTxn.owner_id.display_name} declined your request for{" "}
            {props.selectedTxn.listing_id.title}.<br />
            Better luck next time...
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
            <Btn width={15}>View listing</Btn>
          </Box>
        </Box>
      );
    } else if (props.transactionState === "completed") {
      // Render content for the "completed" state
      content = (
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography
            variant="h2"
            component="div"
            display="block"
            margin="1rem"
            align="center"
          >
            Thanks for being neighbourly!
            <br />
            <FavoriteBorderIcon
              sx={{ fontSize: "60px", color: "pink" }}
            ></FavoriteBorderIcon>
          </Typography>

          <Typography
            variant="body"
            component="div"
            display="block"
            margin="1rem"
            align="center"
          >
            This transaction is complete. Leave{" "}
            {props.selectedTxn.owner_id.display_name} a review to say thanks!.
          </Typography>
          <Box sx={{ display: "flex", m: "0.5rem" }} justifyContent="center">
            <Btn width={15}>Leave a review</Btn>
          </Box>
        </Box>
      );
    }
  }

  return (
    <>
      <Box sx={{ display: "flex", m: "1rem" }}>
        <Box
          xs={2}
          sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}
        >
          <Avt
            sx={{ width: "3rem", height: "3rem" }}
            alt="Requester's avatar"
            src={props.selectedTxn.requester_id.image_url}
          ></Avt>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", m: "0.5rem" }}>
          <Typography component="div" variant="body">
            {props.selectedTxn.requester_id.display_name}
          </Typography>
          <Typography variant="body" color="text.secondary" component="div">
            Neighbour in {props.selectedTxn.requester_id.location[0].district}
          </Typography>
        </Box>
      </Box>
      <Divider variant="middle" sx={{ marginLeft: "5%", marginRight: "5%" }} />
      {/* display this if props.selectedTxn.status is "pending" */}
      {content}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Transaction Accepted!
        </Alert>
      </Snackbar>
    </>
  );
};

export default TransactionDetails;
