import React from "react";
import "./inlineForm.scss";

const InlineFormLabel = ({ children }) => {
  return <div className="inlineForm__label">{children || `Label: `}</div>;
};

export default InlineFormLabel;
