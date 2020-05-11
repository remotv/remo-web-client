import React, { Component } from "react";
import axios from "axios";
import { setDefaultChannel } from "../../../config";
import InlineResponseHandler from "../../functional/inlineResponseHandler";
import "./defaultChannel.scss";

export default class DefaultChannel extends Component {
  state = {
    isDefault: null,
    error: "",
    status: "",
  };

  handleCloseResponse = () => {
    this.setState({ error: "", success: "" });
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
          this.setState({
            status: "Channel is Default",
            success: "Channel successfully set as default",
          });
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
    const { status } = this.state;
    if (status !== "")
      return <div className="defaultChannel__inline-no-action"> {status} </div>;
    return (
      <div
        className="defaultChannel__inline-action"
        onClick={() => this.handleSetDefault()}
      >
        {" "}
        Set as Default{" "}
      </div>
    );
  };

  render() {
    const { error, success } = this.state;
    return (
      <React.Fragment>
        <div className="defaultChannel__container">
          <div className="defaultChannel__label">
            {" "}
            Make this my default channel:{" "}
          </div>
          {this.handleStatus()}
        </div>
        {error || success ? (
          <InlineResponseHandler
            error={error}
            success={success}
            onClose={this.handleCloseResponse}
          />
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}
