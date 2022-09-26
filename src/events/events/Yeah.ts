import { Message } from "discord.js";
import { Event } from "../Event";

export class Yeah implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/(yeah. sure)|(yea. sure)/gi) !== null;
	}

	async event(msg: Message<boolean>): Promise<void> {
		await msg.reply("Who's Yassur?");
	};
}