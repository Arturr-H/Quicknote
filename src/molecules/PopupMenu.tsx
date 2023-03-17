/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface ButtonProps { icon: string, label: string, function: () => void }
interface Props { active: boolean, buttons: Array<ButtonProps> }
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
                    return <div key={index}>
                        <Button
                            label={buttton.label}
                            icon={buttton.icon}
                            function={buttton.function}
                        />

                        { index == this.props.buttons.length - 1 ? null : <div className="hr" />}
                    </div>
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
