/* Imports */
import React from "react";

/* Interfaces */
interface Props {}
interface State {}

/* Main */
export default class Navbar extends React.PureComponent<Props, State> {
	
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
			<nav className="navbar" data-tauri-drag-region>

			</nav>
		);
	};
}
