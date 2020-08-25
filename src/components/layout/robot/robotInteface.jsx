import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import { buttonRate, getControls } from "../../../config";
import EditOptions from "./editOptions";
import VolumeControl from "./volumeControl";
import GetLayout from "../../modules/getLayout";
import { GlobalStoreCtx } from "../../providers/globalStore";
import defaultImages from "../../../imgs/placeholders";
import RenderButtons from "./renderButtons";
import socket from "../../socket";
import axios from "axios";
import { ws as configSocket, jsmpegDisabled } from "../../../config/index";
import "./robot.css";

/**
 * Manage layout & behavior for robot controls:
 * - video, audio, and button controls
 *
 * TODO:
 * - Refactor into smaller components
 * - Find a better method for using context to feed video canvas hieght to other components in app
 * - emitGetControls should be a REST call
 * - Fix offline video bg image issue ( troublesome for iOS, Safari, and possibly firefox )
 */

export default class RobotInterface extends Component {
  state = {
    controls: [], //controls to render
    logClicks: [], //records incoming clicks by users from the server
    displayLog: true, //display activity
    clickCounter: 0, //number of clicks / presses behing sent to the server by this user
    controlsId: "", //id reference for controls stored in serverside database
    renderCurrentKey: null, //key this user is activiely pressing
    renderPresses: [], //render user activity streamed from the server
    canvasHeight: null, //height of the video display area
  };

  currentKey = null;

  handleBlur = () => {
    if (this.currentKey) {
      this.currentKey = null;
      this.setState({ renderCurrentKey: null });
    }
  };

