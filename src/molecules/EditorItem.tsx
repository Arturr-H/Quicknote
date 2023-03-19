/* Imports */
import React, { RefObject } from "react";
import { invoke } from "@tauri-apps/api/tauri";

/* Interfaces */
interface State { dragging: boolean }
interface Props {
	children: any,
	id: string,
	rearrange: (from_id: string, to_id: string, place: "above" | "below") => void
}

/* Main */
export default class EditorItem extends React.PureComponent<Props, State> {
	item: RefObject<HTMLDivElement>;
	id: number;
	drop_on: null | string;
	active_highlight: string | null;
	prev_mouse_y: number;
	delta_mouse_y: number;

	/* Construct */
	constructor(props: Props) {
		super(props);

		this.drop_on = null;
		this.active_highlight = null;
		this.prev_mouse_y = 0;
		this.delta_mouse_y = 0;

		/* State */
		this.state = {
			dragging: false
		};

		/* Bindings */
		this.setDraggingActive = this.setDraggingActive.bind(this);
		this.setDraggingInactive = this.setDraggingInactive.bind(this);
		this.rearrange = this.rearrange.bind(this);
		this.updateItemPosition = this.updateItemPosition.bind(this);

		/* Refs */
		this.item = React.createRef();
		this.id = Math.random();

	}

	/* Lifecycle */
	componentDidMount(): void {
		document.addEventListener("mouseup", this.setDraggingInactive);
		document.addEventListener("mousemove", this.rearrange);
	}
	componentWillUnmount(): void {
		document.removeEventListener("mouseup", this.setDraggingInactive);
		document.removeEventListener("mousemove", this.rearrange);
	}

	/* Functions */
	setDraggingActive(e: any) {
		if (!this.item || !e.target.id.startsWith("editor-item")) return;
		
		this.item.current!.style.position = "absolute";
		this.item.current!.style.pointerEvents = "none";

		this.clearActiveHighlight();
		this.updateItemPosition(e.nativeEvent.y);
		this.setState({ dragging: true });
	};
	setDraggingInactive() {
		if (!this.item || !this.state.dragging) return;
		this.setState({ dragging: false });
		this.clearActiveHighlight();

		/* Reset position */
		this.item.current!.style.pointerEvents = "inherit";
		this.item.current!.style.position = "relative";
		this.item.current!.style.top = "0px";

		/* Send function call to rearrange
			order of elements to super */
		if (this.drop_on !== null)
			this.props.rearrange(
				this.props.id,
				this.drop_on,
				this.delta_mouse_y < 0 ? "above" : "below"
			);
	};
	rearrange(e: MouseEvent) {
		if (!this.item || !this.state.dragging) return;

		/* Remove highlight (may be replaced) */
		this.clearActiveHighlight();

		/* If it's another editor element we're hovering
			above, then show a highlight for indicating
			where this element will be dropped */
		let target = (e.target as HTMLElement);
		if (target.id.startsWith("editor-item-child")) {
			let id = target.id.split("-")[3];
			let element = document.getElementById(`editor-item-${id}`)!;
			let classname = this.delta_mouse_y < 0 ? "top-dropline" : "bottom-dropline";
			element.classList.add(classname);

			/* Set the element we want to drop the
				current editor snippet above / below */
			this.drop_on = element.dataset.editorId!;

			/* Remove select ouline */
			this.active_highlight = element.id;
		}else {
			this.drop_on = null;
		};

		if (e.y !== this.prev_mouse_y) {
			this.delta_mouse_y = e.y - this.prev_mouse_y;
			this.prev_mouse_y = e.y;
		};
		this.updateItemPosition(e.y);
	}
	updateItemPosition(y:number): void {
		this.item.current!.style.top =  (y - 24) + "px";
	}
	clearActiveHighlight = () => {
		if (this.active_highlight !== null) {
			let element = document.getElementById(`${this.active_highlight}`);
			if (element !== null) {
				element.classList.remove("top-dropline");
				element.classList.remove("bottom-dropline");
			}
		}
	}

	/* Render */
	render() {
		return (
			<div
				data-editor-id={this.props.id}
				id={`editor-item-${this.id}`}
				ref={this.item}
				className={`editor-item ${this.state.dragging ? "dragging" : ""}`}
			>

                {/* Move gesture button (for rearranging) */}
                <div className="sidebar" id={`editor-item-child-${this.id}`}>
                    <div
						id={`editor-item-child-${this.id}`}
						onMouseDown={this.setDraggingActive}
						className="rearrange-button"
					/>
                </div>

                <div id={`editor-item-child-${this.id}`} className="width col body">
                    {this.props.children}
                </div>
			</div>
		);
	};
}
