/* Imports */
import React, { RefObject } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import EditorItem from "../molecules/EditorItem";
import PopupMenu from "../molecules/PopupMenu";

/* Enums */
// We stringify here because that will make
// life easier when automatically generating
// css class names. (Won't need large ifs)
enum ContentType { Paragraph = "paragraph", Header1 = "header1", Header2 = "header2" }

/* Interfaces */
interface Paragraph { content: string, type: ContentType }
interface Header1   { content: string, type: ContentType }
interface Header2   { content: string, type: ContentType }

interface Props {}
interface State {
    content_snippets: Array<[string, EditorContent]>, // ID, Content
    popup_menu_active: boolean
}

/* Types */
type EditorContent = Paragraph | Header1 | Header2;

/* Main */
export default class Editor extends React.PureComponent<Props, State> {
    contentContainer: RefObject<HTMLDivElement>;

	/* Construct */
	constructor(props: Props) {
		super(props);

		/* State */
		this.state = {
            content_snippets: [["default-title", { content: "## Welcome", type: ContentType.Header1 }]],
            popup_menu_active: false
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
    handleInput(e: any, id: string, type: ContentType) {
        const content = e.target.value;
        this.setState({
            content_snippets: this.state.content_snippets.map(e => {
                if (e[0] === id) {
                    return [id, { content, type }];
                } else {
                    return e;
                }
            })
        });
    }
    generateId() {
        return Math.random().toString(36).substring(2, 9);
    }

    /* Popup methods */
    addSnippet = (content_type: ContentType) => {
        this.setState({
            content_snippets: [
                ...this.state.content_snippets,
                [this.generateId(), { content: "", type: content_type }]
            ]
        });
    };

	/* Render */
	render() {
		return (
			<div className="editor">
                <EditorItem>
                    <textarea
                        placeholder="Notes..."
                        style={{ height: "40px" }}
                        /* Resize textarea on input */
                        onInput={resizeTextarea}
                        className="item-textarea"
                        value={this.state.content_snippets[0][1].content}
                        onChange={(e) => this.handleInput(e, "default-title", ContentType.Header1)}
                    />
                </EditorItem>
                {
                    this.state.content_snippets
                        .filter(e => e[0] !== "default-title")
                        .map((e) => <EditorItem key={e[0]}>
                            {getElement(e, e[1].content, this.handleInput)}
                        </EditorItem>)
                }

                {/*
                    This button will show a popup menu where user can
                    select what they want to append to their note page
                */}
                <button className="snippet-add-button">
                    <div className="icon" />
                </button>

                {/* The "popup" menu */}
                <PopupMenu
                    active={this.state.popup_menu_active}
                    buttons={[
                        { label: "Add Paragraph", icon: "/items.svg", function: () => this.addSnippet(ContentType.Paragraph) },
                        { label: "H1",          icon: "/items.svg", function: () => this.addSnippet(ContentType.Header1) },
                        { label: "H2",          icon: "/items.svg", function: () => this.addSnippet(ContentType.Header2) }
                    ]}
                />
			</div>
		);
	};
}

/* Create JSX element */
function getElement(e: [string, EditorContent], value: string, input_handler: (e: any, id: string, type: ContentType) => void) {
    switch (e[1].type) {
        /* Headers */
        case ContentType.Header1:
        case ContentType.Header2:
            return <input
                key={e[0]}
                value={value}
                onChange={(event) => input_handler(event, e[0], e[1].type)}
                placeholder="Header..."
                className={"item-" + e[1].type}
            />
        
        /* Paragraph */
        case ContentType.Paragraph:
            return <textarea
                key={e[0]}
                style={{ height: "40px" }}
                value={value}
                onChange={(event) => input_handler(event, e[0], e[1].type)}
                placeholder="Notes..."
                onInput={resizeTextarea}
                className={"item-textarea"}
            />
        
        default:
            break;
    }
}

/* Every textarea (paragraph) should
    reize its heigh upon line addition */
const resizeTextarea = (e: any) => {
    /*
        There is a bug that makes the textarea
        the size of two lines once constructed
        when it should only be the size of one

        Therefore i constructed this workaround
        which checks if there are any line breaks
    */
    if (e.currentTarget.value.indexOf("\n") === -1) {
        console.log("YEs");
        e.currentTarget.style.height = "40px";
    }else {
        console.log("NTO");
        e.currentTarget.style.height = "";
        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
    }
}
