import React, { useEffect, useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Container,
  Typography,
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TopBar from "../components/TopBar";
import TransactionCard from "../components/TransactionCards";
import TransactionDetails from "../components/TransactionDetails";
import UserContext from "../context/user";

const Transactions = (props) => {
  const userCtx = useContext(UserContext);
  const user_id = userCtx.userInfo._id;
  const setUserInfo = userCtx.setUserInfo;
  const fetchData = useFetch();
  const [transactions, setTransactions] = useState([]);
  const [txnToggle, setTxnToggle] = useState("requests");
  const [selectedTxn, setSelectedTxn] = useState({});
  const [transactionState, setTransactionState] = useState("");

  const handleToggle = (event, newSelection) => {
    setTxnToggle(newSelection);
  };

  const getTransactionsByOwner = async () => {
    const res = await fetchData(
      "/api/transactions",
      "POST",
      {
        owner_id: user_id,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      setTransactions(res.data);
    } else {
      setTransactions([]);
      setSelectedTxn({});
      setTransactionState("");
      console.log(res.data);
    }
  };

  const getTransactionsByRequester = async () => {
    const res = await fetchData(
      "/api/transactions",
      "POST",
      {
        requester_id: user_id,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      setTransactions(res.data);
    } else {
      setTransactions([]);
      setSelectedTxn({});
      setTransactionState("");
    }
  };

  const updateSelectedTxn = async (id) => {
    const res = await fetchData(
      "/api/transactions/" + id,
      undefined,
      undefined,
      userCtx.accessToken
    );
    if (!id) {
      return;
    }

    if (res.ok) {
      setSelectedTxn(res.data);
      setTransactionState(res.data.status);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  const incrementOwnerScore = () => {
    const newScore = selectedTxn.owner_id.help_count + 1;
    updateOwnerScore(newScore);
  };

  const updateOwnerScore = async (newScore) => {
    const res = await fetchData(
      "/auth/update/" + selectedTxn.owner_id._id,
      "PATCH",
      {
        help_count: newScore,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      setUserInfo(res.data.updatedUser);
    } else {
      console.log(res.data);
    }
  };

  useEffect(() => {
    if (txnToggle === "listings")
      getTransactionsByOwner(); 
    else if (txnToggle === "requests") getTransactionsByRequester(); 
  }, [txnToggle, userCtx.userInfo]);

  useEffect(() => {
    if (
      (Object.keys(selectedTxn).length === 0 && transactions.length > 0) ||
      (Object.keys(selectedTxn).length > 0 && transactions.length > 0)
    ) {
      setSelectedTxn(transactions[0]);
      setTransactionState(transactions[0].status);
    }
  }, [transactions, txnToggle]);

  return (
    <>
      <TopBar showBurger={true}></TopBar>

      <Container maxWidth="lg">
        <Box>
          <Grid container>
            <Grid xs={12}>
              <Typography variant="h5" textAlign="start" margin="2rem 0">
                Your transactions
              </Typography>

              <ToggleButtonGroup
                value={txnToggle}
                exclusive
                onChange={handleToggle}
                aria-label="transaction selection"
              >
                <ToggleButton
                  value="requests"
                  aria-label="requests"
                  sx={{ borderRadius: "5rem" }}
                >
                  My Requests
                </ToggleButton>
                <ToggleButton
                  value="listings"
                  aria-label="listings"
                  sx={{ borderRadius: "5rem" }}
                >
                  My Listings
                </ToggleButton>
              </ToggleButtonGroup>

              <Divider
                variant="middle"
                sx={{ marginLeft: "5%", marginRight: "5%", margin: "1rem" }}
              />
            </Grid>

            <Grid xs={4.5}>
              {transactions.map((item, idx) => {
                if (item.listing_id) {
                  return (
                    <TransactionCard
                      key={idx}
                      id={item?._id}
                      listingTitle={item.listing_id.title}
                      listingImage={item.listing_id.image_url}
                      status={item.status}
                      ownerName={item.owner_id.display_name}
                      ownerImage={item.owner_id.image_url}
                      requesterName={item.requester_id.display_name}
                      requesterImage={item.requester_id.image_url}
                      updateSelectedTxn={updateSelectedTxn}
                      txnToggle={txnToggle}
                    />
                  );
                }
              })}
            </Grid>

            <Divider orientation="vertical" flexItem />

            <Grid xs={7}>
              {Object.keys(selectedTxn).length > 0 ? (
                <TransactionDetails
                  txnToggle={txnToggle}
                  selectedTxn={selectedTxn}
                  transactionState={transactionState}
                  setTransactionState={setTransactionState}
                  incrementOwnerScore={incrementOwnerScore}
                ></TransactionDetails>
              ) : (
                <Box>
                  {" "}
                  <Typography
                    variant="body"
                    color="text.secondary"
                    component="div"
                    display="block"
                    margin="1rem"
                  >
                    Create a transaction to get started!
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Transactions;
