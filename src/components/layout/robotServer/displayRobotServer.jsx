import React from "react";
import "./robotServer.css";
import defaultImages from "../../../imgs/placeholders";
import { Link } from "react-router-dom";
import getServerImage from "../../functional/getServerImage/index";

const DisplayRobotServer = ({
  serverName,
  defaultChannel,
  displayClasses,
  liveDevices,
  settings,
  image_id,
}) => {
  return (
    <Link to={`/${serverName}/${defaultChannel}`}>
      <div className={displayClasses}>
        <img
          className={
            liveDevices.length > 0
              ? "display-robot-server-img live"
              : "display-robot-server-img"
          }
          alt=""
          src={getServerImage({ image_id: image_id })}
        />
        {handleShowPrivacy(settings)}
        <div className={"display-robot-server"}>{serverName}</div>
      </div>
    </Link>
  );
};

const handleShowPrivacy = (settings) => {
  const setPrivate = settings.private;
  const { unlist } = settings;
  if (setPrivate)
    return (
      <div className="display-privacy" title="Private">
        <img
          className="privacy-icon"
          src={defaultImages.privacyIcon}
          title="Private Server"
          alt=""
        />
      </div>
    );
  if (unlist)
    return (
      <div className="display-privacy" title="Unlisted">
        <img
          className="privacy-icon"
          src={defaultImages.unlistedIcon}
          title="Unlisted Server"
          alt=""
        />
      </div>
    );
  // console.log(unlist, setPrivate, settings);
  return <React.Fragment />;
};

export default DisplayRobotServer;
