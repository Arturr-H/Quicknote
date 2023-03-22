/* Imports */
import React, { RefObject } from "react"
import { ContentType } from "../scenes/Editor";

/* Header */
interface HeaderProps {
    value: string,
    type: ContentType,
    id: string,
    onChange: (e: any, id: string, type: ContentType) => void
};
export class Header extends React.PureComponent<HeaderProps, {}> {
    item: RefObject<HTMLInputElement>;
    
    constructor(props: HeaderProps) {
        super(props);

        this.item = React.createRef();
    }
    componentDidMount(): void {
        if (this.item && this.item.current !== null) {
            this.item.current.focus();
        }
    }

    render(): React.ReactNode {
        return (
            <input
                ref={this.item}
                key={this.props.id}
                value={this.props.value}
                onChange={(event) => this.props.onChange(event, this.props.id, this.props.type)}
                placeholder="Header..."
                className={"item-" + this.props.type}
            />
        )
    }
}
