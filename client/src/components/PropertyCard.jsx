import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/property-details", {
      state: { property },
    });
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-52 object-cover"
        />

        {/* Featured Tag */}
        {property.featured && (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
            FEATURED
          </div>
        )}

        {/* Heart Icon */}
        <div className="absolute top-3 right-3">
          <svg
            className="w-6 h-6 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="text-xl font-bold text-gray-800 mb-2">
          {property.price}
        </div>

        {/* Property Details */}
        <div className="text-sm text-gray-600 mb-2">
          {property.bhk} - {property.bathrooms} - {property.area}
        </div>

        {/* Title */}
        <div className="text-gray-800 font-medium mb-2 text-sm leading-tight">
          {property.title}
        </div>

        {/* Location */}
        <div className="text-sm text-gray-600 mb-2 font-medium">
          {property.location}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-500">{property.date}</div>
      </div>
    </div>
  );
};

export default PropertyCard;
