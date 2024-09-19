const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, minLength: 1, maxLength: 75 },
    hash: { type: String, required: true, minLength: 6, maxLength: 100 },
    display_name: { type: String, required: false, default: "" },
    location: {
      type: String,
      required: true,
      enum: ["Yishun", "Queenstown", "Outram Park", "Jurong East"],
      default: "",
    }, 
    postal_code: {
      type: Number,
      default: "",
      required: true,
      minLength: 1,
      maxLength: 6,
    },
    biography: {
      type: String,
      default: "",
      required: false,
      minLength: 0,
      maxLength: 100,
    },
    help_count: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    created_at: { type: Date, required: true, default: Date.now },
  },
  { collection: "auth" }
);

module.exports = mongoose.model("Auth", AuthSchema);
