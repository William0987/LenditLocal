import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import UserContext from "./context/user";
import useFetch from "./hooks/useFetch";

import SignIn from "./pages/SignIn";
import Registration from "./pages/Registration";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ListingPage from "./pages/ListingPage";
import OfferPage from "./pages/OfferPage";
import AddOffer from "./pages/AddOffer";
import Transactions from "./pages/Transactions";

function App() {
  const fetchData = useFetch();
  const [accessToken, setAccessToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({
    _id: "64e2c2fcdce21246ef81b8ee",
    email: "hwee@test.com",
    hash: "$2b$05$NJohi/xGECGnXCit27WdvOSjGrRyZlU1at0MCCIg/9h8T6R6uEvLW",
    display_name: "Hwee",
    biography: "A then-laywer. So don't mess with me :)",
    mobile_number: 12345678,
    help_count: 0,
    rating: 0,
    location: [
      {
        district: "Yishun",
        postal_code: 760761,
        latitude: 1.4253984246908402,
        longitude: 103.83325903597616,
        _id: "64e3447ed3dc267fa2b626a4",
      },
    ],
    image_url: "/avatars/30.png",
    created_at: "2023-08-21T11:03:26.780Z",
  });

  const getUserInfo = async () => {
    const res = await fetchData("/auth/accounts/" + id);
  };

  useEffect(() => {});

  return (
    <div className="margin-padding-0">
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          userInfo,
          setUserInfo,
          userId,
          setUserId,
        }}
      >
        <Routes>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route
            path="/registration"
            element={<Registration setUserInfo={setUserInfo} />}
          ></Route>
          <Route
            path="/profile-setup"
            element={
              <ProfileSetup userInfo={userInfo} setUserInfo={setUserInfo} />
            }
          ></Route>

          <Route path="/" element={<OfferPage />}></Route>
          <Route path="/add-offer" element={<AddOffer />}></Route>
          <Route path="/listing/:item" element={<ListingPage />}></Route>

          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/settings" element={<Settings />}></Route>

          <Route path="/transactions" element={<Transactions />}></Route>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
