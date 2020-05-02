import React, { Component } from "react";
import { Link } from "react-router-dom";
import sortServers from "../robotServer/sortServers";
import BrowseServerCard from "../../presentation/browseServerCard";
import "./browseServers.css";

export default class BrowseServers extends Component {
  state = {};

  componentDidMount() {
    this.props.setServer(null);
    // console.log(this.props);
  }

  handleSorting = () => {
    const { robotServers, followedServers } = this.props;
    const sorted = sortServers(robotServers, followedServers, "default");
    // console.log(sorted);
    return this.handleDisplayServers(sorted);
  };

  handleDisplayServers = (servers) => {
    return servers.map((server) => {
      let followed = this.props.followedServers.find(
        (match) => match.server_id === server.server_id
      );
      if (followed) followed = true;
      else followed = false;
      console.log(server, server.settings);
      return (
        <Link
          to={`/${server.server_name}/${server.settings.default_channel}`}
          key={server.server_id}
        >
          <BrowseServerCard {...server} followed={followed} />
        </Link>
      );
    });
  };

  render() {
    return (
      <div className="browse-servers-container">{this.handleSorting()}</div>
    );
  }
}
