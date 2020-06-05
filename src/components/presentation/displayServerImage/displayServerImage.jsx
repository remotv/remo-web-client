import React from "react";
import getServerImage from "../../functional/getServerImage/index";
import "./displayServerImage.scss";

const DisplayServerImage = ({ otherImage, ...props }) => {
  const image = otherImage || getServerImage({ ...props });
  return <img className="displayServerImage__display" src={image} alt="" />;
};

export default DisplayServerImage;
