import React from "react";
import "./user.css";
import "./../../../styles/common.css";
import { LOGOUT } from "../../../events/definitions";
import defaultImages from "../../../imgs/placeholders";
import { Link } from "react-router-dom";

const NavBar = ({ user, socket }) => {
  const displayName = user["username"];

  const handleClick = user => {
    console.log("Handle Logout: ", user);
    user !== null
      ? socket.emit(LOGOUT, user, () => {
          console.log("Logging Out");
        })
      : console.log("User Logout Error");
    console.log("Clearing token from local storage");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="nav-container">
      <Link to="/">
        {" "}
        <div className="logo-container">
          <img className="logo" alt="" src={defaultImages.remoLogo} />
        </div>
      </Link>

      <div className="user-container">
        <div className="user">
          {displayName}{" "}
          <button
            className="user-logout btn"
            onClick={() => {
              handleClick(user);
            }}
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;