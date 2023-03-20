/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

/* Components */
import Navbar from "./molecules/Navbar";
import Project, { ProjectInterface } from "./molecules/Project";
import Editor from "./scenes/Editor";

/* Interfaces */
interface Props {}
interface State {
	editor_open: boolean,
	projects: ProjectInterface[],
	project_id: string
}

/* Main */
export default class App extends React.PureComponent<Props, State> {
	
	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
			editor_open: false,

			projects: [],
			project_id: "NONE"
		};

		/* Function bindings */
		this.openEditor = this.openEditor.bind(this);
		this.closeEditor = this.closeEditor.bind(this);
		this.loadProjects = this.loadProjects.bind(this);
		this.createProject = this.createProject.bind(this);
	}

	/* Lifecycle */
	componentDidMount(): void {
		this.loadProjects();	
	}
	componentWillUnmount(): void {}

	/* Functions */
	openEditor(id: string) { this.setState({ editor_open: true, project_id: id }); }
	closeEditor() { this.setState({ editor_open: false }); }

	generateId(): string { return Math.random().toString(36).substring(2, 9); }

	loadProjects() {
		invoke("get_projects").then((projects: any) => this.setState({ projects }));
	}
	createProject() {
		invoke("create_project").then((id: any) => {
			this.loadProjects();
			this.openEditor(id);
		})
	}

	/* Render */
	render() {
		return (
			<div className="column">

			{/* [HEADERS] Navbar for enabling window-dragging */}
			<Navbar />
			
			{/* Either editor or the main screen */}
			{this.state.editor_open
			? <Editor
				go_home={this.closeEditor}
				id={this.state.project_id}
			/>
			: <main className="body">
				<div className="title-bar">
					<h1># My Quicknotes</h1>
				</div>

				{/* Links to projects */}
				<div className="project-list">

					{/* Add project button */}
					<div
						className="create-project-btn"
						title="Create a new Quicknote project"
						onClick={this.createProject}
					>
						<img alt="pencil" src="/icons/plus.svg" />
					</div>

					{/* User created projects */}
					{this.state.projects.map(project => 
						<Project
							title={project.title}
							date={project.date}
							id={project.id}
							key={project.id}
							onOpen={this.openEditor}
						/>
					)}
				</div>

				{/* Decal */}
				<div className="bottom-bush" />
			</main>
		}</div>);
	};
}
