import React from "react";
import "./inlineForm.scss";

const InlineFormContainer = ({ children }) => {
  return <div className="inlineForm__container"> {children} </div>;
};

export default InlineFormContainer;
