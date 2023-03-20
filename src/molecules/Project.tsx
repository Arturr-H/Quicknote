/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface Props {
	date: number,
	title: string,
	id: string,
	
	onOpen: (id: string) => void,
}
interface State {}

/* Constants */
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* Main */
export default class Project extends React.PureComponent<Props, State> {
	id: string;

	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {};

		/* Static */
		this.id = this.props.id;
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

	/* Render */
	render() {
		return (
			<div key={this.id} className="project-button" onClick={() => this.props.onOpen(this.id)}>
				<div className="header">
					<h2 className="title">{this.props.title}</h2>
					<button className="menu"></button>
				</div>
				<div className="body"></div>
				<footer>
					<p>{this.get_date_string(this.props.date)}</p>
				</footer>
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
