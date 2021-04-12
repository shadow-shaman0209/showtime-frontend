import React from "react";
import PropTypes from "prop-types";

const CappedWidth = ({ children }) => {
  return <div className="max-w-screen-2xl px-3 mx-auto">{children}</div>;
};

CappedWidth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CappedWidth;
