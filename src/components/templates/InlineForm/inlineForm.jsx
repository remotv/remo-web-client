import React from "react";
import {
  InlineFormLabel,
  InlineFormContent,
  InlineFormContainer,
  InlineWithImage,
} from "../../presentation/inlineForm";

const InlineForm = ({ label, content, image }) => {
  const handleContent = () => {
    if (typeof content === "string")
      return <InlineFormContent>{content}</InlineFormContent>;
    else return content;
  };

  const handleLabel = () => {
    if (typeof label === "string" || !label)
      return <InlineFormLabel> {label || "Label: "} </InlineFormLabel>;
    else return label;
  };

  const innerContent = () => {
    return (
      <InlineFormContainer>
        {handleLabel()}
        {handleContent()}
      </InlineFormContainer>
    );
  };

  const handleDisplay = () => {
    if (image)
      return <InlineWithImage image={image}>{innerContent()}</InlineWithImage>;
    else return innerContent();
  };

  return handleDisplay();
};

export default InlineForm;
