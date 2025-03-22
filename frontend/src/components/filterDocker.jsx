// /frontend/src/components/FilterDock.jsx
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

const filterOptions = [
  { label: "Today", icon: "T" },
  { label: "This Week", icon: "W" },
  { label: "This Month", icon: "M" },
  { label: "This Year", icon: "Y" },
];

const customOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `Last ${i + 2} Months`,
  icon: `${i + 2}`,
}));

const FilterDock = ({ filter, setFilter }) => {
  const [isVisible, setIsVisible] = useState(false); // Default hidden
  const [showCustom, setShowCustom] = useState(false);
  const [hoveredLabel, setHoveredLabel] = useState("");

  return (
    <div className="fixed right-4 top-[15%] z-50 flex flex-col items-end">
      {/* Tooltip (Above Dock) */}
      {hoveredLabel && (
        <div className="absolute -top-10 right-0 bg-gray-800 text-white text-sm px-2 py-1 rounded-md shadow-md">
          {hoveredLabel}
        </div>
      )}

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 text-white p-2 shadow-md hover:bg-gray-700 transition rounded-md"
        whileTap={{ scale: 0.9 }}
      >
        {isVisible ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </motion.button>

      {/* Filter Dock */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="bg-gray-900 p-2 rounded-md shadow-lg flex flex-col space-y-2"
        >
          {filterOptions.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Custom") {
                  setShowCustom(true);
                  setFilter("Custom");
                } else {
                  setFilter(label);
                  setShowCustom(false);
                }
              }}
              onMouseEnter={() => setHoveredLabel(label)}
              onMouseLeave={() => setHoveredLabel("")}
              className={`relative flex items-center justify-center w-14 h-14 rounded-md font-bold transition-all duration-300
                ${
                  filter === label || (showCustom && label === "Custom")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
            >
              {icon}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterDock;
