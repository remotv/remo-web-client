import React, { Component } from "react";
import axios from "axios";
import { setDefaultChannel } from "../../../config";
import "../inlineForms.css";

export default class DefaultChannel extends Component {
  state = {
    isDefault: null,
    error: "",
    status: "",
  };

  handleSetDefault = async () => {
    const { id, server_id } = this.props.channel;
    this.setState({ status: "...pending." });
    const token = localStorage.getItem("token");
    axios
      .post(
        setDefaultChannel,
        {
          channel_id: id,
          server_id: server_id,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("Set Default Channel Response: ", res.data);
        if (res.data.error) {
          this.setState({ error: res.data.error });
        } else {
          this.setState({ status: "Channel is Default" });
        }
      })
      .catch((err) => {
        console.log(err.response.data.error);
        this.setState({ error: err.response.data.error });
      });
  };

  componentDidMount() {
    this.handleCheckDefault();
  }

  handleCheckDefault = () => {
    const { server, channel } = this.props;
    if (server.settings.default_channel === channel.id)
      this.setState({ status: "Channel is Default." });
    return null;
  };

  handleStatus = () => {
    const { status, error } = this.state;
    if (error) return <div className="inline-error">{error}</div>;
    if (status !== "")
      return <div className="inline-no-action"> {status} </div>;
    return (
      <div className="inline-action" onClick={() => this.handleSetDefault()}>
        {" "}
        Set as Default{" "}
      </div>
    );
  };

  handleDisplay = () => {
    return (
      <div className="inline-container">
        <div className="inline-label"> Make this my default channel: </div>
        <div className="inline-info"></div>
        {this.handleStatus()}
      </div>
    );
  };

  render() {
    return this.handleDisplay();
  }
}
