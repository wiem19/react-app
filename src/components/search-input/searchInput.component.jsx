import React from "react";

import "./searchInput.styles.scss";

const SearchInput = ({
  handleChange,
  label,
  value,
  placeholder,
  ...otherProps
}) => (
  <div className="group">
    <input
      className="form-input"
      onChange={handleChange}
      value={value}
      placeholder={placeholder}
      {...otherProps}
    />
  </div>
);

export default SearchInput;
