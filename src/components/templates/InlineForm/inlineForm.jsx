import React from "react";
import {
  InlineFormLabel,
  InlineFormContent,
  InlineFormContainer,
} from "../../presentation/inlineForm";

const InlineForm = ({ label, content }) => {
  const handleContent = () => {
    if (typeof content === "string")
      return <InlineFormContent>{content}</InlineFormContent>;
    else return content;
  };
  return (
    <InlineFormContainer>
      <InlineFormLabel> {label || "Label: "} </InlineFormLabel>
      {handleContent()}
    </InlineFormContainer>
  );
};

export default InlineForm;
