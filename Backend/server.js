require("dotenv").config();

const express = require("express");
const cors = require("cors"); 
const helmet = require("helmet"); 
const rateLimit = require("express-rate-limit");
const connectDB = require("./src/db/db"); 
connectDB();
const listings = require("./src/routers/listings");

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(cors());
app.use(helmet());
app.use(limit);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", listings);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
