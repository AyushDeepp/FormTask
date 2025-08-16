import { useState } from "react";

const MobileSidebar = ({ categories, onClose, onSubcategoryClick }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    onSubcategoryClick(categoryName, subcategoryName);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">Categories</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Categories List */}
          <div className="overflow-y-auto h-full">
            <ul className="py-2">
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === index ? null : index
                      )
                    }
                    className={`w-full text-left px-4 py-3 transition-colors duration-200 flex items-center justify-between ${
                      selectedCategory === index
                        ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        selectedCategory === index ? "rotate-180" : ""
                      }`}
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
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subcategories Panel */}
        {selectedCategory !== null && (
          <div className="flex-1 bg-white">
            {/* Subcategories Header */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {categories[selectedCategory]?.name}
              </h3>
            </div>

            {/* Subcategories List */}
            <div className="overflow-y-auto h-full">
              <ul className="py-2">
                {categories[selectedCategory]?.subcategories.map(
                  (subcategory, subIndex) => (
                    <li key={subIndex}>
                      <button
                        onClick={() =>
                          handleSubcategoryClick(
                            categories[selectedCategory].name,
                            subcategory
                          )
                        }
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      >
                        {subcategory}
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Overlay to close when clicking outside */}
        <div className="flex-1" onClick={onClose} />
      </div>
    </div>
  );
};

export default MobileSidebar;
