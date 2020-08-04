import React from "react";
// import axios from "axios";
// import { signup } from "../../../config/index";
import Images from "../../../imgs/placeholders";
import InlineLink from "../../common/links/inlineLink";
import "./signup.scss";

const Signup = (props) => {
  return [
    {
      body: <HandleSignup props={props} />,
    },
    { header: "" },
    { footer: "" },
  ];
};

const HandleSignup = ({ onCloseModal }) => {
  return (
    <div className="signup__container">
      <div className="signup__header">Login / Signup</div>
      <div className="signup__content-container">
        <img src={Images.remoSplash} className="signup__splash" alt="Remo.TV" />
        <div className="signup__text">
          Thanks for signing up and joining the Remo.TV community.
          <br />
          <br />
          We have sent a validation link to the email address you provided.
          <br />
          For security reasons, your access to Remo may be limited without a
          validated email account.
          <br />
          <br />
          By continuing to Remo, you are agreeing to our{" "}
          <InlineLink link="/tos" text="Terms of Service" /> {` & `}
          <InlineLink link="/privacy-policy" text="Privacy Policy" />.
          <br />
          <br />
        </div>

        <button
          className="signup__btn"
          onClick={() => {
            onCloseModal();
          }}
        >
          Continue to Remo
        </button>
      </div>
    </div>
  );
};

export default Signup;
