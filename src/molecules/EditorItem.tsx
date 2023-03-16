/* Imports */
import React from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface Props {
	children: any
}
interface State {}

/* Main */
export default class EditorItem extends React.PureComponent<Props, State> {
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
			<div className="editor-item">

                {/* Move gesture button (for rearranging) */}
                <div className="sidebar">
                    <div className="rearrange-button"></div>
                </div>

                <div className="width col body">
                    {this.props.children}
                </div>
			</div>
		);
	};
}
