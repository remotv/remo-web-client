import React, { useState } from "react";
import getServerImage from "../../functional/getServerImage/index";
import "./displayServerImage.scss";

const DisplayServerImage = ({ otherImage, ...props }) => {
  const [image, setImage] = useState(() => {
    return otherImage || getServerImage({ ...props });
  });

  const handleError = () => setImage(getServerImage({}));
  return (
    <img
      className="displayServerImage__display"
      src={image}
      alt=""
      onError={() => handleError()}
    />
  );
};

export default DisplayServerImage;
