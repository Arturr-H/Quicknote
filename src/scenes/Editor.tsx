/* Imports */
import React, { RefObject } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import EditorItem from "../molecules/EditorItem";

/* Interfaces */
interface Props {}
interface State {
    content_snippets: Array<[string, string]> // ID, Content
}

/* Main */
export default class Editor extends React.PureComponent<Props, State> {
    contentContainer: RefObject<HTMLDivElement>;

	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            content_snippets: [["default-title", "## Welcome"]]
        };

        /* Bindings */
        this.handleInput = this.handleInput.bind(this);

        /* Refs */
        this.contentContainer = React.createRef();
	}

	/* Lifecycle */
	componentDidMount(): void {}
	componentWillUnmount(): void {}

    /* Functions */
    handleInput(e: any, id: string) {
        const content = e.target.value;
        this.setState({
            content_snippets: this.state.content_snippets.map(e => {
                if (e[0] === id) {
                    return [id, content];
                } else {
                    return e;
                }
            })
        });
    }
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

	/* Render */
	render() {
		return (
			<div className="editor">
                <div className="content-snippets">
                    <EditorItem>
                        <textarea
                        placeholder="Notes..."
                            onInput={(e) => {
                                e.currentTarget.style.height = "";
                                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
                            }}
                            className="item-textarea"
                            value={this.state.content_snippets[0][1]}
                            onChange={(e) => this.handleInput(e, "default-title")}
                        ></textarea>
                    </EditorItem>
                    {
                        this.state.content_snippets
                            .filter(e => e[0] !== "default-title")
                            .map((e) => getElement(e, e[1], this.handleInput))
                    }
                </div>
			</div>
		);
	};
}

/* Create JSX element */
function getElement(e: [string, string], value: string, input_handler: (e: any, id: string) => void) {
    return (
        <textarea
            key={e[0]}
            value={value}
            onChange={(event) => input_handler(event, e[1])}
        >

        </textarea>
    )
}