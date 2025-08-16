import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {};
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleBack = () => {
    navigate("/third-page");
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images?.length - 1 || 0 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (property.images?.length - 1 || 0) ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-lg">Property not found</div>
      </div>
    );
  }

  const images = property.images || [property.image];
  const currentImage = images[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={handleBack}
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
        <h1 className="text-lg font-semibold text-gray-800">
          Property Details
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Images, Details, and Description */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="w-full h-[500px] object-cover"
                />
                {property.featured && (
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded">
                    FEATURED
                  </div>
                )}

                {/* Navigation Arrows */}
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
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
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                  {currentImageIndex + 1}/{images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3 overflow-x-auto">
                  {images.slice(0, 5).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`w-20 h-16 object-cover rounded border-2 flex-shrink-0 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">
                      {property.type || "Flats / Apartments"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">
                      Super Built-up area sqft
                    </span>
                    <span className="font-medium">
                      {property.superBuiltupArea || property.area}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Furnishing</span>
                    <span className="font-medium">
                      {property.furnishing || "Unfurnished"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Listed By</span>
                    <span className="font-medium">
                      {property.listedBy || "Builder"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Carpet area sqft</span>
                    <span className="font-medium">
                      {property.carpetArea || "400 sqft"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Maintenance (Monthly)</span>
                    <span className="font-medium">
                      {property.maintenance || "₹1,200"}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Floor No</span>
                    <span className="font-medium">
                      {property.floorNo || "5"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium">
                      {property.bedrooms || property.bhk.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">
                      {property.bathrooms.split(" ")[0]}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Project Status</span>
                    <span className="font-medium">
                      {property.projectStatus || "Ready to Move"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Facing</span>
                    <span className="font-medium">
                      {property.facing || "North-West"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Car Parking</span>
                    <span className="font-medium">
                      {property.carParking || "1"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Total Floors</span>
                    <span className="font-medium">
                      {property.totalFloors || "7"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description ||
                  "Road touch building available car parking CCTV security guard club House swimming pool garden kids play area etc"}
              </p>
            </div>
          </div>

          {/* Right Column - Property Info and Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Price */}
            <div className="text-4xl font-bold text-gray-800 mb-3">
              {property.price}
            </div>

            {/* Basic Info */}
            <div className="text-lg text-gray-600 mb-3">
              {property.bhk} - {property.bathrooms} - {property.area}
            </div>

            {/* Title */}
            <div className="text-lg font-medium text-gray-800 mb-4">
              {property.title}
            </div>

            {/* Location & Date */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">{property.location}</div>
              <div className="text-sm text-gray-500">{property.date}</div>
            </div>

            {/* Seller Information */}
            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {property.seller?.name?.charAt(0) || "G"}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    Posted by {property.seller?.name || "Gopendra"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Member since {property.seller?.memberSince || "Apr 2018"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {property.seller?.itemsListed || "44"} Items listed
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200">
                Chat with seller
              </button>
              <button className="w-full bg-gray-100 text-gray-800 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>** *** ****</span>
                <span className="text-blue-600">Show number</span>
              </button>
            </div>

            {/* Posted in Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Posted in</div>
              <div className="text-gray-800">{property.location}</div>
            </div>

            {/* Map Section */}
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-2">Location</div>
              <div className="text-xs text-gray-500 mb-2">
                19°04'30.0″N 73°05'49.0″E
              </div>
              <div className="bg-gray-100 rounded-lg overflow-hidden h-56">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.1234567890123!2d73.096944!3d19.075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMwLjAiTiA3M8KwMDUnNDkuMCJF!5e0!3m2!1sen!2sin!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                ></iframe>
              </div>
              <div className="mt-2 text-right">
                <a href="#" className="text-blue-600 text-sm hover:underline">
                  View larger map
                </a>
              </div>
            </div>

            {/* AD ID */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
              <span>AD ID 1814333548</span>
              <button className="text-blue-600 hover:underline">
                REPORT THIS AD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
