import React, { Component } from "react";
import io from "socket.io-client";
import Layout from "./layout/layout";
import { socketUrl } from "../settings/clientSettings";
import { HEARTBEAT, MESSAGE_SENT } from "../services/sockets/events";
import { LOGIN_TRUE, SEND_CHAT } from "./localEvents";

//Will likely move most of the interaction with the server to here.
export default class EventHandler extends Component {
  state = {
    socket: null
  };

  async componentDidMount() {
    await this.initSocket();
    this.handleResponse();
    this.handleEvents();
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on("connect", () => {
      console.log("Socket Connected: ", socket["id"]);
    });
    this.setState({ socket });
  };

  handleResponse = () => {
    const { socket } = this.state;
    if (socket !== null) {
      socket.on(HEARTBEAT, () => {
        let checkUser = this.state.user
          ? `${this.state.user["name"]}-${socket["id"]}`
          : socket["id"];
        socket.emit(HEARTBEAT, checkUser);
      });
    }
  };

  handleEvents = (event, obj) => {
    const { socket, user } = this.state;
    if (event === LOGIN_TRUE) {
      this.setState({ user: obj });
    }

    if (event === SEND_CHAT) {
      console.log("Send Chat to Server: ", obj);
      socket.emit(MESSAGE_SENT, {
        username: user.name,
        userId: user.id,
        message: obj
      });
    }
  };

  render() {
    const { socket, user } = this.state;
    return socket !== null ? (
      <Layout socket={socket} user={user} onEvent={this.handleEvents} />
    ) : (
      <div>Error, Cannot connect to server!</div>
    );
  }
}