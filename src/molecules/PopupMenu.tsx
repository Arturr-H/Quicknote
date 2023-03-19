/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface ButtonProps { icon: string, label: string, function: () => void }
interface Props { active: boolean, buttons: Array<ButtonProps | "break"> }
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
			<div className="popup-menu">
                {this.props.buttons.map((buttton, index) => {
					if (typeof buttton !== "string") {
						/* Return a button */
						return <Button
							label={buttton.label}
							key={index}
							icon={buttton.icon}
							function={buttton.function}
						/>

					}else {
						/* Else we return a line break */
						return <div key={index} className="hr" />
					}
                })}
            </div>
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
			<div className="item" onClick={this.props.function}>
                <img className="icon" src={this.props.icon} />
                <p className="label">{this.props.label}</p>
            </div>
        );
	};
}
