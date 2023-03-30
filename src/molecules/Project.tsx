/* Imports */
import React, { MouseEventHandler, RefObject } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { EditorContent } from "../scenes/Editor";
import PopupMenu from "./PopupMenu";

/* Interfaces */
interface Props {
	date: number,
	title: string,
	id: string,
	
	onOpen: (id: string) => void,
	delete: (id: string) => void
}
interface State {
	dragging: boolean,
	can_delete: boolean,
	x: number,
}

/* Constants */
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Main */
export default class Project extends React.PureComponent<Props, State> {
	id: string;
	item: RefObject<HTMLElement>;
	x_start: number;

	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			dragging: false,
			x: 0,
			can_delete: false
		};

		/* Static */
		this.id = this.props.id;
		this.x_start = 0;

		/* Refs */
		this.item = React.createRef();
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Functions */
	get_date_string(unix: number): string {
		const date = new Date(unix);
		const formattedDate = MONTH_NAMES[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
		return formattedDate;
	}

	/* Mouse methods */
	onMouseDown = (event: React.MouseEvent<Element, MouseEvent>) => {
		this.x_start = event.clientX;
		this.setState({
			dragging: true,
			x: 0
		});
	}
	onMouseMove = (event: React.MouseEvent<Element, MouseEvent>) => {
		if (!this.state.dragging) return;

		let x = this.clampMouseValue(this.x_start - event.clientX);
		this.setState({ x });

		if (x > 110) {
			this.setState({ can_delete: true });
		}else {
			this.setState({ can_delete: false });
		}
	}
	onMouseLeave = (event: React.MouseEvent<Element, MouseEvent>) => {
		if (this.state.can_delete)
			this.props.delete(this.props.id);

		this.x_start = 0;
		this.setState({
			x: 0,
			dragging: false,
			can_delete: false
		});
	}
	clampMouseValue(val: number): number {
		return Math.min(120, Math.max(val, 0))
	}

	/* Render */
	render() {
		return (
			<div
				className="project-button-wrapper"

				onMouseMove={this.onMouseMove}
				onMouseDown={this.onMouseDown}
				onMouseLeave={this.onMouseLeave}
				onMouseUp={this.onMouseLeave}
			>
				<div
					ref={this.item as RefObject<HTMLDivElement>}
					id={this.id}
					key={this.id}
					className="project-button"
					onClick={() => this.state.can_delete ? {} : this.props.onOpen(this.id)}
					style={this.state.dragging ? {
						transform: `translateX(${-this.state.x}px)`
					} : {}}
				>
					<div className="header">
						<h2 className="title">{this.props.title}</h2>
						<button className="menu"></button>
					</div>
					<div className="body"></div>
					<footer>
						<p>{this.get_date_string(this.props.date)}</p>
					</footer>
				</div>

				<div
					style={{
						width: this.clampMouseValue(this.state.x - 16) + "px",
					}}
					className={`project-delete-section ${this.state.can_delete ? "activate" : ""}`}
				>
					<img alt="trash" src="/icons/trash.svg" />
				</div>
			</div>
		);
	};
}

/* Interface for displaying projects in home screen */
export interface ProjectInterface {
	title: string,
	date: number,
	id: string,
}

/* Interface for actual project data (used in editor) */
export interface ProjectData {
	title: string,
	date: number,
	id: string,
	content: Array<EditorContent>
}
