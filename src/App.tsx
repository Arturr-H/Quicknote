/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

/* Components */
import Navbar from "./molecules/Navbar";
import Project from "./molecules/Project";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class App extends React.PureComponent<Props, State> {
	
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
			<div className="column">

				{/* [HEADERS] Navbar for enabling window-dragging */}
				<Navbar />

				{/* [BODY] */}
				<main className="body">
					<div className="title-bar">
						<h1># My Quicknotes</h1>
					</div>

					<div className="project-list">
						<Project />
						<Project />
						<Project />
						<Project />
						<Project />
					</div>
				</main>
			</div>
		);
	};
}
