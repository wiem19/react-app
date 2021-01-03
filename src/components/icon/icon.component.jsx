import React from "react";

import "./icon.styles.scss";
const Icon = ({ picture, content, height, width, backgroundColor, title }) => {

  const iconStyle = {
    height,
    width,
    backgroundColor,
  };

  return (
    <div className="icon" style={iconStyle}>
      {picture && (
        <img
          className="icon-image "
          style={iconStyle}
          src={picture}
          alt=""
          title={title}
        />
      )}
      {!picture && title && (
        <div className="icon-intials">{title[0].toUpperCase()}</div>
      )}
      {content && <div className="icon-content">{content}</div>}
    </div>
  );
};

export default Icon;
