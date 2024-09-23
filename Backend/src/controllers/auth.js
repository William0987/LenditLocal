const AuthModel = require("../models/Auth");
const Auth = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getAllAccount = async (req, res) => {
  try {
    const allAcc = await AuthModel.find();
    res.json(allAcc);
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", msg: error.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const userAcc = await AuthModel.findById(req.params.id);
    res.json(userAcc);
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", msg: error.message });
  }
};

const register = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });
    if (auth) {
      return res.status(400).json({ msg: "Duplicate email" });
    }
    const hash = await bcrypt.hash(req.body.password, 5);

    const createdAuth = new AuthModel({
      email: req.body.email,
      hash,
      display_name: req.body.email,
      location: req.body.location,
      mobile_number: req.body.mobile_number,
      biography: req.body.biography,
      help_count: 0,
      rating: 0,
      image_url: req.body.image_url,
    });
    await createdAuth.save();

    res.status(201).json({ msg: "User created", createdUser: createdAuth });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const auth = await AuthModel.findOne({ email: req.body.email });

    if (!auth) {
      return res.status(400).json({
        status: "error",
        msg: "You Do not have an account. Please register",
      });
    }
    const result = await bcrypt.compare(req.body.password, auth.hash);
    if (!result) {
      console.log("email or password error");
      return res.status(401).json({ status: "error", msg: "login failed" });
    }
    const claims = {
      email: auth.email,
      id: auth._id,
    };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });
    res.json({ access, refresh });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "login failed" });
  }
};

const refresh = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const claims = {
      email: decoded.email,
      id: decoded._id,
    };
    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });
    res.json({ access });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "token refresh error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const authDB = await AuthModel.findById(req.params.id);

    if ("display_name" in req.body) authDB.display_name = req.body.display_name;
    if ("mobile_number" in req.body)
      authDB.mobile_number = req.body.mobile_number;
    if ("biography" in req.body) authDB.biography = req.body.biography;
    if ("help_count" in req.body) authDB.help_count = req.body.help_count;
    if ("rating" in req.body) authDB.rating = req.body.rating;

    if ("location" in req.body)
      authDB.location[0].district = req.body.location[0].district;
    if ("location" in req.body)
      authDB.location[0].postal_code = req.body.location[0].postal_code;
    if ("image_url" in req.body) authDB.image_url = req.body.image_url;

    await authDB.save();

    res.json({ status: "ok", msg: "Account updated", updatedUser: authDB });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", msg: error.message });
  }
};

module.exports = {
  register,
  getAccountById,
  getAllAccount,
  login,
  refresh,
  updateProfile,
};
