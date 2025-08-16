import React, { useState, useEffect } from "react";
import statesData from "../states.json";

const PostAdForm = ({
  selectedCategory,
  selectedSubcategory,
  onClose,
  onCategoryChange,
  categories,
}) => {
  const [formData, setFormData] = useState({
    type: "",
    bhk: "",
    bathrooms: "",
    furnishing: "",
    projectStatus: "",
    listedBy: "",
    superBuiltupArea: "",
    carpetArea: "",
    maintenance: "",
    totalFloors: "",
    floorNo: "",
    carParking: "",
    facing: "",
    projectName: "",
    adTitle: "",
    description: "",
    price: "",
    state: "",
    name: "OLX User",
    phoneNumber: "",
  });

  const [activeTab, setActiveTab] = useState("LIST");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  // Add new state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Get all states from the JSON - statesData.India is directly an array
  const allStates = statesData.India;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelection = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const handleCategoryChange = () => {
    setShowAllCategories(!showAllCategories);
  };

  const handleSubcategorySelect = (categoryName, subcategoryName) => {
    onCategoryChange(categoryName, subcategoryName);
    setShowAllCategories(false);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationLoading(false);
      alert(
        "Geolocation is not supported by this browser. Please select a state from the list."
      );
      return;
    }

    // Set timeout for geolocation request
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds
      maximumAge: 300000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location obtained:", { latitude, longitude });
        setCurrentLocation({ latitude, longitude });
        setActiveTab("CURRENT LOCATION");
        setLocationLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationLoading(false);

        let errorMessage = "Unable to get your current location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage +=
              "Location information is unavailable. Please select from the list.";
            break;
          case error.TIMEOUT:
            errorMessage +=
              "Location request timed out. Please try again or select from the list.";
            break;
          default:
            errorMessage +=
              "An unknown error occurred. Please select from the list.";
        }

        alert(errorMessage);
      },
      options
    );
  };

  // Photo upload functionality
  const handlePhotoUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhotos = [...photos];
        const newPhotoFiles = [...photoFiles];

        newPhotos[index] = e.target.result;
        newPhotoFiles[index] = file;

        setPhotos(newPhotos);
        setPhotoFiles(newPhotoFiles);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const newPhotoFiles = [...photoFiles];

    newPhotos[index] = null;
    newPhotoFiles[index] = null;

    setPhotos(newPhotos);
    setPhotoFiles(newPhotoFiles);
  };

  // Form validation function
  const validateForm = () => {
    const errors = [];

    if (!formData.type) errors.push("Property type is required");
    if (!formData.bhk) errors.push("BHK is required");
    if (!formData.bathrooms) errors.push("Number of bathrooms is required");
    if (!formData.superBuiltupArea)
      errors.push("Super built-up area is required");
    if (!formData.adTitle) errors.push("Ad title is required");
    if (!formData.description) errors.push("Description is required");
    if (!formData.price) errors.push("Price is required");
    if (!formData.state) errors.push("State is required");
    if (!formData.name) errors.push("Name is required");
    if (!formData.phoneNumber) errors.push("Phone number is required");

    return errors;
  };

  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      setSubmitError(errors.join(", "));
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Prepare form data
      const propertyData = {
        type: formData.type,
        bhk: formData.bhk,
        bathrooms: formData.bathrooms,
        superBuiltupArea: formData.superBuiltupArea,
        carpetArea: formData.carpetArea,
        furnishing: formData.furnishing,
        projectStatus: formData.projectStatus,
        listedBy: formData.listedBy,
        maintenance: formData.maintenance,
        totalFloors: formData.totalFloors,
        floorNo: formData.floorNo,
        carParking: formData.carParking,
        facing: formData.facing,
        projectName: formData.projectName,
        adTitle: formData.adTitle,
        description: formData.description,
        price: parseFloat(formData.price),
        state: formData.state,
        location: `${formData.state}, India`,
        coordinates: currentLocation,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        images: photos.filter((photo) => photo !== null),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        featured: false,
      };

      // Submit to server
      const response = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        // Reset form after successful submission
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setSubmitError(result.message || "Failed to submit property");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelectionButtons = (field, options, label) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelection(field, option)}
            className={`px-4 py-2 rounded-md text-sm border transition-colors ${
              formData[field] === option
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const renderInputField = (
    field,
    label,
    placeholder = "",
    type = "text",
    required = false
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const renderTextArea = (
    field,
    label,
    placeholder = "",
    maxLength = 4096,
    required = false
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <div className="text-xs text-gray-500 mt-1">
        {formData[field].length}/{maxLength}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={onClose}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Post your Ad</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto px-4 py-6">
        {/* Selected Category */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-medium text-gray-700">
                SELECTED CATEGORY
              </h2>
              <p className="text-gray-800">
                {selectedCategory} / {selectedSubcategory}
              </p>
            </div>
            <button
              onClick={handleCategoryChange}
              className="text-blue-600 text-sm font-medium"
            >
              Change
            </button>
          </div>
        </div>

        {/* All Categories Dropdown */}
        {showAllCategories && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Select Category
            </h3>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {categories?.map((category, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-gray-800 text-sm">
                    {category.name}
                  </h4>
                  <div className="pl-4 space-y-1">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() =>
                          handleSubcategorySelect(category.name, subcategory)
                        }
                        className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 py-1"
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Include Some Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            INCLUDE SOME DETAILS
          </h2>

          {renderSelectionButtons(
            "type",
            [
              "Flats / Apartments",
              "Independent / Builder Floors",
              "Farm House",
              "House & Villas",
            ],
            "Type*"
          )}
          {renderSelectionButtons("bhk", ["1", "2", "3", "4", "4+"], "BHK*")}
          {renderSelectionButtons(
            "bathrooms",
            ["1", "2", "3", "4", "4+"],
            "Bathrooms*"
          )}
          {renderSelectionButtons(
            "furnishing",
            ["Furnished", "Semi Furnished", "Unfurnished"],
            "Furnishing"
          )}
          {renderSelectionButtons(
            "projectStatus",
            ["New Launch", "Ready to Move", "Under Construction"],
            "Project Status"
          )}
          {renderSelectionButtons(
            "listedBy",
            ["Builder", "Dealer", "Owner"],
            "Listed by"
          )}

          {renderInputField("superBuiltupArea", "Super Builtup area sqft*")}
          {renderInputField("carpetArea", "Carpet Area sqft*")}
          {renderInputField("maintenance", "Maintenance (Monthly)")}
          {renderInputField("totalFloors", "Total Floors")}
          {renderInputField("floorNo", "Floor No")}

          {renderSelectionButtons(
            "carParking",
            ["0", "1", "2", "3", "3+"],
            "Car Parking"
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facing
            </label>
            <div className="relative">
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white">
                <option>Select Facing</option>
                <option>North</option>
                <option>South</option>
                <option>East</option>
                <option>West</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {renderInputField("projectName", "Project Name", "", "text", false)}
          <div className="text-xs text-gray-500 mb-4">
            {formData.projectName.length}/70
          </div>

          {renderInputField(
            "adTitle",
            "Ad Title*",
            "Mention the key features of your item (e.g. brand, model, age, type)",
            "text",
            true
          )}
          <div className="text-xs text-gray-500 mb-4">
            {formData.adTitle.length}/70
          </div>

          {renderTextArea(
            "description",
            "Description*",
            "Include condition, features and reason for selling",
            4096,
            true
          )}
        </div>

        {/* Set a Price */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            SET A PRICE
          </h2>
          {renderInputField("price", "Price*", "₹", "number", true)}
        </div>

        {/* Upload Photos */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            UPLOAD UP TO 20 PHOTOS
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden"
              >
                {photos[index] ? (
                  // Show uploaded photo
                  <div className="w-full h-full relative">
                    <img
                      src={photos[index]}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  // Show upload button
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <svg
                      className="w-8 h-8 text-gray-400 mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {index === 0 && (
                      <span className="text-xs text-gray-500">Add Photo</span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, index)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload up to 20 photos. Max file size: 5MB per photo.
          </p>
        </div>

        {/* Confirm Location */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            CONFIRM YOUR LOCATION
          </h2>

          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setActiveTab("LIST")}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "LIST"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              LIST
            </button>
            <button
              onClick={getCurrentLocation}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "CURRENT LOCATION"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Getting Location...</span>
                </div>
              ) : (
                "CURRENT LOCATION"
              )}
            </button>
          </div>

          {activeTab === "LIST" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State*
              </label>
              <div className="relative">
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">Select State</option>
                  {allStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {!formData.state && (
                <p className="text-red-500 text-sm mt-1">
                  This field is mandatory
                </p>
              )}
            </div>
          )}

          {activeTab === "CURRENT LOCATION" && (
            <div className="mb-4">
              {currentLocation ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <p className="text-sm font-medium text-green-800">
                      Location obtained successfully!
                    </p>
                  </div>
                  <p className="text-sm text-green-700">
                    <strong>Coordinates:</strong>{" "}
                    {currentLocation.latitude.toFixed(6)},{" "}
                    {currentLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Your current location has been detected and will be used for
                    this ad.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-blue-800">
                      Get Your Current Location
                    </p>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Click the "CURRENT LOCATION" button above to automatically
                    detect your location.
                  </p>
                  <ul className="text-xs text-blue-600 space-y-1">
                    <li>
                      • Make sure location services are enabled on your device
                    </li>
                    <li>
                      • Allow location access when prompted by your browser
                    </li>
                    <li>
                      • This will help buyers find your property more easily
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Review Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            REVIEW YOUR DETAILS
          </h2>

          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1 space-y-3">
              {renderInputField("name", "Name", "", "text", false)}
              <div className="text-xs text-gray-500">
                {formData.name.length}/30
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your phone number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Submission Status */}
        {submitSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800 font-medium">
              Your property has been posted successfully!
            </p>
            <p className="text-green-700">
              You will be redirected to the home page in 3 seconds.
            </p>
          </div>
        )}
        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-center">
            <p className="text-red-800 font-medium">{submitError}</p>
          </div>
        )}

        {/* Bottom Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-[600px] mx-auto">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Posting...</span>
                </div>
              ) : (
                "Post now"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostAdForm;
