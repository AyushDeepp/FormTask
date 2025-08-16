import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import CategoryNavbar from "./components/CategoryNavbar";
import MobileSidebar from "./components/MobileSidebar";
import PostAdForm from "./components/PostAdForm";
import ThirdPage from "./components/ThirdPage";
import PropertyDetails from "./components/PropertyDetails";

// Main Page Component
function MainPage() {
  const [categories, setCategories] = useState([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      const data = await response.json();
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    // Navigate to the Third Page with category data
    navigate("/third-page", {
      state: {
        selectedCategory: categoryName,
        selectedSubcategory: subcategoryName,
        categories: categories,
      },
    });
  };

  const handlePostAdFormClick = () => {
    // Navigate to the PostAdForm page
    navigate("/post-ad", {
      state: {
        selectedCategory: "Properties",
        selectedSubcategory: "For Sale: Houses & Apartments",
        categories: categories,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="bg-blue-600 text-white p-2 rounded-md shadow-lg"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <CategoryNavbar
          categories={categories}
          onSubcategoryClick={handleSubcategoryClick}
        />
      </div>

      {/* Mobile Sidebar */}
      {showMobileSidebar && (
        <MobileSidebar
          categories={categories}
          onClose={() => setShowMobileSidebar(false)}
          onSubcategoryClick={handleSubcategoryClick}
        />
      )}

      {/* Main Content */}
      <div className="pt-20 lg:pt-0 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Category Navigation System
          </h1>
          <p className="text-gray-600 mb-4">
            This is a MERN stack application demonstrating a category navigation
            system.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              Features:
            </h2>
            <ul className="text-blue-700 space-y-1">
              <li>• Hover over categories to see subcategories</li>
              <li>
                • Hover over "ALL CATEGORIES" to see all categories and
                subcategories
              </li>
              <li>• Click on any subcategory to go to the Third Page</li>
              <li>• Mobile-responsive sidebar navigation</li>
            </ul>
          </div>

          {/* Post Ad Form Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handlePostAdFormClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg"
            >
              Post Ad Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// PostAdForm Page Component
function PostAdFormPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategory, selectedSubcategory, categories } =
    location.state || {};

  const handleClose = () => {
    navigate("/");
  };

  const handleCategoryChange = (categoryName, subcategoryName) => {
    // Update the URL state with new category
    navigate("/post-ad", {
      state: {
        selectedCategory: categoryName,
        selectedSubcategory: subcategoryName,
        categories: categories,
      },
    });
  };

  return (
    <PostAdForm
      selectedCategory={selectedCategory || "Properties"}
      selectedSubcategory={
        selectedSubcategory || "For Sale: Houses & Apartments"
      }
      onClose={handleClose}
      onCategoryChange={handleCategoryChange}
      categories={categories || []}
    />
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/third-page" element={<ThirdPage />} />
        <Route path="/post-ad" element={<PostAdFormPage />} />
        <Route path="/property-details" element={<PropertyDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
