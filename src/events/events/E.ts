import { Message } from "discord.js";
import { Event } from "../Event";

export class E implements Event {
	trigger: RegExp =/^e$/gi;
	async event(msg: Message<boolean>): Promise<void> {
		await msg.react("Clout:333845251511025684")
	}
}