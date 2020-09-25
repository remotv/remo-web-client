import React from "react";
import "./inlineButton.scss";

const InlineButton = ({ onClick, options, children }) => {
  const handleOptions = () => {
    if (options === "gray") return "inline-gray";
    if (options === "delete") return "inline-delete";
    if (options === "inactive") return "inline-inactive";
    return "default";
  };

  return (
    <button
      className={`inlineButton__${handleOptions()}`}
      onClick={(e) => onClick(e)}
    >
      {children}
    </button>
  );
};

export default InlineButton;
