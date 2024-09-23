const { v4: uuidv4 } = require("uuid");

const ListingModel = require('../models/Listings2')

const getAllListings = async (req, res) => {
  try {
    const allListings = await ListingModel.find().populate("owner_id");
    res.json(allListings);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Error getting listings" });
  }
};

const getAllListingsByDistrict = async (req, res) => {
  try {
    const allListings = await ListingModel.find().populate({
      path: "owner_id",
      match: {
        "location.district": req.body.location,
      },
    });

    const filtered = allListings.filter((item) => item.owner_id != null);

    res.json(filtered);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Error getting listings" });
  }
};

const getAllListingsByUserId = async (req, res) => {
  try {
    const allListings = await ListingModel.find({
      owner_id: req.body.owner_id,
    }).populate("owner_id");

    res.json(allListings);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Error getting listings" });
  }
};

const getListingById = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id).populate(
      "owner_id"
    );

    if (!listing) {
      return res
        .status(400)
        .json({ status: "error", error: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", message: "Cannot get listing" });
  }
};

const createListing = async (req, res) => {
  try {
    const createdListing = new ListingModel({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      owner_id: req.body.owner_id,
      date_available_from: req.body.date_available_from,
      // date_available_to: req.body.date_available_to,
      // image_url: req.body.image_url,
    });
    if ("date_available_to" in req.body)
      createdListing.date_available_to = req.body.date_available_to;
    if ("image_url" in req.body) createdListing.image_url = req.body.image_url;

    await createdListing.save();
    res.json({
      status: "ok",
      msg: "Listing saved",
      id: createdListing._id,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", message: "Cannot create listing" });
  }
};

const patchListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) {
      return res
        .status(400)
        .json({ status: "error", error: "Listing not found" });
    }

    const updatedListing = {};
    if ("title" in req.body) updatedListing.title = req.body.title;
    if ("description" in req.body)
      updatedListing.description = req.body.description;
    if ("type" in req.body) updatedListing.type = req.body.type;
    if ("owner_id" in req.body) updatedListing.owner_id = req.body.owner_id;
    if ("date_available_from" in req.body)
      updatedListing.date_available_from = req.body.date_available_from;
    if ("date_available_to" in req.body)
      updatedListing.date_available_to = req.body.date_available_to;
    if ("image_url" in req.body) updatedListing.image_url = req.body.image_url;

    await ListingModel.findByIdAndUpdate(req.params.id, updatedListing);

    res.json({ status: "ok", message: "Listing updated" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", message: "Cannot update listing" });
  }
};

const deleteListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    // console.log(listing);
    if (!listing) {
      return res
        .status(400)
        .json({ status: "error", error: "Listing not found" });
    }

    await ListingModel.findByIdAndDelete(req.params.id);

    res.json({ status: "ok", message: "Listing deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", message: "Cannot delete listing" });
  }
};

module.exports = {
  getAllListings,
  getAllListingsByDistrict,
  getAllListingsByUserId,
  getListingById,
  createListing,
  patchListing,
  deleteListing,
};
