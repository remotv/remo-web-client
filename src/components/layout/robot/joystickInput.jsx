import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import socket from "../../socket";
import "./robot.css";

export default class JoystickInput extends Component {
    possible_joystick_colors = ["#0000FF", "#FFA500", "#FF00FF", "#FFFF00", "#000000"];
    possible_joystick_colors_index = 0;

    state = {
        active: false, // Whether the joystick is currently being moved or not. Joystick displays as green when active and red when not.
        joystick_x: 0, // X-coordinate of the joystick stick in SVG coordinates (pixels from the top-left corner).
        joystick_y: 0, // Y-coordinate of the joystick stick in SVG coordinates (pixels from the top-left corner).
        last_socket_send_time: 0, // Last time (obtained from Date.now()) at which a joystick position update was sent to the server. Used to save bandwidth and to not overload mobile clients trying to track desktop clients' joysticks.
        other_users_joystick_colors: {}, // Dictionary that associates other users' user ids with the colors that are used to display the locations of their joysticks.
        other_users_joystick_positions: [] // Array of objects that store the positions of other users' joysticks. Each object has properties user_id (a string), x (a number), y (a number), and lifetime (a number).
    }

    // Handler that is called when the server forwards us a command sent by another user.
    handleOtherUsersCommands = (command) => {
        // Check whether the received command pertains to this joystick input.
        if (command.user.id !== this.props.user.id && command.button.id === this.props.aButton.id) {
            // Decode the received command into an angle and a magnitude.
            let command_decoding_regex = /.+_(-?\d+)_(\d+)/;
            let command_decoded = command.button.command.match(command_decoding_regex);
            let angle = command_decoded[1];
            let magnitude = command_decoded[2];
            let magnitude_pixels = magnitude * ((this.props.width / 2.0 - this.props.stickRadius) / 100.0);
            // Convert the angle and magnitude into X/Y coordinates in the SVG coordinate space.
            let x = this.props.width / 2.0 + magnitude_pixels * Math.cos(angle * (Math.PI / 180.0));
            let y = this.props.height / 2.0 - magnitude_pixels * Math.sin(angle * (Math.PI / 180.0));
            let other_user_joystick_position = {user_id: command.user.id, x: x, y: y, lifetime: 100};
            // Add this other user's joystick position to the state tracker, choosing a new color if one has not already been chosen for the other user.
            let colors_update = {};
            if (!(command.user.id in this.state.other_users_joystick_colors)) {
                colors_update[command.user.id] = this.possible_joystick_colors[this.possible_joystick_colors_index % this.possible_joystick_colors.length];
                this.possible_joystick_colors_index++;
            }
            this.setState({
                              other_users_joystick_colors: Object.assign(this.state.other_users_joystick_colors, colors_update),
                              other_users_joystick_positions: this.state.other_users_joystick_positions.concat(other_user_joystick_position)
                          });
        }
    }

    updateOtherUsersJoystickPositions = () => {
        let other_users_joystick_positions_updated = this.state.other_users_joystick_positions.map((other_users_joystick_position) => {
            other_users_joystick_position.lifetime--;
            return other_users_joystick_position;
        })
        .filter((other_users_joystick_position) => (other_users_joystick_position.lifetime > 0));
        this.setState({ other_users_joystick_positions: other_users_joystick_positions_updated });
    }

    constructor(props) {
        super(props);
        socket.on(BUTTON_COMMAND, this.handleOtherUsersCommands);
        this.svgRef = React.createRef();
        this.interval = setInterval(() => {
            this.updateOtherUsersJoystickPositions();
        }, 10);
    }

    sendJoystickPositionToSocket = (x, y) => {
        // Rate-limiting.
        let now = Date.now();
        if (now - this.state.last_socket_send_time <= 10) {
            return;
        }
        this.setState({ last_socket_send_time: now });
        // Send the joystick position as a command to be forwarded to the remote robot.
        let angle = Math.round(Math.atan2(this.props.height / 2.0 - y, x - this.props.width / 2.0) * (180.0 / Math.PI)); // Angle of the joystick stick in degrees CCW from standard position.
        let magnitude = Math.sqrt(Math.pow(x - this.props.width / 2.0, 2) + Math.pow(y - this.props.height / 2.0, 2)); // Distance from the center of the joystick area to the joystick stick.
        let magnitude_scaled = Math.round(magnitude / (this.props.width / 2.0 - this.props.stickRadius) * 100.0); // Joystick magnitude scaled so that it falls in the range [-100, 100].
        let command = `${this.props.aButton.command}_${angle}_${magnitude_scaled}`;
        socket.emit(BUTTON_COMMAND, {
            user: this.props.user,
            button: {id: this.props.aButton.id, command: command, label: this.props.aButton.label},
            controls_id: this.props.controlsId,
            channel: this.props.channel,
            server: this.props.server_id,
        });
    }

