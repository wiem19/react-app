import React from "react";

import "./customButton.styles.scss";
const CustomButton = ({ content, bgColor, iconName, height, width, color }) => {
  return (
    <div
      className="custom-button"
      style={{ background: bgColor, height, width }}
    >
      {iconName && <i className={iconName}></i>}
      <div className="custom-button-content" style={{ color }}>
        {content}
      </div>
    </div>
  );
};

export default CustomButton;
