import React, { Fragment, useState } from "react";
import DisplayServerImage from "../../../presentation/displayServerImage";
import InlineButton from "../../../presentation/inlineButton";
import {
  InlineFormStack,
  InlineFormContainer,
} from "../../../presentation/inlineForm";

const UploadServerImage = ({ ...props }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  console.log(props);

  const handleImage = () => {
    return <DisplayServerImage {...props} />;
  };

  const handleSetFile = (e) => {
    let file = e.target.files[0];
    setFile(file);
  };

  const handleUpload = () => {
    console.log("Upload!");
    setStatus({ status: "Uploading Image..." });
    return null;
  };

  const handleDisplayUpload = () => {
    if (file)
      return (
        <InlineFormContainer>
          <InlineButton onClick={() => handleUpload()}> Upload </InlineButton>
        </InlineFormContainer>
      );
    return <Fragment />;
  };

  const handleDisplayStatus = () => {
    if (status !== "")
      return <InlineFormContainer> {status}</InlineFormContainer>;
  };

  const handleContent = () => {
    return (
      <InlineFormContainer>
        <input
          type="file"
          name="myFile"
          onChange={(file) => handleSetFile(file)}
        />
      </InlineFormContainer>
    );
  };
  return (
    <Fragment>
      <InlineFormContainer>
        {handleImage()}
        <InlineFormStack>
          {handleContent()}
          {handleDisplayUpload()}
          {handleDisplayStatus()}
        </InlineFormStack>
      </InlineFormContainer>
    </Fragment>
  );
};

export default UploadServerImage;
