import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {}, []);
  const history = useHistory();
  return (
    <div className="container main-wrapper aligner">
      <div className="aligner-item text-center ">
        <h1 className="display-1">404</h1>
        <p className="lead text-gray-800 mb-5">Page Not Found</p>
        <p className="text-gray-500 mb-0">
          It looks like you found a glitch in the matrix...
        </p>
        <br />
        <button
          className="btn btn-secondary btn-lg"
          type="button"
          tabIndex="0"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

NotFound.propTypes = {};

NotFound.defaultProps = {};

export default NotFound;
