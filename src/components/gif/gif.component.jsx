import React from "react";
import "./gif.styles.scss";

const Gif = ({ gifUrl, handleClick, height, width }) => {
  return (
    <img
    alt=''
      onClick={handleClick ? () => handleClick(gifUrl) : () => {}}
      key={gifUrl}
      className="gif"
      src={gifUrl}
      style={{ height, width }}
    ></img>
  );
};

export default Gif;
