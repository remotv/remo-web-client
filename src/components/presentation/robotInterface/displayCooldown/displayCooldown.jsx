import React, { useState, useEffect } from "react";
import "./displayCooldown.scss";

const DisplayCooldown = ({ count, cooldown }) => {
  const [displayCount, setDisplayCount] = useState(count || cooldown);

  useEffect(() => {
    if (count && cooldown) handleDigits();
  });

  const handleDigits = () => {
    const dif = getlength(cooldown) - getlength(count);
    let formatCount = count;
    for (let i = 0; i < dif; i++) formatCount = " " + formatCount;
    setDisplayCount(formatCount);
    console.log("Display Count: ", displayCount);
  };

  const getlength = number => {
    return number.toString().length;
  };

  return (
    <span className="cooldown__container">
      <span className="cooldown__time-remainder">{displayCount}</span>
      <span className="cooldown__time-divider">{`/`}</span>
      <span className="cooldown__time-total">{cooldown}</span>
    </span>
  );
};

export default DisplayCooldown;
