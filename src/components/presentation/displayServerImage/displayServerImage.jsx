import React from "react";
import getServerImage from "../../functional/getServerImage/index";
import "./displayServerImage.scss";

const DisplayServerImage = ({ ...props }) => {
  console.log(props);
  return (
    <img
      className="displayServerImage__display"
      src={getServerImage({ ...props })}
      alt=""
    />
  );
};

export default DisplayServerImage;
