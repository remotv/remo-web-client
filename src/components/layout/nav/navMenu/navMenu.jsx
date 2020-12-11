import React from "react";
import { documentationLink } from "../../../../config";

const NavMenu = () => {
  const navLink = ({ text, url }) => {
    return (
      <React.Fragment>
        <a
          href={url}
          onClick={(e) => {
            e.preventDefault();
            window.open(url, "_blank");
          }}
        >
          <div className="navMenu__item">{text}</div>
        </a>
      </React.Fragment>
    );
  };

  return (
    <div className="navMenu__container">
      {navLink({ text: "docs", url: documentationLink })}
    </div>
  );
};

export default NavMenu;
