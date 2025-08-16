import { useState } from "react";

const CategoryNavbar = ({ categories, onSubcategoryClick }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Main categories to show in the navbar (first 7 categories)
  const mainCategories = categories.slice(0, 7);

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    onSubcategoryClick(categoryName, subcategoryName);
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center space-x-8 py-4">
          {/* ALL CATEGORIES Button */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowAllCategories(true)}
              onMouseLeave={() => setShowAllCategories(false)}
              className="flex items-center space-x-1 font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              <span>ALL CATEGORIES</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  showAllCategories ? "rotate-180" : ""
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

            {/* All Categories Dropdown */}
            {showAllCategories && (
              <div
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[800px] z-50"
                onMouseEnter={() => setShowAllCategories(true)}
                onMouseLeave={() => setShowAllCategories(false)}
              >
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-8">
                    {categories.map((category, index) => (
                      <div key={index} className="space-y-3">
                        {/* Category Title */}
                        <h3 className="font-bold text-gray-800 text-lg border-b border-gray-200 pb-2">
                          {category.name}
                        </h3>

                        {/* Subcategories */}
                        <ul className="space-y-1">
                          {category.subcategories.map(
                            (subcategory, subIndex) => (
                              <li key={subIndex}>
                                <button
                                  onClick={() =>
                                    handleSubcategoryClick(
                                      category.name,
                                      subcategory
                                    )
                                  }
                                  className="text-gray-700 hover:text-blue-600 transition-colors duration-150 block py-1 text-left w-full"
                                >
                                  {subcategory}
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Category Links */}
          {mainCategories.map((category, index) => (
            <div key={index} className="relative">
              <button
                onMouseEnter={() => setHoveredCategory(index)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="text-gray-800 hover:text-blue-600 transition-colors duration-200 whitespace-nowrap"
              >
                {category.name}
              </button>

              {/* Hover Dropdown */}
              {hoveredCategory === index && (
                <div
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-48 z-50"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="py-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() =>
                          handleSubcategoryClick(category.name, subcategory)
                        }
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                      >
                        {subcategory}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNavbar;
