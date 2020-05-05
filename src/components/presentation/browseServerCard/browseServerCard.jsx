import React from "react";
import defaultImages from "../../../imgs/placeholders";
import Icon from "../../common/icon";
import ICONS from "../../../icons/icons";
import "./browseServerCard.scss";

const BrowseServerCard = ({
  server_name,
  username,
  created,
  followed,
  ...server
}) => {
  const date = new Date(parseInt(created)).toDateString();
  const iconSize = 12;
  const title = `Created by: ${username} on ${date}`;
  const live = server.status.liveDevices.length || 0;

  const handleLiveStatus = () => {
    if (live)
      return <div className="browseServerCard__live-status"> Live: {live}</div>;
    return <React.Fragment />;
  };

  const handleDisplayCount = () => {
    return (
      <div className="browseServerCard__member-count-container">
        <div className="browseServerCard__heart-container">
          {followed ? (
            <Icon icon={ICONS.FOLLOW} color={"#FF0000"} size={iconSize} />
          ) : (
            <Icon icon={ICONS.FOLLOW} color={"#FFF"} size={iconSize} />
          )}
        </div>
        <div className="browseServerCard__count">{server.status.count}</div>
      </div>
    );
  };

  return (
    <div className="browseServerCard__container" title={title}>
      <div className="browseServerCard__image-container">
        {handleLiveStatus()}
        {handleDisplayCount()}
        <img
          className={
            live > 0
              ? "browseServerCard__server-img-live"
              : "browseServerCard__server-img"
          }
          alt=""
          src={defaultImages.default01}
        />
      </div>

      <div className="browseServerCard__info-container">
        <div className="browseServerCard__server-name">{server_name}</div>
      </div>
    </div>
  );
};

export default BrowseServerCard;
