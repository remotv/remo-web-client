import React, { Component } from "react";
import axios from "axios";
import Toggle from "../../common/toggle";
import { robotAPIKey } from "../../../config";
import InlineInput from "../../common/inlineInput/inlineInput";
import "./displayRobotAPIKey.scss";

export default class DisplayRobotAPIKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      apiToggle: false,
      apiKey: "",
      copyState: "",
    };
    this.inputRef = null;

    this.setInputRef = (element) => {
      this.inputRef = element;
    };

    this.handleCopy = () => {
      if (this.inputRef) {
        this.inputRef.select();
        document.execCommand("copy");
        this.setState({ copyState: "Copied!" });
      }
    };
  }

  componentDidMount() {
    this.handleGetAPIKey();
  }

  handleGetAPIKey = () => {
    const { id } = this.props.channel;
    const token = localStorage.getItem("token");
    console.log("Get ROBOT API KEY...");
    axios
      .post(
        robotAPIKey,
        {
          robot_id: id,
        },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log("API KEY RESPONSE: ", res.data);
        this.setState({ apiKey: res.data.key });
      })
      .catch((err) => {
        console.log(err.response.data.error);
        this.setState({ error: err.response.data.error, status: "" });
      });
  };

  handleToggle = () => {
    let toggle = !this.state.apiToggle;
    this.setState({ apiToggle: toggle });
  };

  render() {
    return (
      <div className="displayRobotAPIKey__container">
        <div className="displayRobotAPIKey__header">
          This API key is required for your robot to stream.
        </div>
        <div className="displayRobotAPIKey__container-top">
          <InlineInput
            name={"API Key: "}
            label={"API Key: "}
            labelStyle="displayRobotAPIKey__label"
            type={this.state.apiToggle ? "form" : "password"}
            value={this.state.apiKey}
            readOnly
          />
          <textarea
            aria-hidden="true"
            className="hidden-clipboard"
            ref={this.setInputRef}
            value={this.state.apiKey}
          />
        </div>
        <div className="displayRobotAPIKey__container-bottom">
          <div className="displayRobotAPIKey__toggle-container">
            <Toggle
              toggle={this.state.apiToggle}
              label={"Show API Key"}
              onClick={this.handleToggle}
            />
          </div>

          <div
            className="displayRobotAPIKey__copy-text"
            onClick={this.handleCopy}
          >
            copy to clipboard
          </div>
          <div className="displayRobotAPIKey__copy-success">
            {this.state.copyState}
          </div>
        </div>
      </div>
    );
  }
}
