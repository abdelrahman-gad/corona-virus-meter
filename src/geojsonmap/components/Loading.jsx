import React from "react";

const Loading = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     
     
      <div className="spinner-grow text-info" role="status">
        <span className="sr-only">Loading Geo Map...</span>
      </div>
    </div>
  );
};

export default Loading;
