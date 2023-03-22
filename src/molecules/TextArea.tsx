/* Imports */
import React, { RefObject } from "react"
import { ContentType } from "../scenes/Editor";

/* Textarea */
interface TextareaProps {
    value: string,
    type: ContentType,
    id: string,
    onChange: (e: any, id: string, type: ContentType) => void
};
export class TextArea extends React.PureComponent<TextareaProps, {}> {
    item: RefObject<HTMLTextAreaElement>;
    
    constructor(props: TextareaProps) {
        super(props);

        this.item = React.createRef();
    }
    componentDidMount(): void {
        if (this.item && this.item.current !== null) {
            this.item.current.focus();

            if (this.item.current.value.indexOf("\n") === -1) {
                this.item.current.style.height = "40px";
            }else {
                this.item.current.style.height = "";
                this.item.current.style.height = this.item.current.scrollHeight + "px"
            }
        }
    }

    render(): React.ReactNode {
        return (
            <textarea
                ref={this.item}
                value={this.props.value}
                onChange={(event) => this.props.onChange(event, this.props.id, this.props.type)}
                placeholder="Notes..."
                onInput={resizeTextarea}
                className={"item-textarea"}
            />
        )
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
