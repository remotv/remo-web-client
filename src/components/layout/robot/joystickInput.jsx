import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import socket from "../../socket";
import "./robot.css";

export default class JoystickInput extends Component {
    state = {
        active: false,
        joystick_x: 0,
        joystick_y: 0
    }

    constructor(props) {
        super(props);
        this.svgRef = React.createRef();
    }

    updateJoystickPosition(x, y) {
        this.setState({joystick_x: x, joystick_y: y});
    }

    componentDidMount = () => {
        this.updateJoystickPosition(this.props.width / 2.0, this.props.height / 2.0);
    }

    handleMouseMove = (e) => {
        let circle_radius = this.props.width / 2;

        // If the joystick is active, then move it according to the user's mouse movements.
        if (this.state.active) {
            // Update the joystick position.
            let newJoystickX = this.state.joystick_x + e.movementX;
            let newJoystickY = this.state.joystick_y + e.movementY;
            // If the cursor is within the white circular background, update the joystick position.
            let distance_from_cursor_to_center = Math.sqrt(Math.pow(newJoystickX - this.props.width / 2, 2) + Math.pow(newJoystickY - this.props.height / 2, 2));
            if (distance_from_cursor_to_center <= circle_radius) {
                this.updateJoystickPosition(newJoystickX, newJoystickY);
            }
            // Send the joystick position as a command to be forwarded to the remote robot.
            let joystickXScaled = Math.round(((newJoystickX - this.props.width / 2.0) / (this.props.width / 2.0)) * 100.0);
            let joystickYScaled = Math.round(((this.props.height / 2.0 - newJoystickY) / (this.props.height / 2.0)) * 100.0);
            let command = `${this.props.aButton.command}_${joystickXScaled}_${joystickYScaled}`;
            socket.emit(BUTTON_COMMAND, {
                user: this.props.user,
                button: {id: this.props.aButton.id, command: command, label: this.props.aButton.label},
                controls_id: this.props.controlsId,
                channel: this.props.channel,
                server: this.props.server_id,
            });
        }
    }

    handleTouchMove = (e) => {
        let circle_radius = this.props.width / 2;
        // If the joystick is active, then move it according to the user's touches.
        if (this.state.active) {
            // Calculate position of touch on the svg.
            // See https://stackoverflow.com/a/17130415 for how we calculate the position of the click within the svg.
            let svg = this.svgRef.current;
            let rect = svg.getBoundingClientRect();
            let scaleX = svg.width.animVal.value / rect.width;
            let scaleY = svg.height.animVal.value / rect.height;
            let mouseX = (e.touches[0].clientX - rect.left) * scaleX;
            let mouseY = (e.touches[0].clientY - rect.top) * scaleY;
            // Set the new joystick position.
            let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
            if (distance_from_cursor_to_center <= circle_radius) {
                this.updateJoystickPosition(mouseX, mouseY);
            }
            // Send the joystick position as a command to be forwarded to the remote robot.
            let joystickXScaled = Math.round(((mouseX - this.props.width / 2.0) / (this.props.width / 2.0)) * 100.0);
            let joystickYScaled = Math.round(((this.props.height / 2.0 - mouseY) / (this.props.height / 2.0)) * 100.0);
            let command = `${this.props.aButton.command}_${joystickXScaled}_${joystickYScaled}`;
            socket.emit(BUTTON_COMMAND, {
                user: this.props.user,
                button: {id: this.props.aButton.id, command: command, label: this.props.aButton.label},
                controls_id: this.props.controlsId,
                channel: this.props.channel,
                server: this.props.server_id,
            });
        }
    }

    handleMouseDown = (e) => {
        // When the mouse button is pressed down, activate the joystick and lock the user's pointer to prevent it leaving.
        // Calculate position of click on the svg.
        // See https://stackoverflow.com/a/17130415 for how we calculate the position of the click within the svg.
        let svg = this.svgRef.current;
        let rect = svg.getBoundingClientRect();
        let scaleX = svg.width.animVal.value / rect.width;
        let scaleY = svg.height.animVal.value / rect.height;
        let mouseX = (e.clientX - rect.left) * scaleX;
        let mouseY = (e.clientY - rect.top) * scaleY;
        // Set the new joystick position and make the joystick active.
        this.updateJoystickPosition(mouseX, mouseY);
        this.setState({active: true});
        // Lock the user's pointer.
        svg.requestPointerLock();
    }

    handleTouchStart = (e) => {
        // When the user starts dragging their finger, activate the joystick.
        // Calculate position of click on the svg.
        // See https://stackoverflow.com/a/17130415 for how we calculate the position of the click within the svg.
        let svg = this.svgRef.current;
        let rect = svg.getBoundingClientRect();
        let scaleX = svg.width.animVal.value / rect.width;
        let scaleY = svg.height.animVal.value / rect.height;
        let mouseX = (e.targetTouches[0].clientX - rect.left) * scaleX;
        let mouseY = (e.targetTouches[0].clientY - rect.top) * scaleY;
        // Set the new joystick position and make the joystick active.
        this.updateJoystickPosition(mouseX, mouseY);
        this.setState({active: true});
    }

    handleMouseUp = (e) => {
        // When the mouse button is released, deactivate the joystick, move it back to center, and unlock the user's pointer.
        this.updateJoystickPosition(this.props.width / 2.0, this.props.width / 2.0);
        this.setState({active: false});
        document.exitPointerLock();
    }

    render() {
        // Create a 300 pixel by 300 pixel canvas for rendering the joystick UI. The data-label custom attribute is used to store the joystick's label so that the event handler can send it over the WebSocket. The data-id custom attribute store the joystick's ID. The data-command custom attribute stores the prefix of the command that the joystick will send.
        return (
            <React.Fragment>
                <svg
                    ref={ this.svgRef }
                    width={ this.props.width }
                    height={ this.props.height }
                    style = { { touchAction: "none" } }
                    onMouseDown={ this.handleMouseDown }
                    onMouseMove={ this.handleMouseMove }
                    onMouseUp={ this.handleMouseUp }
                    onTouchStart={ this.handleTouchStart }
                    onTouchMove={ this.handleTouchMove }
                    onTouchEnd={ this.handleMouseUp }
                    onTouchCancel={ this.handleMouseUp }
                >
                    <circle cx={ this.props.width / 2 } cy={ this.props.height / 2 } r={ this.props.width / 2 } fill="white" />
                    <circle
                        cx={ this.state.joystick_x }
                        cy={ this.state.joystick_y }
                        r="30"
                        fill="red"
                    />
                </svg>
            </React.Fragment>
        );
    }
}
