import { Message } from "discord.js";
import { Event } from "../Event";
import { Logger } from "../../Logger";

const actuallyLog = new Logger("Actually/Actually")
export class Actually implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.*actually/gi) !== null;
	} 
	async event(msg: Message) {
		actuallyLog.info("Detected somebody saying actually")
		await msg.reply("Who's Ashley?")
	}
}