import React from "react";
import "./displayCooldown.scss";

const DisplayCooldown = ({ count, cooldown }) => {
  return (
    <span className="cooldown__container">
      <span className="cooldown__time">{count || cooldown}</span>
      {` /`}
      <span className="cooldown__time">{cooldown}</span>
    </span>
  );
};

export default DisplayCooldown;