  sendCurrentKey = () => {
    const button = this.keyMap[this.currentKey];
    if (button && !button.disabled && this.props.chatTabbed === false) {
      this.handleClick({
        user: this.props.user,
        controls_id: this.state.controlsId,
        socket: socket,
        button: button,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    //Clear video / audio on channel change
    if (prevProps.channel !== this.props.channel && this.props.channel) {
      this.clearAV();
      this.connectAV();
    }

    //update size of video canvas when the browser window changes sizes
    if (
      this.refs["video-canvas"] &&
      this.refs["video-canvas"].clientHeight &&
      this.refs["video-canvas"].clientHeight !== this.state.canvasHeight
    ) {
      this.updateCanvas();
    }

    //handle channel change / channels list change and no controls id
    if (
      this.props.channel !== prevProps.channel ||
      this.props.channels.length !== prevProps.channels.length
    ) {
      this.emitGetControls();
    }
  }

  //Get controls from server
  emitGetControls = () => {
    const channel = this.props.channels.find(
      (chan) => chan.id === this.props.channel
    );

    if (channel) {
      socket.emit("GET_CONTROLS", channel);
    }
  };

  connectAV() {
    if (this.props.channel) {
      this.connectA();
      this.connectV();
    }
  }

  //records updates to controls state streamed from server
  onControlStateUpdated = (data) => {
    let controls = [...this.state.controls];
    let updateControls = [];
    data.forEach((item) => {
      controls.forEach((button) => {
        if (button.id === item.id) {
          //make sure buttons remain disabled on state change for non users
          if (!this.props.user) item.disabled = true;
          updateControls.push(item);
        } else updateControls.push(button);
        return;
      });
    });
    this.onGetControls({ buttons: updateControls, id: this.state.controlsId });
  };

  onMount = () => {
    socket.on("GET_USER_CONTROLS", this.onGetControls);
    socket.on(BUTTON_COMMAND, this.onButtonCommand);
    socket.on("CONTROLS_UPDATED", this.onControlsUpdated);
    socket.on("CONTROL_STATE_UPDATED", this.onControlStateUpdated);
    if (this.state.controls.length === 0)
      this.setState({ controls: testButtons });
    this.setupKeyMap(testButtons);
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
    document.addEventListener("blur", this.handleBlur);
    this.sendInterval = setInterval(this.sendCurrentKey, buttonRate);
    this.connectAV();
    this.emitGetControls();
  };

  componentDidMount() {
    this.onMount();
  }

  connectA = () => {
    if (jsmpegDisabled) return;
    //need to add client options for video relay

    this.audioPlayer = new window.JSMpeg.Player(
      `wss://remo.tv/receive?name=${this.props.channel}-audio`,
      { video: false, disableWebAssembly: true }
    );
  };

  connectV = () => {
    if (jsmpegDisabled) return;

    this.videoPlayer = new window.JSMpeg.Player(
      `wss://remo.tv/receive?name=${this.props.channel}-video`,
      {
        canvas: this.refs["video-canvas"],
        videoBufferSize: 1 * 1024 * 1024,
        audio: false,
        disableWebAssembly: true,
        opacity: true,
      }
    );
  };

  updateCanvas = () => {
    const height = this.refs["video-canvas"].clientHeight;
    this.setState({ canvasHeight: height });
  };

  clearA = () => {
    try {
      if (this.audioPlayer) {
        this.audioPlayer.destroy();
      }
    } catch (e) {
      console.error(e);
    }
  };

  clearV = () => {
    try {
      if (this.videoPlayer) {
        this.videoPlayer.destroy();
      }
    } catch (e) {
      console.error(e);
    }
  };

  clearAV = () => {
    this.clearA();
    this.clearV();
  };

  componentWillUnmount() {
    this.clearAV();
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("keyup", this.handleKeyUp);
    document.removeEventListener("blur", this.handleBlur);
    socket.off(BUTTON_COMMAND, this.onButtonCommand);
    socket.off("GET_USER_CONTROLS", this.onGetControls);
    socket.off("CONTROLS_UPDATED", this.onControlsUpdated);
    socket.off("CONTROL_STATE_UPDATED", this.onControlStateUpdated);

    clearInterval(this.sendInterval);
  }

  handleKeyDown = (e) => {
    if (!this.props.chatTabbed && !this.props.isModalShowing) {
      if (this.currentKey !== e.key) {
        this.setState({ renderCurrentKey: e.key });
        this.currentKey = e.key;
        this.sendCurrentKey();
      }
    }
  };

  handleKeyUp = (e) => {
    if (e.key === this.currentKey) {
      this.currentKey = null;
      this.setState({ renderCurrentKey: null });
    }
  };

  keyMap = {};

  setupKeyMap = (controls) => {
    const keyMap = {};
    controls.map((button) => {
      return (keyMap[button.hot_key] = button);
    });
    this.keyMap = keyMap;
  };

  onButtonCommand = (command) => {
    this.handleLoggingClicks(command);
    this.handleRenderPresses(command);
  };

  onGetControls = (getControlData) => {
    if (getControlData && getControlData.buttons.length > 0) {
      this.setState({
        controls: getControlData.buttons,
        controlsId: getControlData.id,
      });
      this.setupKeyMap(getControlData.buttons);
    }
  };

  onControlsUpdated = () => {
    if (this.props.channelInfo && this.props.channelInfo.controls) {
      socket.emit("GET_CONTROLS", this.props.channelInfo);
    } else {
      this.handleGetControls();
    }
  };

  //Uses an API call to get controls for specific user.
  handleGetControls = async () => {
    const token = localStorage.getItem("token");
    await axios
      .post(
        getControls,
        {
          channel_id: this.props.channel,
        },
        {
          headers: token ? { authorization: `Bearer ${token}` } : "",
        }
      )
      .then((res) => {
        this.onGetControls(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return null;
  };

  handleClick = (click) => {
    if (this.props.user) {
      const isOwner = this.props.server.owner_id === this.props.user.id;
      if (isOwner || !click.button.disabled) {
        socket.emit(BUTTON_COMMAND, {
          user: click.user,
          button: click.button,
          controls_id: this.state.controlsId,
          channel: this.props.channel,
          server: this.props.server.server_id,
        });
      }
      //else pop up the login message
    }
  };

  handleRenderPresses = (press) => {
    let updatePresses = this.state.renderPresses;
    press.counter = setTimeout(() => this.handleClear(press), 200);
    updatePresses.push(press);
    this.setState({ renderPresses: updatePresses });
  };

  handleClear = (press) => {
    clearTimeout(press.counter);
    let updatePresses = [];
    this.state.renderPresses.map((getPress) => {
      if (press.button.id === getPress.button.id) {
        //do nothing
      } else {
        updatePresses.push(getPress);
      }
      return null;
    });

    if (this.state.renderPresses !== updatePresses)
      this.setState({ renderPresses: updatePresses });
  };

  handleLoggingClicks = (click) => {
    let { logClicks, clickCounter } = this.state;
    clickCounter++;
    click.count = clickCounter;
    logClicks.push(click);
    if (logClicks.length > 12) {
      logClicks.shift();
    }

    this.setState({ logClicks: logClicks, clickCounter: clickCounter });
  };

  renderClickLog = () => {
    return this.state.logClicks.map((click) => {
      return (
        <div className="display-info" key={click.count}>
          {`${click.user.username} pressed ${click.button.label}`}
        </div>
      );
    });
  };

  renderButtons = () => {
    return (
      <RenderButtons
        controls={this.state.controls}
        renderPresses={this.state.renderPresses}
        renderCurrentKey={this.state.renderCurrentKey}
        onClick={(e) => this.handleClick(e)}
        user={this.props.user}
        controls_id={this.state.controlsId}
        socket={socket}
        server={this.props.server}
      />
    );
  };

  handleDisplayActivity = () => {
    return (
      <div className="display-info-container">
        {this.state.displayLog ? this.renderClickLog() : <React.Fragment />}
      </div>
    );
  };

  handleMobileOptionsMenu = () => {
    return (
      <div
        className="mobile-options-menu"
        ref={(options) => {
          this.options = options;
        }}
      >
        ...
      </div>
    );
  };

  //This is a mess.
  handleCanvasHeight = () => {
    const { canvasHeight } = this.state;
    return (
      <GlobalStoreCtx.Consumer>
        {({ setCanvas }) => setCanvas(canvasHeight)}
      </GlobalStoreCtx.Consumer>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.props.channel ? (
          <div className="robot-container">
            <div className="robot-display-container">
              <canvas className="video-canvas" ref="video-canvas">
                <img
                  className="video-poster"
                  src={defaultImages.videoImg}
                  alt={"video background"}
                />
              </canvas>

              <div className="display-controls-container">
                <VolumeControl
                  player={this.audioPlayer}
                  channel={this.props.channel}
                />
              </div>

              <GetLayout
                renderSize={768}
                renderDesktop={this.handleDisplayActivity}
              />
            </div>
            <GetLayout renderMobile={this.handleMobileOptionsMenu} />
            {this.handleCanvasHeight()}
            <div className="robot-controls-container">
              {this.renderButtons()}
              <br />
              <EditOptions
                server={this.props.server}
                user={this.props.user}
                modal={this.props.modal}
                onCloseModal={this.props.onCloseModal}
                channel={this.props.channel}
              />
            </div>
          </div>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

const testButtons = [{ break: "line", label: "", id: "1" }];
