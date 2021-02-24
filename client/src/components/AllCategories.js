import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllCategories = () => {
  const [categoriesList, setCategoriesList] = useState([]);

  const node = useRef();

  const [expandedDropdown, setExpandedDropdown] = useState(false);

  const onDropdownClick = () => {
    setExpandedDropdown(!expandedDropdown);
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        `/api/v1/categories`
      );
      const responseArray = Object.values(response.data);
      setCategoriesList(responseArray);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getAllCategories();

    const handleClickOutside = (e) => {
      if (expandedDropdown && !node.current.contains(e.target)) {
        setExpandedDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedDropdown]);

  return (
    <div ref={node} className="relative w-1/2 mt-32">
      <button
        onClick={onDropdownClick}
        type="button"
        className="cursor-default w-full relative rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-400 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
      >
        <div className="flex items-center space-x-3">
          <span className="block text-gray-500 truncate">
            Select Task Category
          </span>
        </div>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M7 7l3-3 3 3m0 6l-3 3-3-3"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {expandedDropdown && (
        <div className="z-10 origin-top-left absolute font-medium left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            className="max-h-48 overflow-y-auto rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5"
          >
            {categoriesList.map((category) => {
              return (
                <div
                  role="menuitem"
                  key={category}
                  className="text-gray-900 hover:text-gray-300 hover:bg-blue-600 cursor-pointer select-none relative py-2 pl-3 pr-9"
                >
                  <Link
                    to={`/${category}`}
                    className="flex items-center font-normal block truncate"
                  >
                    {category}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCategories;
