import { Message } from "discord.js";
import { Event } from "../Event";
import { Logger } from "../../Logger";

const exactlyLog = new Logger("Exactly/Exactly")
export class Exactly implements Event {
	async trigger(msg: Message) {
		return msg.content.match(/.*exactly/gi) !== null;
	}
	async event(msg: Message) {
		exactlyLog.info( "Detected somebody saying exactly")
		await msg.reply("Who's Zack Lee?");
	}
}