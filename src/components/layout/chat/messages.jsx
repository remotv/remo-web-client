import React, { Component } from "react";
import Message from "./message";

export default class Messages extends Component {
  constructor(props) {
    super(props);
    this.scrollDown = this.scrollDown.bind(this);
    this.isScrolledToBottom = true;
  }

  state = {
    fadeoutMessageOnMobile: true
  };

  scrollDown() {
    const { container } = this.refs;
    if (this.isScrolledToBottom) container.scrollTop = container.scrollHeight;
    // console.log("Container: ", container);
  }

  handleMessagesScroll = e => {
    const out = e.target;
    this.isScrolledToBottom =
      out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    console.log("Scroll Check: ", this.isScrolledToBottom);
  };

  componentDidMount() {
    this.scrollDown();
  }

  componentDidUpdate(prevProps, prevState) {
    this.scrollDown();
    if (
      this.state.fadeoutMessageOnMobile !== prevState.fadeoutMessageOnMobile
    ) {
      console.log("Change State: ", this.state.fadeoutMessageOnMobile);
      this.render();
    }
  }

  handleChannelName = channel_id => {
    const { channels } = this.props;
    const name = channels.find(channel => channel.id === channel_id);
    if (name) return name.name;
    return "";
  };

  handlePrintChannelName = (messages, currentIndex) => {
    if (currentIndex === 0) return true;
    if (messages[currentIndex]["sender"] === "System") return false;
    if (
      messages[currentIndex - 1]["channel_id"] !==
      messages[currentIndex]["channel_id"]
    )
      return true;
    return false;
  };

  displayMessages = messages => {
    return messages.map((message, index) => {
      if (message.display_message) {
        return (
          <Message
            message={message}
            key={message["id"]}
            color={message.color}
            showMobileNav={this.props.showMobileNav}
            channelName={this.handleChannelName(message.channel_id)}
            printChannelName={this.handlePrintChannelName(messages, index)}
            fadeoutMessageOnMobile={this.state.fadeoutMessageOnMobile}
          />
        );
      } else {
        return <React.Fragment key={index} />;
      }
    });
  };

  handleTouchStart = () => {
    console.log("Touch Start!");
    this.setState({ fadeoutMessageOnMobile: false });
  };

  handleTouchEnd = () => {
    console.log("Touch End!");
    this.setState({ fadeoutMessageOnMobile: true });
  };

  render() {
    return (
      <div
        ref="container"
        className="chat-scroll"
        onTouchStart={() => this.handleTouchStart()}
        onTouchEnd={() => this.handleTouchEnd()}
        onScroll={e => this.handleMessagesScroll(e)}
      >
        {this.displayMessages(this.props.messages)}
      </div>
    );
  }
}
