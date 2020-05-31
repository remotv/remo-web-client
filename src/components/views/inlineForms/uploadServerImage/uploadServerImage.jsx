import React, { Fragment, useState } from "react";
import DisplayServerImage from "../../../presentation/displayServerImage";
import InlineButton from "../../../presentation/inlineButton";
import {
  InlineFormStack,
  InlineFormContainer,
} from "../../../presentation/inlineForm";
import { uploadServerImage } from "../../../../config";
import Requests from "../../../functional/requests";

const UploadServerImage = ({ ...props }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [doUpload, setDoUpload] = useState(false);

  console.log(props);

  const handleImage = () => {
    return <DisplayServerImage {...props} />;
  };

  const handleSetFile = (e) => {
    let file = e.target.files[0];
    setFile(file);
  };

  const handleResult = (result) => {
    console.log("RESULT: ", result);
  };

  const handleUpload = () => {
    console.log("Upload!");
    setStatus({ status: "Uploading Image..." });
    setDoUpload(true);
    return null;
  };

  const handleDoUpload = () => {
    if (doUpload) {
      const url = uploadServerImage.replace(":id", props.server_id);
      let formData = new FormData();
      formData.append("server_img", file);
      return (
        <Requests
          url={url}
          handleResult={(result) => handleResult(result)}
          payload={formData}
        />
      );
    } else return <React.Fragment />;
  };

  const handleDisplayUpload = () => {
    if (file)
      return (
        <InlineFormContainer>
          <InlineButton onClick={() => handleUpload()}>Upload</InlineButton>
        </InlineFormContainer>
      );
    return <Fragment />;
  };

  const handleDisplayStatus = () => {
    if (status !== "")
      return <InlineFormContainer> {status.status}</InlineFormContainer>;
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
          {handleDoUpload()}
          {handleDisplayStatus()}
        </InlineFormStack>
      </InlineFormContainer>
    </Fragment>
  );
};

export default UploadServerImage;
