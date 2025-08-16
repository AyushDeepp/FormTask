const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const Property = require("./models/Property");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://your-netlify-app.netlify.app"] // Replace with your actual Netlify URL
      : ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/property-listing",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Category data based on the images provided
const categoriesData = {
  categories: [
    {
      name: "Cars",
      subcategories: ["Motorcycles", "Scooters", "Spare Parts", "Bicycles"],
    },
    {
      name: "Properties",
      subcategories: [
        "For Sale: Houses & Apartments",
        "For Rent: Houses & Apartments",
        "Lands & Plots",
        "For Rent: Shops & Offices",
        "For Sale: Shops & Offices",
        "PG & Guest Houses",
      ],
    },
    {
      name: "Electronics & Appliances",
      subcategories: [
        "TVs, Video - Audio",
        "Kitchen & Other Appliances",
        "Computers & Laptops",
        "Cameras & Lenses",
        "Games & Entertainment",
        "Fridges",
        "Computer Accessories",
        "Hard Disks, Printers & Monitors",
        "ACs",
        "Washing Machines",
      ],
    },
    {
      name: "Mobiles",
      subcategories: ["Mobile Phones", "Accessories", "Tablets"],
    },
    {
      name: "Commercial Vehicles & Spares",
      subcategories: ["Commercial & Other Vehicles", "Spare Parts"],
    },
    {
      name: "Jobs",
      subcategories: [
        "Data entry & Back office",
        "Sales & Marketing",
        "BPO & Telecaller",
        "Driver",
        "Office Assistant",
        "Delivery & Collection",
        "Teacher",
        "Cook",
        "Receptionist & Front office",
        "Operator & Technician",
        "IT Engineer & Developer",
        "Hotel & Travel Executive",
        "Accountant",
        "Designer",
        "Other Jobs",
      ],
    },
    {
      name: "Furniture",
      subcategories: [
        "Sofa & Dining",
        "Beds & Wardrobes",
        "Home Decor & Garden",
        "Kids Furniture",
        "Other Household Items",
      ],
    },
    {
      name: "Fashion",
      subcategories: ["Men", "Women", "Kids"],
    },
    {
      name: "Pets",
      subcategories: [
        "Fishes & Aquarium",
        "Pet Food & Accessories",
        "Dogs",
        "Other Pets",
      ],
    },
    {
      name: "Books, Sports & Hobbies",
      subcategories: [
        "Books",
        "Gym & Fitness",
        "Musical Instruments",
        "Sports Equipment",
        "Other Hobbies",
      ],
    },
    {
      name: "Services",
      subcategories: [
        "Education & Classes",
        "Tours & Travel",
        "Electronics Repair & Services",
        "Health & Beauty",
        "Home Renovation & Repair",
        "Cleaning & Pest Control",
        "Legal & Documentation Services",
        "Packers & Movers",
        "Other Services",
      ],
    },
  ],
};

// Routes
app.get("/api/categories", (req, res) => {
  res.json(categoriesData);
});

// Submit Property Form
app.post("/api/properties", async (req, res) => {
  try {
    const propertyData = req.body;

    // Create new property
    const newProperty = new Property(propertyData);
    await newProperty.save();

    res.status(201).json({
      success: true,
      message: "Property listed successfully!",
      property: newProperty,
    });
  } catch (error) {
    console.error("Error submitting property:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting property",
      error: error.message,
    });
  }
});

// Get All Properties
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      properties: properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message,
    });
  }
});

// Get Property by ID
app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    res.json({
      success: true,
      property: property,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching property",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Property Listing API is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
