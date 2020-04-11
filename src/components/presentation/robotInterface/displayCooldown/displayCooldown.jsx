import React, { useState, useEffect } from "react";
import "./displayCooldown.scss";

const DisplayCooldown = ({ count, cooldown }) => {
  const [displayCount, setDisplayCount] = useState(count || cooldown || "---");

  useEffect(() => {
    if (count && cooldown) handleDigits();
  });

  const handleDigits = () => {
    const dif = getlength(cooldown) - getlength(count);
    let formatCount = count;
    console.log("Dif: ", dif);
    for (let i = 0; i < dif; i++) {
      formatCount = " " + formatCount;
      console.log("Loop: ", i);
    }
    console.log("Format Count////", formatCount, "/////");
    setDisplayCount(formatCount);
  };

  const getlength = number => {
    return number.toString().length;
  };

  const handleColor = () => {
    if (count < cooldown) return "cooldown__time-remainder";
    return "cooldown_time-total";
  };

  return (
    <span className="cooldown__container">
      <span className={handleColor()}>{displayCount}</span>
      <span className="cooldown__time-divider">{`/`}</span>
      <span className="cooldown__time-total">{cooldown || "---"}</span>
    </span>
  );
};

export default DisplayCooldown;
