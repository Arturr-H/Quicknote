/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface ButtonProps { icon: string, label: string, function: () => void }
interface Props {
	active: boolean,
	x: number,
	y: number,
	hide: () => void,

	buttons: Array<ButtonProps | "break">
}
interface State {}

/* Main */
export default class PopupMenu extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {};
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Render */
	render() {
		return (
			this.props.active ?
			<div id="popup-item" className="popup-menu" style={{ left: this.props.x + "px", top: this.props.y + "px" }}>
                {this.props.buttons.map((button, index) => {
					if (typeof button !== "string") {
						/* Return a button */
						return <Button
							label={button.label}
							key={index}
							icon={button.icon}
							function={() => {
								button.function();

								/* Hide popup menu */
								this.props.hide();
							}}
						/>

					}else {
						/* Else we return a line break */
						return <div id="popup-item" key={index} className="hr" />
					}
                })}
            </div>
			: null
        );
	};
}

/* The buttons for the `PopupMenu` */
class Button extends React.PureComponent<ButtonProps, {}> {
	
	/* Construct */
	constructor(props: ButtonProps) {
		super(props);

		/* State */
		this.state = {};
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Render */
	render() {
		return (
			<div id="popup-item" className="item" onClick={this.props.function}>
                <img id="popup-item" className="icon" src={this.props.icon} />
                <p id="popup-item" className="label">{this.props.label}</p>
            </div>
        );
	};
}
