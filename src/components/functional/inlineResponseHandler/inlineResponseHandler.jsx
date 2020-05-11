import React from "react";
import InlineResponse from "../../common/inlineResponse";

const InlineResponseHandler = ({ error, success, onClose }) => {
  if (error !== "") return <InlineResponse message={error} onClose={onClose} />;
  if (success !== "")
    return (
      <InlineResponse message={success} type="success" onClose={onClose} />
    );

  return null;
};

export default InlineResponseHandler;
