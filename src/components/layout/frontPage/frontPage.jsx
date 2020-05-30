import React, { Component } from "react";
import "./frontPage.css";
import axios from "axios";
import { getStats, patreonUrl, discordUrl, githubUrl } from "../../../config";
import defaultImages from "../../../imgs/placeholders";

// import TOS from "./tos";
// import PrivacyPolicy from "./privacyPolicy";

/*
Other fun stats to display: 
Commands Sent Per ( time ), 
Chat Messages Sent Per ( time ),
Active Users in the last 24 hours
*/

export default class FrontPage extends Component {
  state = {
    activeUsers: "...",
    totalUsers: "...",
    totalServers: "...",
    activeDevices: "...",
    registeredDevices: "...",
  };

  async componentDidMount() {
    await axios.get(getStats).then((res) => {
      // console.log(res);
      this.setState({
        activeUsers: res.data.activeUsers,
        totalUsers: res.data.totalUsers,
        totalServers: res.data.totalServers,
        activeDevices: res.data.activeDevices,
        registeredDevices: res.data.registeredDevices,
      });
    });
  }

  render() {
    const {
      activeUsers,
      totalUsers,
      totalServers,
      activeDevices,
      registeredDevices,
    } = this.state;
    return (
      <div className="front-page-container">
        <div className="front-page-text">
          <DisplayAlert show={true} />
          <br />
          <span>
            Control & share robots online remotely in real time with remo.tv{" "}
            <br />
            Please check documenation and links below for more info. <br />
          </span>
          <br />
          <div>Best used on Desktop with Chrome Browser</div>
          <div>...</div>
          <div>
            Users currently Online: <span className="stat">{activeUsers}</span>{" "}
          </div>
          <div>
            Total users signed up to site:{" "}
            <span className="stat">{totalUsers}</span>{" "}
          </div>
          <div>
            Robot Servers: <span className="stat">{totalServers}</span>
          </div>
          <div>
            Active Devices Online: <span className="stat">{activeDevices}</span>{" "}
          </div>
          <div>
            {" "}
            Total Devices Registered:{" "}
            <span className="stat">{registeredDevices}</span>
          </div>
          <div>...</div>
          <br />

          <div className="front-page-link-container">
            <AddARobot />
            <Discord />
            <Patreon />
          </div>
          <Platform />
          <Medium />
        </div>
        <div className="print-row">
          <DisplayTOS />
          <div className="divider">{" | "}</div>
          <DisplayPrivacyPolicy />
        </div>
      </div>
    );
  }
}

const DisplayTOS = () => {
  return <SingleLink link="/tos" text="terms of service " />;
};

const DisplayPrivacyPolicy = () => {
  return <SingleLink link="/privacy-policy" text="privacy policy" />;
};

const AddARobot = () => {
  return (
    <FPLinkCard
      link={githubUrl}
      text="Software for adding a robot."
      image={defaultImages.gitIcon}
    />
  );
};

const Platform = () => {
  return (
    <InlineLink
      link="https://github.com/jillytot/remote-control"
      text="Remo Web Platform Repo: "
    />
  );
};

const Discord = () => {
  return (
    <FPLinkCard
      link={discordUrl}
      text="Join our Discord."
      image={defaultImages.discordIcon}
    />
  );
};

const Patreon = () => {
  return (
    <FPLinkCard
      link={patreonUrl}
      text="Support us on Patreon!"
      image={defaultImages.patreonIcon}
    />
  );
};

const Medium = () => {
  return (
    <InlineLink link="https://medium.com/remotv" text="Medium Dev Blog: " />
  );
};

const DisplayAlert = ({ show }) => {
  return show === true ? (
    <div className="alert">
      <span className="bolder">Important Notice 05/27/2020 </span>
      <div>
        In order to make remo more secure, we are requiring all robot video
        streams to be authenticated. The robot's API key must be included in the
        authorization header.
        <div>
          <br />
          If you are using the RemoTV python controller from the main repo, all
          you need to do is pull the latest update, and you should be good to
          go. This update is mandatory if you want your robot to continue to
          work with Remo. If you have questions or comments, the discord link
          below is the best place to get in touch, otherwise you can email
          jill@remo.tv.
        </div>
      </div>
    </div>
  ) : (
    <React.Fragment />
  );
};

const SingleLink = ({ link, text }) => {
  return (
    <div className="inline-link">
      <a
        href={link}
        onClick={(e) => {
          e.preventDefault();
          window.open(link, "_blank");
        }}
      >
        {text}
      </a>
    </div>
  );
};

const InlineLink = ({ link, text }) => {
  return (
    <div className="inline-link">
      {text}
      <a
        href={link}
        onClick={(e) => {
          e.preventDefault();
          window.open(link, "_blank");
        }}
      >
        {link}
      </a>
    </div>
  );
};

const FPLinkCard = ({ link, image, text }) => {
  return (
    <React.Fragment>
      <a
        href={link}
        onClick={(e) => {
          e.preventDefault();
          window.open(link, "_blank");
        }}
      >
        <div className="fp-card">
          <img className="icon-element" src={image} title={link} alt="" />
          <br />
          {text}
        </div>
      </a>
    </React.Fragment>
  );
};
