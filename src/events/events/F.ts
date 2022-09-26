import { Message } from "discord.js";
import { Event } from "../Event";

export class F implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.* f .*chat/gi) !== null;
	};
	async event(msg: Message): Promise<void> {
		await msg.reply("F");
	}
}