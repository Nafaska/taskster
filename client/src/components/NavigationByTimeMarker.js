import React from "react";
import { Link } from "react-router-dom";

const NavigationBarByTimeMarker = (props) => {
  return (
    <nav className="flex items-center justify-start sm:h-10 border">
      <div
        className="sm:px-6 px-3 py-3 bg-gray-50 text-left text-base leading-4 font-medium sm:font-bold text-blue-700 uppercase
        tracking-wider"
      >
        Display
      </div>
      <div className="flex items-center	text-center flex-row text-blue-700">
        <Link
          to={`/${props.category}`}
          className="font-light sm:font-medium hover:text-blue-800 transition duration-150 ease-in-out"
        >
          All Tasks
        </Link>
        <Link
          to={`/${props.category}/day`}
          className="sm:ml-8 ml-4 font-light sm:font-medium hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Created Today
        </Link>
        <Link
          to={`/${props.category}/week`}
          className="sm:ml-8 ml-4 font-light sm:font-medium hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Created this Week
        </Link>
        <Link
          to={`/${props.category}/month`}
          className="sm:ml-8 ml-4 font-light sm:font-medium hover:text-blue-800 transition duration-150 ease-in-out"
        >
          Created this Month
        </Link>
      </div>
    </nav>
  );
};

export default NavigationBarByTimeMarker;
