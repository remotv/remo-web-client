import React from "react";
import "./inlineProfileItem.scss";

const InlineItem = ({ label, item }) => {
  return (
    <div className="inlineProfileItem__container">
      <div className="inlineProfileItem__label">{label || "Label: "} </div>
      <div className="inlineProfileItem__value"> {item || "Item"}</div>
    </div>
  );
};

export default InlineItem;
