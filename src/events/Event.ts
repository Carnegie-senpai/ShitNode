import { Message } from "discord.js";

export interface Event {
	trigger: RegExp;
	event: (msg: Message) => Promise<void>
}