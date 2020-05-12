import React from "react";
import InlineResponse from "../../common/inlineResponse";

const InlineResponseHandler = ({ error, success, onClose }) => {
  if (error) return <InlineResponse message={error} onClose={onClose} />;
  else if (success)
    return (
      <InlineResponse message={success} type="success" onClose={onClose} />
    );

  return <React.Fragment />;
};

export default InlineResponseHandler;
