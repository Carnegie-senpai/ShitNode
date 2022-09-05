import { Message } from "discord.js";
import { Event } from "../Event";


export class Actually implements Event {
	trigger: RegExp = /.*actually/gi;
	async event(msg: Message) {
		await msg.reply("Who's Ashley?")
	}
}