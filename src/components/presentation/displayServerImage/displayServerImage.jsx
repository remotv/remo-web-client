import React, { useState, useEffect } from "react";
import getServerImage from "../../functional/getServerImage/index";
import "./displayServerImage.scss";

const DisplayServerImage = ({ otherImage, ...props }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    setImage(otherImage || getServerImage({ ...props }));
  });

  //getServerImg requires an object
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
