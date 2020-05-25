import React from "react";
import "./inlineForm.scss";

const InlineWithImage = ({ image, children }) => {
  return (
    <div className="inlineForm__with-image-container">
      <div className="inlineForm__image-container">{image}</div>
      <div className="inlineForm__form-with-image-container">{children}</div>
    </div>
  );
};

export default InlineWithImage;
