/* Imports */
import React, { RefObject } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { dialog } from "@tauri-apps/api";
import EditorItem from "../molecules/EditorItem";
import PopupMenu from "../molecules/PopupMenu";
import { ProjectData } from "../molecules/Project";
import { ParticleEmitter } from "../functional/Emitter";
import { TextArea } from "../molecules/TextArea";
import { Header } from "../molecules/Header";

/* Constants */
const subscriptMap: { [key: string]: string } = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈',
    '9': '₉', '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    // 'a': 'ₐ',
    // 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    // 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': ' ₛ',
    // 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ', 'y': 'ᵧ'
};
const superscriptMap: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷',
    '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    // 'a': 'ᵃ',
    // 'e': 'ᵉ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ',
    // 'o': 'ᵒ', 'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'x': 'ˣ',
    // 'y': 'ʸ'
};

/* Enums */
// We stringify here because that will make
// life easier when automatically generating
// css class names. (Won't need large ifs)
export enum ContentType {
    Paragraph = "paragraph",
    Header1 = "header1",
    Header2 = "header2",
    Header3 = "header3",

    Horizontal = "horizontal",
}

/* Interfaces */
interface Paragraph { id: string, content: string, type: ContentType }
interface Header1 { id: string, content: string, type: ContentType }
interface Header2 { id: string, content: string, type: ContentType }
interface Header3 { id: string, content: string, type: ContentType }
interface Horizontal { id: string, content: string, type: ContentType }

interface Props {
    go_home: () => void,
    id: string,
}
interface State {
    content_snippets: Array<EditorContent>,
    popup_menu_active: boolean,
    title: string,

    is_saved: boolean,
    particles: string[]
}

/* Types */
export type EditorContent =
    Paragraph |
    Horizontal |
    Header1 | Header2 | Header3;

/* Main */
export default class Editor extends React.PureComponent<Props, State> {
    contentContainer: RefObject<HTMLDivElement>;
    title: RefObject<HTMLSpanElement>;
    id: string;
    data: ProjectData | null;

    /* Construct */
    constructor(props: Props) {
        super(props);

        /* State */
        this.state = {
            content_snippets: [],
            popup_menu_active: false,
            title: "",

            is_saved: true,
            particles: []
        };

        /* Bindings */
        this.handleInput = this.handleInput.bind(this);
        this.rearrange = this.rearrange.bind(this);

        /* Refs */
        this.contentContainer = React.createRef();
        this.title = React.createRef();

        /* Static */
        this.id = this.props.id;
        this.data = null;
    }

