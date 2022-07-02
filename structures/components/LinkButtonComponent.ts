import type { Session } from "../../session/Session.ts";
import type { DiscordComponent, ButtonStyles } from "../../vendor/external.ts";
import type { LinkButtonComponent } from "./Component.ts";
import { MessageComponentTypes } from "../../vendor/external.ts";
import BaseComponent from "./Component.ts";
import Emoji from "../Emoji.ts";

export class LinkButton extends BaseComponent implements LinkButtonComponent {
    constructor(session: Session, data: DiscordComponent) {
        super(data.type);

        this.session = session;
        this.type = data.type as MessageComponentTypes.Button;
        this.url = data.url!;
        this.label = data.label;
        this.style = data.style as number;
        this.disabled = data.disabled;

        if (data.emoji) {
            this.emoji = new Emoji(session, data.emoji);
        }
    }

    readonly session: Session;
    override type: MessageComponentTypes.Button;
    url: string;
    label?: string;
    style: ButtonStyles.Link;
    disabled?: boolean;
    emoji?: Emoji;
}

export default LinkButton;
