const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  // Basic Property Info
  type: { type: String, required: true },
  bhk: { type: String, required: true },
  bathrooms: { type: String, required: true },
  superBuiltupArea: { type: String, required: true },
  carpetArea: { type: String },
  furnishing: { type: String },
  projectStatus: { type: String },
  listedBy: { type: String },
  maintenance: { type: String },
  totalFloors: { type: String },
  floorNo: { type: String },
  carParking: { type: String },
  facing: { type: String },
  projectName: { type: String },

  // Ad Details
  adTitle: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },

  // Location
  state: { type: String, required: true },
  location: { type: String },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
  },

  // Contact Info
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },

  // Images
  images: [{ type: String }],

  // Category Info
  category: { type: String, required: true },
  subcategory: { type: String, required: true },

  // Metadata
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Property", propertySchema);
