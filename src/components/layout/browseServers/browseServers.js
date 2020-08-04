import React, { Component } from "react";
import { Link } from "react-router-dom";
import sortServers from "../robotServer/sortServers";
import BrowseServerCard from "../../presentation/browseServerCard";
import "./browseServers.css";

export default class BrowseServers extends Component {
  state = {};

  componentDidMount() {
    this.props.setServer(null);
  }

  handleSorting = () => {
    const { robotServers, followedServers } = this.props;
    if (!robotServers) {
      console.log(
        "Client Error, for some reason the client did not wait on the list of robot servers before attempting to display the browse servers page."
      );
      return this.handleDisplayServers(null);
    }
    const sorted = sortServers(robotServers, followedServers, "default");
    return this.handleDisplayServers(sorted);
  };

  handleDisplayServers = (servers) => {
    if (!servers) return <BrowseServerCard placeholder />;
    return servers.map((server) => {
      let followed =
        this.props.followedServers &&
        this.props.followedServers.find(
          (match) => match.server_id === server.server_id
        );
      if (followed) followed = true;
      else followed = false;
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
