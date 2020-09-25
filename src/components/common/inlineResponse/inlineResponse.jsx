import React from "react";
import "./inlineResponse.scss";
/**
 * Inputs:
 *    message: ( string ) any
 *    type: ( string ) "error" - default, "success"
 *    onClose: ( function ) optional, handled by parent component
 */
const InlineResponse = ({ message, type, onClose }) => {
  const displayType = type || "error";
  return (
    <div className={`inlineResponse__${displayType}-container`}>
      <div className="inlineResponse__message"> {message}</div>
      {onClose ? (
        <button className="inlineResponse__dismiss" onClick={() => onClose()}>
          dismiss
        </button>
      ) : (
        <React.Fragment />
      )}
    </div>
  );
};

export default InlineResponse;
