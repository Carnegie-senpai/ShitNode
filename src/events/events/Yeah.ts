import { Message } from "discord.js";
import { Event } from "../Event";

export class Yeah implements Event {
	trigger: RegExp = /(yeah. sure)|(yea. sure)/gi;
	async event(msg: Message<boolean>): Promise<void> {
		await msg.reply("Who's Yassur?");
	};
}