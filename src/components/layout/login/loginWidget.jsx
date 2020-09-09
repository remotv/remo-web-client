import React, { Component } from "react";
import Login from "./login";
import Signup from "./signup";

export default class LoginWidget extends Component {
  state = {
    display: "signup",
  };

  displayLogin = () => {
    return <Login {...this.props} noRedirect />;
  };

  displaySignUp = () => {
    return <Signup {...this.props} noRedirect />;
  };

  handleSelect = () => {
    const { display } = this.state;
    return (
      <div className="select-container">
        <div
          className={
            display === "signup"
              ? "select-option selected-option"
              : "select-option"
          }
          onClick={() => this.handleClick("signup")}
        >
          - SignUp
        </div>
        <div className="spacer">or</div>
        <div
          className={
            display === "login"
              ? "select-option selected-option"
              : "select-option"
          }
          onClick={() => this.handleClick("login")}
        >
          Login -
        </div>
      </div>
    );
  };

  handleClick = (e) => {
    this.setState({ display: e });
  };

  handleFeedback = () => {
    const { modalFeedback } = this.props;
    if (modalFeedback)
      return <div className="widget-modal-feedback">{modalFeedback}</div>;
    else return <React.Fragment />;
  };

  render() {
    const { display } = this.state;
    const { type } = this.props;
    let style = "";
    if (type && type === "modal") style = "widget-container-modal";
    else style = "widget-container";
    return (
      <React.Fragment>
        <div className={style}>
          {this.handleFeedback()}
          {this.handleSelect()}
          {display === "signup" ? this.displaySignUp() : this.displayLogin()}
        </div>
      </React.Fragment>
    );
  }
}
