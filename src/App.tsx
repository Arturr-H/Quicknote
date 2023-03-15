/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";
import "./styles.css";

/* Components */
import Navbar from "./molecules/Navbar";

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
			<div>

				{/* Navbar for enabling window-dragging */}
				<Navbar />
			</div>
		);
	};
}