    updateJoystickPosition(x, y) {
        this.setState({joystick_x: x, joystick_y: y});
        this.sendJoystickPositionToSocket(x, y);
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
            if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
                this.updateJoystickPosition(newJoystickX, newJoystickY);
            }
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
            if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
                this.updateJoystickPosition(mouseX, mouseY);
            }
        }
    }

    handleMouseDown = (e) => {
        let circle_radius = this.props.width / 2;
        // When the mouse button is pressed down, activate the joystick and lock the user's pointer to prevent it leaving.
        // Calculate position of click on the svg.
        // See https://stackoverflow.com/a/17130415 for how we calculate the position of the click within the svg.
        let svg = this.svgRef.current;
        let rect = svg.getBoundingClientRect();
        let scaleX = svg.width.animVal.value / rect.width;
        let scaleY = svg.height.animVal.value / rect.height;
        let mouseX = (e.clientX - rect.left) * scaleX;
        let mouseY = (e.clientY - rect.top) * scaleY;
        // Set the new joystick position and make the joystick active (if the click was within the white circle).
        let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
        if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
            this.updateJoystickPosition(mouseX, mouseY);
            this.setState({active: true});
            // Lock the user's pointer.
            svg.requestPointerLock();
        }
    }

    handleTouchStart = (e) => {
        let circle_radius = this.props.width / 2;
        // When the user starts dragging their finger, activate the joystick.
        // Calculate position of click on the svg.
        // See https://stackoverflow.com/a/17130415 for how we calculate the position of the click within the svg.
        let svg = this.svgRef.current;
        let rect = svg.getBoundingClientRect();
        let scaleX = svg.width.animVal.value / rect.width;
        let scaleY = svg.height.animVal.value / rect.height;
        let mouseX = (e.targetTouches[0].clientX - rect.left) * scaleX;
        let mouseY = (e.targetTouches[0].clientY - rect.top) * scaleY;
        // Set the new joystick position and make the joystick active (if the touch was within the white circle).
        let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
        if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
            this.updateJoystickPosition(mouseX, mouseY);
            this.setState({active: true});
        }
    }

    handleMouseUp = (e) => {
        // When the mouse button is released, deactivate the joystick, move it back to center, and unlock the user's pointer.
        this.updateJoystickPosition(this.props.width / 2.0, this.props.width / 2.0);
        this.setState({active: false});
        document.exitPointerLock();
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
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
                    onMouseDown={ this.props.user == null ? undefined : this.handleMouseDown }
                    onMouseMove={ this.props.user == null ? undefined : this.handleMouseMove }
                    onMouseUp={ this.props.user == null ? undefined : this.handleMouseUp }
                    onTouchStart={ this.props.user == null ? undefined : this.handleTouchStart }
                    onTouchMove={ this.props.user == null ? undefined : this.handleTouchMove }
                    onTouchEnd={ this.props.user == null ? undefined : this.handleMouseUp }
                    onTouchCancel={ this.props.user == null ? undefined : this.handleMouseUp }
                >
                    <circle cx={ this.props.width / 2 } cy={ this.props.height / 2 } r={ this.props.width / 2 } fill={ this.props.user == null ? "darkgray" : "white" } />
                    { this.state.other_users_joystick_positions.map((other_users_joystick, index) => {
                        return (<circle
                            key={ index }
                            cx={ other_users_joystick.x }
                            cy={ other_users_joystick.y }
                            r="5"
                            opacity={ other_users_joystick.lifetime / 100.0 }
                            fill={ this.state.other_users_joystick_colors[other_users_joystick.user_id] }
                        />)
                    })}
                    <circle
                        cx={ this.state.joystick_x }
                        cy={ this.state.joystick_y }
                        r={ this.props.stickRadius }
                        fill={ this.props.user == null ? "gray" : (this.state.active ? "green" : "red") }
                    />
                </svg>
            </React.Fragment>
        );
    }
}
