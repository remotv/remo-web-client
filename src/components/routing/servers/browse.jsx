import React from "react";
import { Link } from "react-router-dom";
import defaultImages from "../../../imgs/placeholders";

const Browse = ({ selectedServer }) => {
  let style = !selectedServer
    ? "display-robot-server-container selected-server align-add-server"
    : "display-robot-server-container align-add-server";
  return (
    <Link to={`/get`}>
      <div className={style}>
        <img
          className="display-robot-server-img"
          alt="Browse Servers"
          src={defaultImages.browse}
        />
        <div className="display-robot-server">browse</div>
      </div>
    </Link>
  );
};

export default Browse;
