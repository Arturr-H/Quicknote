/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface ButtonProps { icon: string, label: string, function: () => void }
interface Props {
	buttons: Array<ButtonProps | "break">
}
interface State {
	popup_menu: {
        active: boolean,
        x: number,
        y: number
    },
}

/* Main */
export default class PopupMenu extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			popup_menu: {
				active: false,
				x: 0,
				y: 0
			},
		};
	}

	/* Lifecycle */
	componentDidMount(): void {
		/* Popup menu follow cursor */
		document.addEventListener("contextmenu", this.show_popup);
		document.addEventListener("mousedown", this.try_hide_popup);
	}
	componentWillUnmount(): void {
		document.removeEventListener("contextmenu", this.show_popup);
        document.removeEventListener("mousedown", this.try_hide_popup);
	}

	/* Visibility handler */
	show_popup = (e: MouseEvent) => {
        this.setState({
            popup_menu: {
                active: true,
                x: e.x,
                y: e.y
            }
        })
        e.preventDefault();
    }
    try_hide_popup = (e: MouseEvent) => {
        if ((e.target as HTMLElement).id !== "popup-item") {
            this.hide_popup();
        }
    }
    hide_popup = () => {
        this.setState({
            popup_menu: {
                active: false,
                x: 0, y: 0
            }
        })
    }

	/* Render */
	render() {
		return (
			this.state.popup_menu.active ?
			<div id="popup-item" className="popup-menu" style={{ left: this.state.popup_menu.x + "px", top: this.state.popup_menu.y + "px" }}>
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
								this.hide_popup();
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
