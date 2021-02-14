import React, { Component } from "react";
import axios from "axios";
import { kickMember } from "../../config"

export default class ServerUserManagementMenu extends Component {
    state = {
        data: {},
        errors: {},
        error: "",
        confirmKick: false,
        kickSuccess: "",
        kickPending: false,
        kickCompleted: false,
        messageLoaded: false
      };
  handleDoKick = async () => {
    this.setState({ kickPending: true });
    const token = localStorage.getItem("token");
    await axios
      .post(
        kickMember,
        {
          member: this.props.member,
          server_id: this.props.server.server_id
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        if (res.data.error) {
          this.setState({
            kickSuccess: res.data.error,
            kickPending: false,
            kickCompleted: true
          });
          return;
        }
        this.setState({
          kickSuccess: res.data.message,
          kickPending: false,
          kickCompleted: true
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleDisplayModal = () => {
    if (!this.state.messageLoaded) this.setState({ messageLoaded: true });
    return [
      {
        body: <HandleContent {...this.props} />
      },
      { header: "" },
      { footer: "" }
    ];
  };

  render() {
    const { displayUserManagement } = this.props.user.status;
    const { messageLoaded } = this.state;
    return displayUserManagement && !messageLoaded ? (
      this.props.modal(this.handleDisplayModal())
    ) : (
      <React.Fragment />
    );
  }
}

const HandleContent = ({ onCloseModal }) => {
  return (
    <div className="modal">
      <div className="modal-header">Manage user</div>
      <div className="welcome__content-container">
       {/* TODO: add functions to kick users and stuff (im not sure how) */}

        <button
          className="welcome__btn"
          onClick={() => {
            onCloseModal();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
