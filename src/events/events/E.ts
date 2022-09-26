import { Message } from "discord.js";
import { Event } from "../Event";

export class E implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/^e$/gi) !== null;
	}
	
	async event(msg: Message<boolean>): Promise<void> {
		await msg.react("Clout:333845251511025684")
	}
}