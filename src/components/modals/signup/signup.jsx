import React from "react";
import LoginWidget from "../../layout/login/loginWidget";
import Modal from "../../modals/modal";
import "./signup.scss";

const Signup = (props) => {
  console.log("SIGNUP: ", props);
  return [
    {
      // body: <HandleSignup props={props} />,
      body: <LoginWidget props={props} />,
    },
    { header: "" },
    { footer: "" },
  ];
};

export default Signup;
