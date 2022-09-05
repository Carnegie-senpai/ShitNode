import { Message } from "discord.js";
import { Event } from "../Event";

export class Exactly implements Event {
	trigger = /.*exactly/gi;
	async event(msg: Message) {
		await msg.reply("Who's Zack Lee?");
	}
}