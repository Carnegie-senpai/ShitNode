import { Message } from "discord.js";

export interface Event {
	trigger(msg: Message): Promise<boolean>;
	event(msg: Message): Promise<void>
}