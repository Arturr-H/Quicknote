/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

/* Components */
import Navbar from "./molecules/Navbar";
import Project from "./molecules/Project";
import Editor from "./scenes/Editor";

/* Interfaces */
interface Props {}
interface State {
	editor_open: boolean
}

/* Main */
export default class App extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			editor_open: false
		};

		/* Function bindings */
		this.openEditor = this.openEditor.bind(this);
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

	/* Functions */
	openEditor(id: string) {
		this.setState({ editor_open: true });
	}

	/* Render */
	render() {
		return (<>{
			this.state.editor_open
			? <Editor />
			: <div className="column">

				{/* [HEADERS] Navbar for enabling window-dragging */}
				<Navbar />

				{/* [BODY] */}
				<main className="body">
					<div className="title-bar">
						<h1># My Quicknotes</h1>
					</div>

					{/* Links to projects */}
					<div className="project-list">
						<Project onOpen={this.openEditor} />
						<Project onOpen={this.openEditor} />
						<Project onOpen={this.openEditor} />
						<Project onOpen={this.openEditor} />
						<Project onOpen={this.openEditor} />
					</div>
				</main>
			</div>
		}</>);
	};
}
