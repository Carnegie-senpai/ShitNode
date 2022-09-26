import { Message } from "discord.js";
import { Event } from "../Event";

export class Exactly implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.*exactly/gi) !== null;
	}
	async event(msg: Message) {
		await msg.reply("Who's Zack Lee?");
	}
}