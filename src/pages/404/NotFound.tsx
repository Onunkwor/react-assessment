import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        {/* 404 Large Display */}
        <h1 className="text-8xl font-bold text-blue-500 mb-2">404</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        {/* Illustration - Simple SVG */}
        <div className="mb-8 flex justify-center">
          <svg
            className="w-64 h-64"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#EBF4FF"
              d="M40,80 C40,40 160,40 160,80 L160,120 C160,160 40,160 40,120 Z"
            />
            <path
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
              d="M30,100 L170,100"
            />
            <circle cx="70" cy="90" r="8" fill="#3B82F6" opacity="0.6" />
            <circle cx="130" cy="90" r="8" fill="#3B82F6" opacity="0.6" />
            <path
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              d="M80,120 C90,125 110,125 120,120"
              strokeLinecap="round"
            />
            <path
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              d="M20,40 L20,160 M180,40 L180,160"
              strokeDasharray="4,6"
            />
            <text
              x="100"
              y="30"
              fontSize="10"
              fill="#3B82F6"
              textAnchor="middle"
            >
              404
            </text>
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-150"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
