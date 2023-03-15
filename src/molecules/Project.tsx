/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class Project extends React.PureComponent<Props, State> {
	
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
			<div className="project-button">
				<div className="header">
					<h2 className="title">Biologiafaffafwafawfwaf ht22</h2>
					<button className="menu"></button>
				</div>
			</div>
		);
	};
}
