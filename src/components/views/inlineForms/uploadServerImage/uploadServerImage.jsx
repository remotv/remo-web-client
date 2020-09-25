import React, { Fragment, useState } from "react";
import DisplayServerImage from "../../../presentation/displayServerImage";
import InlineButton from "../../../presentation/inlineButton";
import {
  InlineFormStack,
  InlineFormContainer,
} from "../../../presentation/inlineForm";
import { uploadServerImage } from "../../../../config";
import Requests from "../../../functional/requests";
import InlineResponseHandler from "../../../functional/inlineResponseHandler/index";

const UploadServerImage = ({ ...props }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [doUpload, setDoUpload] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);

  const handleImage = () => {
    return (
      <DisplayServerImage otherImage={previewImg} {...props} key={previewImg} />
    );
  };

  const handlePending = (pending) => {
    setPending(pending);
    return;
  };

  const handleSetFile = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setError("Image format must be JPG or PNG");
      return;
    }
    if (file.size >= 1024 * 1024) {
      setError("File must be less than 1MB");
      return;
    }
    setFile(file);
    const objUrl = URL.createObjectURL(file);
    console.log(objUrl);
    setPreviewImg(objUrl);
  };

  const handleResult = (result) => {
    console.log("RESULT: ", result);
    if (result.error) setError(result.error);
    else setSuccess(result);
    setStatus({ status: "" });
    setDoUpload(false);
    setFile(null);
  };

  const handleUpload = () => {
    console.log("Upload!");
    setStatus({ status: "Uploading Image..." });
    setDoUpload(true);
    return null;
  };

  const handleDoUpload = () => {
    if (doUpload && !success && !error) {
      const url = uploadServerImage.replace(":id", props.server_id);
      let formData = new FormData();
      formData.append("server_img", file);
      return (
        <Requests
          url={url}
          handleResult={(result) => handleResult(result)}
          payload={formData}
          pending={pending}
          handlePending={(p) => handlePending(p)}
        />
      );
    } else return <React.Fragment />;
  };

  const handleCloseResponse = () => {
    setSuccess("");
    setError("");
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
    if (status && status.status !== "")
      return <InlineFormContainer> {status.status}</InlineFormContainer>;
    return <React.Fragment />;
  };

  const handleContent = () => {
    if (error || success) return <React.Fragment />;
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
          <InlineResponseHandler
            success={success}
            error={error}
            onClose={handleCloseResponse}
          />
        </InlineFormStack>
      </InlineFormContainer>
    </Fragment>
  );
};

export default UploadServerImage;
