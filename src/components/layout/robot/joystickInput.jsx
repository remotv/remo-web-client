import React, { Component } from "react";
import { BUTTON_COMMAND } from "../../../events/definitions";
import socket from "../../socket";
import "./robot.css";

export default class JoystickInput extends Component {
    possible_joystick_colors = ["#FFFFFF", "#FFA500", "#FF00FF", "#FFFF00", "#000000"];
    possible_joystick_colors_index = 0;

    state = {
        active: false, // Whether the joystick is currently being moved or not. Joystick displays as green when active and red when not.
        joystick_x: 0, // X-coordinate of the joystick stick in SVG coordinates (pixels from the top-left corner).
        joystick_y: 0, // Y-coordinate of the joystick stick in SVG coordinates (pixels from the top-left corner).
        last_socket_send_time: 0, // Last time (obtained from Date.now()) at which a joystick position update was sent to the server. Used to save bandwidth and to not overload mobile clients trying to track desktop clients' joysticks.
        other_users_joystick_colors: {}, // Dictionary that associates other users' user ids with the colors that are used to display the locations of their joysticks.
        other_users_joystick_positions: [] // Array of objects that store the positions of other users' joysticks. Each object has properties user_id (a string), username (a string), x (a number), y (a number), and lifetime (a number).
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
            let other_user_joystick_position = {user_id: command.user.id, username: command.user.username, x: x, y: y, lifetime: 100};
            // Add this other user's joystick position to the state tracker, choosing a new color if one has not already been chosen for the other user.
            let colors_update = {};
            if (!(command.user.id in this.state.other_users_joystick_colors)) {
                colors_update[command.user.id] = this.possible_joystick_colors[this.possible_joystick_colors_index % this.possible_joystick_colors.length];
                this.possible_joystick_colors_index++;
            }
            this.setState({
                              other_users_joystick_colors: Object.assign(this.state.other_users_joystick_colors, colors_update),
                              other_users_joystick_positions: this.state.other_users_joystick_positions.concat(other_user_joystick_position)
                          }, this.redrawCanvas);
        }
    }

    updateOtherUsersJoystickPositions = () => {
        let starting_length = this.state.other_users_joystick_positions.length;
        let changed = false;
        let other_users_joystick_positions_updated = this.state.other_users_joystick_positions.map((other_users_joystick_position) => {
            changed = true;
            other_users_joystick_position.lifetime--;
            return other_users_joystick_position;
        })
        .filter((other_users_joystick_position) => (other_users_joystick_position.lifetime > 0));
        if (changed || this.state.other_users_joystick_positions.length !== starting_length) {
            this.setState({ other_users_joystick_positions: other_users_joystick_positions_updated }, this.redrawCanvas);
        }
    }

    constructor(props) {
        super(props);
        socket.on(BUTTON_COMMAND, this.handleOtherUsersCommands);
        this.canvasRef = React.createRef();
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
        this.setState({joystick_x: x, joystick_y: y}, this.redrawCanvas);
        this.sendJoystickPositionToSocket(x, y);
    }

    componentDidMount = () => {
        let canvas = this.canvasRef.current;
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = this.props.width * devicePixelRatio;
        canvas.height = this.props.height * devicePixelRatio;
        canvas.style.width = `${this.props.width}px`;
        canvas.style.height = `${this.props.height}px`;
        this.ctx = canvas.getContext("2d");
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
        this.ctx.font = "14pt Arial";
        this.setState({joystick_x: this.props.width / 2, joystick_y: this.props.height / 2}, this.redrawCanvas);
    }

    handleMouseMove = (e) => {
        let circle_radius = this.props.width / 2;

        // If the joystick is active, then move it according to the user's mouse movements.
        if (this.state.active) {
            // Update the joystick position.
            let newJoystickX = this.state.joystick_x + e.movementX * (window.devicePixelRatio || 1);
            let newJoystickY = this.state.joystick_y + e.movementY * (window.devicePixelRatio || 1);
            // If the cursor is within the white circular background, update the joystick position.
            let max_allowable_radius = circle_radius - this.props.stickRadius;
            let distance_from_cursor_to_center = Math.sqrt(Math.pow(newJoystickX - this.props.width / 2, 2) + Math.pow(newJoystickY - this.props.height / 2, 2));
            if (distance_from_cursor_to_center <= max_allowable_radius) {
                this.updateJoystickPosition(newJoystickX, newJoystickY);
            }
            // If the cursor is outside the white circular background, then calculate where along the border of the circular background it ought to be.
            else {
                let angle = Math.atan2(this.props.height / 2 - newJoystickY, newJoystickX - this.props.width / 2);
                this.updateJoystickPosition(this.props.width / 2 + Math.cos(angle) * max_allowable_radius, this.props.height / 2 - Math.sin(angle) * max_allowable_radius);
            }
        }
    }

    handleTouchMove = (e) => {
        let circle_radius = this.props.width / 2;
        // If the joystick is active, then move it according to the user's touches.
        if (this.state.active) {
            // Calculate position of touch on the canvas.
            let canvas = this.canvasRef.current;
            let rect = canvas.getBoundingClientRect();
            let mouseX = e.targetTouches[0].clientX - rect.left;
            let mouseY = e.targetTouches[0].clientY - rect.top;
            // If the touch is within the white circular background, set the new joystick position.
            let max_allowable_radius = circle_radius - this.props.stickRadius;
            let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
            if (distance_from_cursor_to_center <= max_allowable_radius) {
                this.updateJoystickPosition(mouseX, mouseY);
            }
            // If the cursor is outside the white circular background, then calculate where along the border of the circular background it ought to be.
            else {
                let angle = Math.atan2(this.props.height / 2 - mouseY, mouseX - this.props.width / 2);
                this.updateJoystickPosition(this.props.width / 2 + Math.cos(angle) * max_allowable_radius, this.props.height / 2 - Math.sin(angle) * max_allowable_radius);
            }
        }
    }

    handleMouseDown = (e) => {
        let circle_radius = this.props.width / 2;
        // When the mouse button is pressed down, activate the joystick and lock the user's pointer to prevent it leaving.
        // Calculate position of click on the canvas.
        let canvas = this.canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;
        // Set the new joystick position and make the joystick active (if the click was within the white circle).
        let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
        if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
            this.updateJoystickPosition(mouseX, mouseY);
            this.setState({active: true}, this.redrawCanvas);
            // Lock the user's pointer.
            canvas.requestPointerLock();
        }
    }

    handleTouchStart = (e) => {
        let circle_radius = this.props.width / 2;
        // When the user starts dragging their finger, activate the joystick.
        // Calculate position of click on the canvas.
        let canvas = this.canvasRef.current;
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.targetTouches[0].clientX - rect.left;
        let mouseY = e.targetTouches[0].clientY - rect.top;
        // Set the new joystick position and make the joystick active (if the touch was within the white circle).
        let distance_from_cursor_to_center = Math.sqrt(Math.pow(mouseX - this.props.width / 2, 2) + Math.pow(mouseY - this.props.height / 2, 2));
        if (distance_from_cursor_to_center <= circle_radius - this.props.stickRadius) {
            this.updateJoystickPosition(mouseX, mouseY);
            this.setState({active: true}, this.redrawCanvas);
        }
    }

    handleMouseUp = (e) => {
        // When the mouse button is released, deactivate the joystick, move it back to center, and unlock the user's pointer.
        this.updateJoystickPosition(this.props.width / 2, this.props.height / 2);
        this.setState({ active: false }, this.redrawCanvas);
        document.exitPointerLock();
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    redrawCanvas = () => {
        // Save drawing parameters' state.
        this.ctx.save();
        // Clear the canvas.
        this.ctx.clearRect(0, 0, this.props.width, this.props.height);
        // Background circle.
        this.ctx.beginPath();
        this.ctx.arc(this.props.width / 2, this.props.height / 2, this.props.width / 2, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.props.user == null ? "darkgray" : "#323C68";
        this.ctx.fill();
        // Joystick stick.
        this.ctx.beginPath();
        this.ctx.arc(this.state.joystick_x, this.state.joystick_y, this.props.stickRadius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = this.props.user == null ? "gray" : (this.state.active ? "#00FFFF" : "red");
        this.ctx.fill();
        // Other users' joystick positions with labels.
        for (let i = 0; i < this.state.other_users_joystick_positions.length; i++) {
            let other_users_joystick = this.state.other_users_joystick_positions[i];
            this.ctx.globalAlpha = other_users_joystick.lifetime / 100.0;
            this.ctx.fillStyle = this.state.other_users_joystick_colors[other_users_joystick.user_id];
            if (i === this.state.other_users_joystick_positions.length - 1) {
                this.ctx.fillText(other_users_joystick.username, other_users_joystick.x + 10, other_users_joystick.y);
            }
            this.ctx.beginPath();
            this.ctx.arc(other_users_joystick.x, other_users_joystick.y, 5, 0, 2 * Math.PI, false);
            this.ctx.fill();
        }
        // Restore drawing parameters' state.
        this.ctx.restore();
    }

    render() {
        // Create a 300 pixel by 300 pixel canvas for rendering the joystick UI. The data-label custom attribute is used to store the joystick's label so that the event handler can send it over the WebSocket. The data-id custom attribute store the joystick's ID. The data-command custom attribute stores the prefix of the command that the joystick will send.
        return (
            <canvas
                ref={ this.canvasRef }
                width="300"
                height="300"
                style = { { touchAction: "none" } }
                onMouseDown={ this.props.user == null ? undefined : this.handleMouseDown }
                onMouseMove={ this.props.user == null ? undefined : this.handleMouseMove }
                onMouseUp={ this.props.user == null ? undefined : this.handleMouseUp }
                onTouchStart={ this.props.user == null ? undefined : this.handleTouchStart }
                onTouchMove={ this.props.user == null ? undefined : this.handleTouchMove }
                onTouchEnd={ this.props.user == null ? undefined : this.handleMouseUp }
                onTouchCancel={ this.props.user == null ? undefined : this.handleMouseUp }
            >
                Your browser does not support HTML5 Canvas. Please switch to a modern browser to use this functionality.
            </canvas>
        );
    }
}
