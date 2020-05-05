import React, { Component } from "react";
import { DisplayCooldown } from "../../presentation/robotInterface/";
import "./robot.css";

export default class RenderButtons extends Component {
  //single button render
  handleButton = ({ aButton, style, hotKeyStyle }) => {
    const { onClick, user, controls_id, socket } = this.props;
    let hotKeyRender = this.handleButtonStyle(aButton);
    if (aButton && aButton.hot_key && aButton.key)
      hotKeyRender = "robtn robtn-hot-key";
    return (
      <button
        className={hotKeyRender}
        key={aButton.id}
        onClick={() =>
          onClick({
            user: user,
            controls_id: controls_id,
            socket: socket,
            button: aButton,
          })
        }
        style={style}
      >
        {aButton.hot_key ? (
          <span className={hotKeyStyle}>{aButton.hot_key}</span>
        ) : (
          <React.Fragment />
        )}
        {aButton.label}
        {aButton.cooldown ? (
          <DisplayCooldown count={aButton.count} cooldown={aButton.cooldown} />
        ) : (
          <React.Fragment />
        )}
      </button>
    );
  };

  //Render a break instead of a button
  handleBreak = (breakPoint, index) => {
    let renderBreak = null;
    if (breakPoint.label !== "") {
      renderBreak = (
        <div className="label-container">
          <div className={this.handleBreakPointStyle(index)}>
            {breakPoint.label}
          </div>
        </div>
      );
    }

    return (
      <React.Fragment key={`break-${index}`}>
        {index === 0 ? <React.Fragment /> : <br />}
        {renderBreak}
      </React.Fragment>
    );
  };

  //style assignment for the main part of the button display
  handleButtonStyle = (aButton) => {
    const isOwner = this.props.server.owner_id === this.props.user.id;
    if (aButton.disabled && isOwner) return "robtn-not-disabled-for-owner";
    else if (aButton.disabled) return "robtn-disabled";
    if (aButton.access && aButton.access === "owner") return "robtn-admin";
    return "robtn";
  };

  //style assignment for the button hotkey display
  handleHotKeyStyle = (aButton) => {
    if (aButton.disabled) return "hotkey-disabled";
    if (aButton.access && aButton.access === "owner") return "hotkey-admin";
    return "hotkey";
  };

  handleBreakPointStyle = (index) => {
    if (index === 0) return "label label-top";
    return "label";
  };

  //map through all the buttons & display behavior
  handleButtons = () => {
    const {
      controls,
      renderPresses,
      renderCurrentKey,
      user,
      server,
    } = this.props;
    const isOwner = server.owner_id === user.id;
    if (controls) {
      return controls.map((aButton, index) => {
        let hotKeyStyle = this.handleHotKeyStyle(aButton);
        let style = {};
        if (
          aButton.hot_key === renderCurrentKey &&
          (isOwner || !aButton.disabled)
        ) {
          style = {
            boxShadow: "inset 0 0 0 2px rgb(5, 214, 186)",
            transform: "translateY(4px)",
            WebkitTransform: "translateY(4px)",
          }; // noice!
        }
        renderPresses.map((press) => {
          if (press && press.button.id === aButton.id) {
            if (press.button.access && press.button.access === "owner") {
              style.backgroundColor = "#e44884";
              hotKeyStyle = "hotkey hotkey-admin-highlight";
            } else if (press.button.disabled) {
              hotKeyStyle = "hotkey hotkey-disabled-highlight";
              style.backgroundColor = "#5e5e5e";
            } else {
              style.backgroundColor = "rgb(64, 76, 131)";
              hotKeyStyle = "hotkey hotkey-highlight";
            }
          }
          return null;
        });
        if (aButton.break) {
          //do nothing?
        }
        if (aButton.break) return this.handleBreak(aButton, index);
        return this.handleButton({ aButton, style, hotKeyStyle });
      });
    }
  };

  render() {
    return <React.Fragment>{this.handleButtons()}</React.Fragment>;
  }
}
