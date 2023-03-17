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
            content_snippets: [],
            popup_menu_active: false
        };

        /* Bindings */
        this.handleInput = this.handleInput.bind(this);
        this.rearrange = this.rearrange.bind(this);

        /* Refs */
        this.contentContainer = React.createRef();
	}

	/* Lifecycle */
	componentDidMount(): void {
        /* Add the welcome snippet */
        this.addSnippet(ContentType.Paragraph); // TODO removethis
    }
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
    generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
    rearrange(from_id: string, to_id: string, place: "above" | "below"): void {
        let content_snippets = this.state.content_snippets;
        let from: null | number = null;
        let to: null | number = null;

        for (let i = 0; i < content_snippets.length; i++) {
            const element = content_snippets[i];
            
            if (element[0] == from_id) { from = i }
            else if (element[0] == to_id) { to = i + 1 };

            if (from !== null && to !== null) break;
        };
        
        /* Move item */
        console.log(from, "->", to);
        console.log("Before moving", content_snippets.map(e => e[0]));
        content_snippets = this.array_move(content_snippets, from!, to! - 1);
        console.log("After move", content_snippets.map(e => e[0]));

        /* Insert item */
        this.setState({
            content_snippets
        }, () => {
            this.forceUpdate();
        })
    }
    array_move = (array: Array<[string, EditorContent]>, index_from: number, index_to: number) => {
        const [removedItem] = array.splice(index_from, 1);
  
        // Insert the removed item at the "to" index
        array.splice(index_to, 0, removedItem);
        
        return array;
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
                {
                    this.state.content_snippets
                        .map((e) => <EditorItem rearrange={this.rearrange} id={e[0]} key={e[0]}>
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
        e.currentTarget.style.height = "40px";
    }else {
        e.currentTarget.style.height = "";
        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
    }
}
