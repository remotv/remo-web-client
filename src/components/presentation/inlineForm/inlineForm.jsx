import React from "react";
import "./inlineForm.scss";

const InlineForm = ({ label, content }) => {
  const handleContent = () => {
    if (typeof content === "string")
      return <div className="inlineForm__content">{content}</div>;
    else return content;
  };
  return (
    <div className="inlineForm__container">
      <div className="inlineForm__label">{label || `Label: `}</div>
      {handleContent()}
    </div>
  );
};

export default InlineForm;