    /* Lifecycle */
    componentDidMount(): void {

        /* If save */
        document.addEventListener("keydown", this.handleKeyDown);

        /* Drag n drop */
        // document.addEventListener("drag", () => {
        //     console.log("HEJsanjnjdnajnsdjnjsn");
        // })

        // listen("tauri://file-drop", async (e) => {
        //     let image = (e.payload as any)[0] as string;
        //     let id = this.generateId();

        //     /*
        //         Save image in .quicknote-config/uploads folder.
        //         Why do we await the backend response when we already
        //         know the path to the file (`id`)?.

        //         It's because we don't know the full path and where
        //         .quicknote-data is placed.
        //     */
        //     invoke("save_image", { image, id }).then(path =>
        //         this.setState({
        //             content_snippets: [...this.state.content_snippets, {
        //                 content: path as string,
        //                 type: ContentType.Image,
        //                 id
        //             }]
        //         })
        //     );
        // });

        /* Set data */
        invoke("get_project", { id: this.id }).then((e: any) => {
            let data = e as ProjectData;
            this.data = data;

            this.setState({
                content_snippets: data.content,
                title: data.title,
            }, () => {
                this.title.current!.innerText = data.title;
            })
        });
    }
    componentWillUnmount(): void {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    /* Shortcuts */
    handleKeyDown = (e: KeyboardEvent) => {
        if (e.metaKey && e.key == "s")
            this.save_document();
        else if (e.metaKey && e.key == "r") {
            e.preventDefault();
            this.go_home();
        }
        else if (e.metaKey && e.key == "1")
            this.addSnippet(ContentType.Header1);
        else if (e.metaKey && e.key == "2")
            this.addSnippet(ContentType.Header2);
        else if (e.metaKey && e.key == "3")
            this.addSnippet(ContentType.Header3);

        else if (e.metaKey && e.key == "p")
            this.addSnippet(ContentType.Paragraph);

        else if (e.metaKey && e.key == "m")
            this.addSnippet(ContentType.Horizontal);

        else if (e.metaKey && e.key == "l")
            this.toSubscript(true);
        else if (e.metaKey && e.key == "o")
            this.toSubscript(false);
    }

    /* Save document */
    save_document = () => {
        if (!this.state.is_saved) this.spawnParticles();
        let end: Array<{ id: string, content: string, type: string }> = [];

        this.state.content_snippets.forEach(item => {
            end.push({
                id: item.id,
                content: item.content,
                type: item.type,
            })
        });

        this.setState({ is_saved: true });

        invoke("save_project", {
            data: JSON.stringify({
                id: this.data?.id,
                title: this.state.title,
                date: this.data?.date,
                content: end
            }),
        });
    }

    /* Functions */
    handleInput(e: any, id: string, type: ContentType) {
        const content = e.target.value as string;
        this.setState({
            content_snippets: this.state.content_snippets.map(e => {
                if (e.id === id) {
                    return {
                        content,
                        id,
                        type
                    };
                } else {
                    return e;
                }
            }),
            is_saved: false
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

            // TODO place
            if (element.id == from_id) { from = i }
            else if (element.id == to_id) { to = i + 1 };

            if (from !== null && to !== null) break;
        };

        /* Move item */
        content_snippets = this.array_move(content_snippets, from!, to! - 1);

        /* Insert item */
        this.setState({
            content_snippets,
            is_saved: false,
        }, () => {
            this.forceUpdate();
        })
    }
    array_move = (array: Array<EditorContent>, index_from: number, index_to: number) => {
        const [removedItem] = array.splice(index_from, 1);

        // Insert the removed item at the "to" index
        array.splice(index_to, 0, removedItem);

        return array;
    }
    setTitle = (title: string) => {
        this.setState({ title, is_saved: false })
    }

    /* Subscript / superscript */
    toSubscript(isSubscript: boolean) {
        const active = document.activeElement as HTMLTextAreaElement | HTMLInputElement;

        /* Indexes */
        const start = active.selectionStart;
        const finish = active.selectionEnd;
      
        /* Value */
        const sel = active.value.substring(start!, finish!);
      
        /* Convert value */
        let result = '';
        for (let i = 0; i < sel.length; i++) {
          const char = sel.charAt(i);
          const conversionMap = isSubscript ? subscriptMap : superscriptMap;
          const conversionChar = conversionMap[char] || char;
          const isConverted = Object.values(conversionMap).includes(char);
          const regularChar = isConverted ? Object.keys(conversionMap)[Object.values(conversionMap).indexOf(char)] : char;
          result += conversionChar === char ? regularChar : conversionChar;
        }
      
        const textBeforeSelection = active.value.substring(0, start!);
        const textAfterSelection = active.value.substring(finish!);
        const value = textBeforeSelection + result + textAfterSelection;
        active.value = value;
        active.selectionStart = start;
        active.selectionEnd = start! + result.length;
      
        this.handleInput(
            { target: { value } },
            active.id.split("-")[1],
            active instanceof HTMLTextAreaElement ? ContentType.Paragraph : (active?.getAttribute("data-type") as ContentType),
        );
    }

    /* Popup methods */
    addSnippet = (content_type: ContentType) => {
        this.setState({
            content_snippets: [
                ...this.state.content_snippets,
                { content: "", type: content_type, id: this.generateId() }
            ],
            is_saved: false
        }, () => {
            /* Focus snippet */
        });
    };
    deleteSnippet = (id: string) => {
        this.setState({
            content_snippets: this.state.content_snippets.filter(e => e.id !== id),
            is_saved: false,
        });
        this.spawnParticles();
    }

    /* Spawn particles */
    spawnParticles = () => {
        let id = this.generateId();
        this.setState({ particles: [...this.state.particles, id] });

        setTimeout(() => {
            document.getElementById(id)?.remove();
        }, 2000);
    }

    /* Go home and check if quicknote is saved */
    go_home = () => {
        if (!this.state.is_saved) {
            dialog.ask("Would you like to save?",
                { title: "Quicknote", type: "warning" }
            ).then(sould_save => {
                if (sould_save) {
                    this.save_document();
                    this.props.go_home();
                } else {
                    this.props.go_home();
                }
            });
        } else {
            this.props.go_home();
        }
    }

    /* Render */
    render() {
        return (
            <div className="editor">
                <div className="editor-header">
                    <span
                        spellCheck={false}
                        contentEditable={true}
                        className="editor-title"
                        data-ph="Title..."
                        onInput={(e) => this.setTitle((e.target as HTMLSpanElement).innerText)}
                        ref={this.title}
                    />
                </div>

                {
                    this.state.content_snippets
                        .map((e) => <EditorItem delete={this.deleteSnippet} rearrange={this.rearrange} id={e.id} key={e.id}>
                            {getElement(
                                e.type,
                                e.id,
                                /* Pass in state */
                                e.content,
                                this.handleInput
                            )}
                        </EditorItem>)
                }

                {/* The "popup" menu */}
                <PopupMenu
                    buttons={[
                        { label: "Paragraph", icon: "/icons/paragraph.svg", function: () => this.addSnippet(ContentType.Paragraph), shortcut_label: "⌘P" },
                        "break",
                        { label: "H1", icon: "/icons/h1.svg", function: () => this.addSnippet(ContentType.Header1), shortcut_label: "⌘1" },
                        { label: "H2", icon: "/icons/h2.svg", function: () => this.addSnippet(ContentType.Header2), shortcut_label: "⌘2" },
                        { label: "H3", icon: "/icons/h3.svg", function: () => this.addSnippet(ContentType.Header3), shortcut_label: "⌘3" },
                        "break",
                        { label: "Horizontal", icon: "/icons/horizontal.svg", function: () => this.addSnippet(ContentType.Horizontal), shortcut_label: "⌘M" },
                        "break",
                        { label: "Superscript", icon: "/icons/superscript.svg", function: () => this.toSubscript(false), shortcut_label: "⌘O" },
                        { label: "Subscript", icon: "/icons/subscript.svg", function: () => this.toSubscript(true), shortcut_label: "⌘L" },
                        "break",
                        { label: "Home", icon: "/icons/home.svg", function: this.go_home, shortcut_label: "⌘R" },
                        { label: "Save", icon: "/icons/save.svg", function: this.save_document, shortcut_label: "⌘S" }
                    ]}
                />

                <div id="delete-blob" className="delete-blob-container">
                    <div className="delete-blob" />
                    <p>Release to delete!</p>
                </div>

                {
                    this.state.particles.map((e) =>
                        <ParticleEmitter id={e} key={e} lifetime={300} num_particles={20} />
                    )
                }
            </div>
        );
    };
}

/* Create JSX element */
function getElement(
    type: ContentType,
    id: string,
    value: string,
    input_handler: (e: any, id: string, type: ContentType) => void
) {

    switch (type) {
        /* Headers */
        case ContentType.Header1:
        case ContentType.Header2:
        case ContentType.Header3:
            return <Header
                key={id}
                type={type}
                id={id}
                value={value}
                onChange={(event) => input_handler(event, id, type)}
            />

        /* Paragraph */
        case ContentType.Paragraph:
            return <TextArea
                key={id}
                type={type}
                id={id}
                value={value}
                onChange={(event) => input_handler(event, id, type)}
            />

        /* Horizontal break */
        case ContentType.Horizontal:
            return <div className="item-horizontal-container">
                <div className="item-horizontal" />
            </div>

        default:
            break;
    }
}

