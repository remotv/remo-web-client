import React, { Component } from "react";
import EditServerMenu from "./editServerMenu";

export default class EditServer extends Component {
  handleModal = () => {
    const { onCloseModal, server, user } = this.props;
    return (
      <EditServerMenu onCloseModal={onCloseModal} server={server} user={user} />
    );
  };

  render() {
    const { user, server, localStatus } = this.props;

    return (
      <React.Fragment>
        {(user && user.id === server.owner_id) ||
        (localStatus && localStatus.member === true) ? (
          <div
            className="server-settings"
            onClick={() => this.props.modal(this.handleModal())}
          >
            {`( settings )`}
          </div>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}
