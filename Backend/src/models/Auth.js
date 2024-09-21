const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      enum: ["Yishun", "Queenstown", "Outram Park", "Jurong East"],
    },
    postal_code: {
      type: Number,
      default: 0,
      required: true,
      minLength: 1,
      maxLength: 6,
    },
    latitude: { type: Number, required: false, default: 0 },

    longitude: {
      type: Number,
      required: false,
      default: 0,
    }, 
  },
  { collection: "Location" }
);

const AuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, minLength: 1, maxLength: 75 },
    hash: { type: String, required: true, minLength: 6, maxLength: 100 },
    display_name: { type: String, required: false, default: "" },

    biography: {
      type: String,
      default: "",
      required: false,
      minLength: 0,
      maxLength: 100,
    },
    mobile_number: {
      type: Number,
      required: false,
      default: 0,
      minLength: 1,
      maxLength: 9,
    },
    help_count: { type: Number, required: false, default: 0 },
    rating: { type: Number, required: false, default: 0 },
    created_at: { type: Date, required: true, default: Date.now },
    location: [LocationSchema],
    image_url: { type: String, required: false },
  },
  { collection: "auth" }
);
module.exports = mongoose.model("Auth", AuthSchema);
