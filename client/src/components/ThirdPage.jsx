import { useLocation, useNavigate } from "react-router-dom";
import { properties } from "../data/properties";
import PropertyCard from "./PropertyCard";

const ThirdPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCategory, selectedSubcategory } = location.state || {};

  const handleBackToMain = () => {
    navigate("/");
  };

  const handleGoToPostAdForm = () => {
    navigate("/post-ad", {
      state: {
        selectedCategory: selectedCategory || "Properties",
        selectedSubcategory:
          selectedSubcategory || "For Sale: Houses & Apartments",
        categories: location.state?.categories || [],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={handleBackToMain}
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
          {selectedSubcategory || "For Sale: Houses & Apartments"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Category Info */}
        {selectedCategory && selectedSubcategory && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Selected Category
            </h2>
            <p className="text-blue-700">
              {selectedCategory} / {selectedSubcategory}
            </p>
          </div>
        )}

        {/* Property Cards Grid - 2x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Post Ad Form Button */}
        <div className="text-center">
          <button
            onClick={handleGoToPostAdForm}
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
          >
            Post Ad Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThirdPage;
