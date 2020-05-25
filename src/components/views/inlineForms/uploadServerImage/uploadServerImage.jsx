import React, { Fragment, useEffect } from "react";
import InlineForm from "../../../templates/InlineForm/inlineForm";
import DisplayServerImage from "../../../presentation/displayServerImage";

const UploadServerImage = ({ ...props }) => {
  console.log(props);

  const handleImage = () => {
    return <DisplayServerImage {...props} />;
  };

  const handleContent = () => {
    return "Content";
    //  return <InlineForm label="Server Image:" content="" />;
  };
  return (
    <Fragment>
      <InlineForm
        label="Server Image: "
        content={handleContent()}
        image={handleImage()}
      />
    </Fragment>
  );
};

export default UploadServerImage;
