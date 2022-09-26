import { Message } from "discord.js";
import { Event } from "../Event";


export class Actually implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.*actually/gi) !== null;
	} 
	async event(msg: Message) {
		await msg.reply("Who's Ashley?")
	}
}