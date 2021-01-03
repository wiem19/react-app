import React from "react";
import "./disconnected.styles.scss";

const Disconnected = ({ title, subtitle }) => {
  return (
    <div className="disconnected-header">
      <div className="disconnected-header-alert">
        <span className="icon-caution">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
        </span>
      </div>
      <div className="wrapper">
        <div className="disconnected-header-title">{title || "title"}</div>
        <div className="disconnected-header-subtitle">
          {subtitle || "subtitle"}
        </div>
      </div>
    </div>
  );
};

export default Disconnected;
